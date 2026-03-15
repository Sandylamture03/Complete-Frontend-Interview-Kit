import fs from "node:fs/promises";
import path from "node:path";

import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

const rootDir = process.cwd();
const contextDir = path.join(rootDir, "context");
const generatedDir = path.join(rootDir, "content", "generated");

const stopWords = new Set([
  "disclaimer:",
  "copyright notice",
  "thank you for respecting the intellectual property rights of ankit nagar ( @geeky_frontend )",
]);

function inferTrack(fileName) {
  const name = fileName.toLowerCase();

  if (name.includes("react")) return "react";
  if (name.includes("machine")) return "machine-coding";
  if (name.includes("system design")) return "system-design";
  if (name.includes("security") || name.includes("performance")) return "performance-security";
  if (name.includes("dsa")) return "dsa";
  if (name.includes("html") || name.includes("css")) return "html-css";
  if (name.includes("email") || name.includes("resume")) return "resume-behavioral";
  if (name.includes("browser") || name.includes("dom")) return "browser";
  if (name.includes("js") || name.includes("javascript")) return "javascript";
  return "frontend";
}

function categorize(fileName) {
  return fileName.toLowerCase().endsWith(".docx") ? "document" : "ebook";
}

function sanitizeText(input) {
  return input
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !stopWords.has(line.toLowerCase()))
    .join("\n");
}

function createPreview(text) {
  return text.replace(/\s+/g, " ").slice(0, 260);
}

function normalizeQuestionPrompt(line) {
  return line
    .replace(/^[0-9]+[\).\]]\s*/, "")
    .replace(/^[\-\u2022]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractQuestionCandidates(text) {
  const seen = new Set();
  const questions = [];
  const lines = text.split("\n").map((line) => normalizeQuestionPrompt(line));

  for (const line of lines) {
    if (line.length < 15 || line.length > 180) continue;
    const looksLikeQuestion = line.endsWith("?") || /^(what|why|how|when|which|explain|describe|compare)\b/i.test(line);
    if (!looksLikeQuestion) continue;

    const key = line.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    questions.push(line);
  }

  return questions;
}

async function extractDocx(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return sanitizeText(result.value);
}

async function extractPdf(filePath) {
  const buffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return sanitizeText(result.text || "");
}

function shouldFallbackToManual(relativePath, extractedText) {
  if (relativePath === "SANDEEP_LAMTURE_-_React_ats_resume.pdf") {
    return true;
  }

  if (!extractedText) return true;

  const weirdCharCount = extractedText.replace(/[\x20-\x7E\s]/g, "").length;
  return weirdCharCount / Math.max(extractedText.length, 1) > 0.2;
}

async function processFile(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  const fileName = path.basename(relativePath);
  const extension = path.extname(fileName).toLowerCase();
  let extractedText = "";
  let importStatus = "parsed";

  try {
    extractedText = extension === ".docx" ? await extractDocx(absolutePath) : await extractPdf(absolutePath);
  } catch (error) {
    importStatus = "manual-only";
    extractedText = "";
    console.warn(`Failed to parse ${relativePath}:`, error instanceof Error ? error.message : error);
  }

  if (shouldFallbackToManual(relativePath, extractedText)) {
    importStatus = "manual-only";
  }

  const sourceId = relativePath.replace(/[\\/.\s]+/g, "-").toLowerCase();
  const questionCandidates = extractQuestionCandidates(extractedText);

  return {
    source: {
      id: sourceId,
      name: fileName,
      path: relativePath.replace(/\\/g, "/"),
      extension,
      category: categorize(fileName),
      trackHint: inferTrack(fileName),
      importStatus,
      charCount: extractedText.length,
      extractedPreview: createPreview(extractedText),
      questionCount: questionCandidates.length,
      highlights: questionCandidates.slice(0, 4),
    },
    questions: questionCandidates.map((prompt, index) => ({
      id: `${sourceId}-${index + 1}`,
      sourceId,
      prompt,
      track: inferTrack(fileName),
      tags: [inferTrack(fileName), categorize(fileName)],
    })),
  };
}

async function main() {
  await fs.mkdir(generatedDir, { recursive: true });

  const contextFiles = await fs.readdir(contextDir);
  const relativeFiles = contextFiles.map((fileName) => path.join("context", fileName));
  relativeFiles.push("SANDEEP_LAMTURE_-_React_ats_resume.pdf");

  const processed = await Promise.all(relativeFiles.map((relativePath) => processFile(relativePath)));
  const sources = processed.map((item) => item.source);
  const rawQuestions = processed.flatMap((item) => item.questions);

  const library = {
    generatedAt: new Date().toISOString(),
    sources,
    rawQuestions,
    manualResumeSource: {
      path: "SANDEEP_LAMTURE_-_React_ats_resume.pdf",
      note: "Resume PDF is tracked as a source, but manual profile onboarding remains the default path for user data.",
    },
  };

  await fs.writeFile(
    path.join(generatedDir, "source-manifest.json"),
    JSON.stringify(sources, null, 2),
    "utf8",
  );
  await fs.writeFile(path.join(generatedDir, "library.json"), JSON.stringify(library, null, 2), "utf8");

  console.log(`Imported ${sources.length} sources and ${rawQuestions.length} raw questions.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
