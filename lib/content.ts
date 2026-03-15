import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import Fuse from "fuse.js";

import {
  authoredQuestions,
  authoredTopics,
  codingPrompts,
  defaultProfile,
  offlineResourcePacks,
  resumePrompts,
} from "@/content/authored";
import { generatedLibrarySchema } from "@/lib/schema";
import type {
  DashboardSnapshot,
  GeneratedLibrary,
  InterviewBankExperienceSection,
  InterviewBankQuestion,
  InterviewBankTopicSection,
  InterviewBankTrackSection,
  OfflineResourcePack,
  Question,
  Topic,
  Track,
  TrackSummary,
} from "@/lib/types";
import { INTERVIEW_EXPERIENCE_LEVELS, TRACKS } from "@/lib/types";
import {
  INTERVIEW_EXPERIENCE_DESCRIPTIONS,
  INTERVIEW_EXPERIENCE_LABELS,
  TRACK_DESCRIPTIONS,
  TRACK_LABELS,
} from "@/lib/utils";

const fallbackGeneratedLibrary: GeneratedLibrary = {
  generatedAt: "Not generated yet",
  sources: [],
  rawQuestions: [],
  manualResumeSource: {
    path: "SANDEEP_LAMTURE_-_React_ats_resume.pdf",
    note: "Manual profile onboarding is the default until the resume is curated.",
  },
};

export function loadGeneratedLibrary(): GeneratedLibrary {
  const filePath = path.join(process.cwd(), "content", "generated", "library.json");
  if (!existsSync(filePath)) {
    return fallbackGeneratedLibrary;
  }

  const file = readFileSync(filePath, "utf8");
  return generatedLibrarySchema.parse(JSON.parse(file));
}

export function getAllTopics() {
  return authoredTopics;
}

export function getAllQuestions() {
  return authoredQuestions;
}

export function getCodingPrompts() {
  return codingPrompts;
}

export function getDefaultProfile() {
  return defaultProfile;
}

export function getResumePrompts() {
  return resumePrompts;
}

export function getOfflineResourcePacks() {
  return offlineResourcePacks;
}

export function getOfflineResourcePackBySlug(slug: string) {
  return offlineResourcePacks.find((pack) => pack.slug === slug);
}

export function getOfflineResourcePacksByTrack(track: Track) {
  return offlineResourcePacks.filter((pack) => pack.mappedTracks.includes(track));
}

export function getOfflineResourceGroups() {
  const groups = new Map<OfflineResourcePack["group"], OfflineResourcePack[]>();

  offlineResourcePacks.forEach((pack) => {
    const current = groups.get(pack.group) ?? [];
    current.push(pack);
    groups.set(pack.group, current);
  });

  return groups;
}

export function getTopicBySlug(slug: string) {
  return authoredTopics.find((topic) => topic.slug === slug);
}

export function getQuestionsByTopicId(topicId: string) {
  return authoredQuestions.filter((question) => question.topicId === topicId);
}

export function getTopicsByTrack(track: Track) {
  return authoredTopics.filter((topic) => topic.track === track);
}

export function searchTopics(query: string, initialTopics: Topic[] = authoredTopics) {
  const normalized = query.trim();
  if (!normalized) {
    return initialTopics;
  }

  const fuse = new Fuse(initialTopics, {
    threshold: 0.32,
    keys: ["title", "summary", "tags", "simpleExplanation", "interviewAnswer"],
  });

  return fuse.search(normalized).map((item) => item.item);
}

export function getTrackSummaries(): TrackSummary[] {
  const generatedLibrary = loadGeneratedLibrary();

  return TRACKS.map((track) => {
    const topics = getTopicsByTrack(track);
    const questionCount = authoredQuestions.filter((question) => question.track === track).length;
    const resourceCount = generatedLibrary.sources.filter((source) => source.trackHint === track).length;

    return {
      track,
      label: TRACK_LABELS[track],
      description: TRACK_DESCRIPTIONS[track],
      topicCount: topics.length,
      questionCount,
      resourceCount,
      priorityTopics: topics.slice(0, 3).map((topic) => topic.title),
    };
  });
}

export function getDashboardSnapshot(): DashboardSnapshot {
  return {
    topics: getAllTopics(),
    questions: getAllQuestions(),
    codingPrompts: getCodingPrompts(),
    generatedLibrary: loadGeneratedLibrary(),
    trackSummaries: getTrackSummaries(),
  };
}

export function getFeaturedTopics() {
  return [
    authoredTopics.find((topic) => topic.id === "react-hooks"),
    authoredTopics.find((topic) => topic.id === "machine-coding"),
    authoredTopics.find((topic) => topic.id === "resume-storytelling"),
  ].filter(Boolean) as Topic[];
}

export function getQuestionsForMode(mode: "flashcards" | "mcq" | "timed-verbal" | "mock") {
  if (mode === "mcq") {
    return authoredQuestions.filter((question) => question.mcq);
  }

  if (mode === "timed-verbal") {
    return authoredQuestions.filter((question) => question.timerSeconds);
  }

  if (mode === "mock") {
    return authoredQuestions.slice(0, 10);
  }

  return authoredQuestions;
}

export function getRawResourceHighlights(track?: Track) {
  const generated = loadGeneratedLibrary();
  const sources = track
    ? generated.sources.filter((source) => source.trackHint === track)
    : generated.sources;
  return sources.slice(0, 8);
}

export function getTrackFromSearchParams(input?: string): Track | undefined {
  if (!input) return undefined;
  return TRACKS.find((track) => track === input);
}

export function getRelatedTopics(topic: Topic) {
  const topicMap = new Map(authoredTopics.map((item) => [item.id, item]));
  return topic.relatedTopicIds
    .map((id) => topicMap.get(id))
    .filter(Boolean) as Topic[];
}

function mapQuestionToInterviewLevel(topic: Topic, question: Question) {
  if (question.roundType === "screening" || question.roundType === "theory") {
    return "1-3y" as const;
  }

  if (question.roundType === "coding") {
    return topic.difficulty === "foundation" || topic.difficulty === "1-3y" ? ("1-3y" as const) : ("3-6y" as const);
  }

  if (question.roundType === "design") {
    return topic.track === "system-design" ? ("expert" as const) : ("3-6y" as const);
  }

  if (question.roundType === "machine-coding" || question.roundType === "behavioral") {
    return "expert" as const;
  }

  return "3-6y" as const;
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "can",
  "do",
  "does",
  "for",
  "how",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "the",
  "to",
  "what",
  "when",
  "why",
  "with",
  "you",
  "your",
]);

const fallbackTrackTopics: Record<Track, Topic> = {
  react: {
    id: "react-imported-bank",
    slug: "react-core-questions-from-source-library",
    track: "react",
    difficulty: "3-6y",
    title: "React Core Questions from Source Library",
    summary: "Imported React interview questions that go beyond the hand-curated topic list.",
    simpleExplanation: "This topic collects important React interview ideas like JSX, components, props, state, context, refs, portals, forms, and rendering basics.",
    analogy: "Think of this as the big React question notebook where all the extra classroom questions are collected in one place.",
    interviewAnswer: "This section covers core React interview questions from your imported materials. The focus is understanding React mental models, component design, state flow, rendering behavior, and practical patterns used in real applications.",
    codeSnippet: `function Welcome({ name }: { name: string }) {\n  return <h1>Hello {name}</h1>;\n}`,
    pitfalls: ["Memorizing definitions without understanding component data flow.", "Mixing old class-era terms with modern React without explaining the connection."],
    tags: ["react", "jsx", "components", "props", "state", "context", "refs"],
    oneMinuteAnswer: ["React builds UI from components.", "Props pass data in.", "State stores local changing data.", "Rendering updates only what changed."],
    cheatSheet: ["Components build the UI.", "Props flow down.", "State changes trigger renders.", "Use simple, correct mental models first."],
    sourceRefs: [],
    relatedTopicIds: ["react-rendering", "react-hooks", "react-state"],
  },
  frontend: {
    id: "frontend-imported-bank",
    slug: "frontend-interview-questions-from-source-library",
    track: "frontend",
    difficulty: "3-6y",
    title: "Frontend Breadth Questions from Source Library",
    summary: "Imported frontend interview questions covering broad product engineering topics.",
    simpleExplanation: "This topic groups practical frontend interview questions that are broader than one framework or one browser API.",
    analogy: "It is like the general-knowledge paper for frontend interviews where many useful topics come together.",
    interviewAnswer: "This section helps with broad frontend interview questions around architecture, quality, user experience, testing, maintainability, and product thinking.",
    codeSnippet: `const status = isLoading ? 'Loading...' : hasError ? 'Something went wrong' : 'Ready';`,
    pitfalls: ["Answering only with tool names instead of explaining tradeoffs.", "Skipping user experience, accessibility, or maintainability."],
    tags: ["frontend", "architecture", "testing", "ux", "maintainability"],
    oneMinuteAnswer: ["Think about users first.", "Explain tradeoffs clearly.", "Cover quality, performance, and accessibility.", "Connect code to product outcomes."],
    cheatSheet: ["Users matter.", "Quality matters.", "Tradeoffs matter.", "Clarity matters."],
    sourceRefs: [],
    relatedTopicIds: ["testing", "system-design", "machine-coding"],
  },
  javascript: {
    id: "javascript-imported-bank",
    slug: "javascript-core-questions-from-source-library",
    track: "javascript",
    difficulty: "3-6y",
    title: "JavaScript Core Questions from Source Library",
    summary: "Imported JavaScript interview questions covering fundamentals from beginner to advanced.",
    simpleExplanation: "This topic groups JavaScript questions about variables, scope, closures, promises, arrays, objects, prototypes, and browser runtime behavior.",
    analogy: "It is the main grammar and logic book for JavaScript interviews.",
    interviewAnswer: "This section covers core JavaScript interview questions with focus on language fundamentals, async behavior, runtime concepts, functions, objects, and common coding-round patterns.",
    codeSnippet: `function add(a, b) {\n  return a + b;\n}`,
    pitfalls: ["Remembering outputs without understanding why they happen.", "Ignoring scope, mutation, and async ordering."],
    tags: ["javascript", "closures", "async", "scope", "functions", "promises"],
    oneMinuteAnswer: ["Know scope and closures.", "Know promises and event loop.", "Know arrays and objects.", "Explain why the code behaves that way."],
    cheatSheet: ["Scope first.", "Closures next.", "Async ordering matters.", "Explain reasoning, not just output."],
    sourceRefs: [],
    relatedTopicIds: ["event-loop", "dsa-patterns"],
  },
  browser: {
    id: "browser-imported-bank",
    slug: "browser-dom-questions-from-source-library",
    track: "browser",
    difficulty: "1-3y",
    title: "Browser and DOM Questions from Source Library",
    summary: "Imported browser questions covering DOM, events, and browser APIs.",
    simpleExplanation: "This topic groups browser interview questions about how the page reacts, stores data, and handles events.",
    analogy: "It is like learning the rules of how the classroom itself works, not just the lesson on the board.",
    interviewAnswer: "This section covers browser interview questions around DOM APIs, event flow, rendering pipeline, storage, and user interaction.",
    codeSnippet: `element.addEventListener('click', handleClick);`,
    pitfalls: ["Talking only about framework code and forgetting the browser underneath.", "Ignoring real event flow and browser constraints."],
    tags: ["browser", "dom", "events", "storage"],
    oneMinuteAnswer: ["The browser runs the page.", "DOM events drive interaction.", "Storage and rendering have tradeoffs.", "Frameworks still depend on browser rules."],
    cheatSheet: ["Know DOM.", "Know events.", "Know browser APIs.", "Know the main thread."],
    sourceRefs: [],
    relatedTopicIds: ["dom-events", "accessibility-foundations"],
  },
  "html-css": {
    id: "html-css-imported-bank",
    slug: "html-css-questions-from-source-library",
    track: "html-css",
    difficulty: "1-3y",
    title: "HTML and CSS Questions from Source Library",
    summary: "Imported HTML and CSS interview questions from the raw library.",
    simpleExplanation: "This topic groups markup and styling questions like layout, positioning, specificity, semantics, and responsiveness.",
    analogy: "It is the building-and-painting part of frontend interview prep.",
    interviewAnswer: "This section covers HTML and CSS questions around semantics, layout systems, responsive design, positioning, specificity, and maintainable styling.",
    codeSnippet: `.layout { display: grid; gap: 1rem; }`,
    pitfalls: ["Using wrong semantic elements.", "Confusing layout tools.", "Creating brittle CSS with too many overrides."],
    tags: ["html", "css", "responsive-design", "layout"],
    oneMinuteAnswer: ["Structure with HTML.", "Style with CSS.", "Keep layouts responsive.", "Prefer semantics first."],
    cheatSheet: ["Semantics first.", "Layout second.", "Responsive design matters.", "Maintainable CSS matters."],
    sourceRefs: [],
    relatedTopicIds: ["html-css-layout", "accessibility-foundations"],
  },
  accessibility: {
    id: "accessibility-imported-bank",
    slug: "accessibility-questions-from-source-library",
    track: "accessibility",
    difficulty: "3-6y",
    title: "Accessibility Questions from Source Library",
    summary: "Imported accessibility interview questions from your source library.",
    simpleExplanation: "This topic groups questions about keyboard use, labels, focus, semantics, and screen-reader support.",
    analogy: "It is the checklist that makes sure every student can enter the classroom and understand the lesson.",
    interviewAnswer: "This section covers accessibility questions around semantic HTML, keyboard support, focus management, accessible names, and ARIA patterns where needed.",
    codeSnippet: `<button aria-label="Close dialog">Close</button>`,
    pitfalls: ["Treating accessibility like an afterthought.", "Using ARIA without fixing semantics first."],
    tags: ["accessibility", "keyboard", "focus", "aria"],
    oneMinuteAnswer: ["Semantics first.", "Keyboard always.", "Visible focus matters.", "Names and labels matter."],
    cheatSheet: ["Use semantic elements.", "Keep focus visible.", "Support keyboard.", "Use ARIA carefully."],
    sourceRefs: [],
    relatedTopicIds: ["accessibility-foundations", "dom-events"],
  },
  "performance-security": {
    id: "performance-security-imported-bank",
    slug: "performance-security-questions-from-source-library",
    track: "performance-security",
    difficulty: "3-6y",
    title: "Performance and Security Questions from Source Library",
    summary: "Imported performance and security interview questions.",
    simpleExplanation: "This topic groups questions about speed, rendering cost, caching, XSS, and safe frontend behavior.",
    analogy: "It is the part of the exam about making the site fast and safe at the same time.",
    interviewAnswer: "This section covers frontend performance and security questions around web vitals, bundle strategy, rendering cost, sanitization, token handling, and trust boundaries.",
    codeSnippet: `const safeHtml = DOMPurify.sanitize(userHtml);`,
    pitfalls: ["Talking only about scores and forgetting users.", "Trusting unsanitized data."],
    tags: ["performance", "security", "web-vitals", "xss"],
    oneMinuteAnswer: ["Measure user speed.", "Reduce main-thread work.", "Sanitize untrusted HTML.", "Explain trust boundaries."],
    cheatSheet: ["Speed matters.", "Stability matters.", "Sanitize data.", "Think like a user and attacker."],
    sourceRefs: [],
    relatedTopicIds: ["performance-security", "react-performance"],
  },
  dsa: {
    id: "dsa-imported-bank",
    slug: "dsa-questions-from-source-library",
    track: "dsa",
    difficulty: "3-6y",
    title: "DSA Questions from Source Library",
    summary: "Imported DSA interview questions relevant for frontend roles.",
    simpleExplanation: "This topic groups coding-pattern questions like maps, windows, stacks, sorting, and traversal.",
    analogy: "It is the puzzle practice book for interview rounds.",
    interviewAnswer: "This section covers frontend-relevant DSA questions with focus on patterns, reasoning, time complexity, and clear explanation.",
    codeSnippet: `const seen = new Map();`,
    pitfalls: ["Jumping to code too early.", "Skipping brute-force explanation and complexity."],
    tags: ["dsa", "algorithms", "maps", "arrays"],
    oneMinuteAnswer: ["Find the pattern.", "Explain brute force first.", "Optimize second.", "State complexity clearly."],
    cheatSheet: ["Maps help lookups.", "Windows help ranges.", "Stacks help nested problems.", "Complexity must be clear."],
    sourceRefs: [],
    relatedTopicIds: ["dsa-patterns", "machine-coding"],
  },
  "machine-coding": {
    id: "machine-coding-imported-bank",
    slug: "machine-coding-questions-from-source-library",
    track: "machine-coding",
    difficulty: "3-6y",
    title: "Machine Coding Questions from Source Library",
    summary: "Imported machine-coding questions and practical UI prompts.",
    simpleExplanation: "This topic groups practical questions about building UI quickly with clear state and structure.",
    analogy: "It is the hands-on lab exam for frontend interviews.",
    interviewAnswer: "This section covers machine-coding prompts around scoping, state modeling, reusable UI, validation, accessibility, and time-boxed delivery.",
    codeSnippet: `const [items, setItems] = useState([]);`,
    pitfalls: ["Skipping requirements discussion.", "Over-engineering before finishing the happy path."],
    tags: ["machine-coding", "ui", "state", "component-design"],
    oneMinuteAnswer: ["Clarify scope first.", "Model state clearly.", "Ship the happy path.", "Add polish if time remains."],
    cheatSheet: ["Requirements first.", "State second.", "Happy path third.", "Explain tradeoffs."],
    sourceRefs: [],
    relatedTopicIds: ["machine-coding", "system-design"],
  },
  "system-design": {
    id: "system-design-imported-bank",
    slug: "system-design-questions-from-source-library",
    track: "system-design",
    difficulty: "3-6y",
    title: "System Design Questions from Source Library",
    summary: "Imported frontend system-design questions from your library.",
    simpleExplanation: "This topic groups big-picture questions about screens, state, caching, failure handling, and scale.",
    analogy: "It is the architecture notebook for how many parts of the app work together.",
    interviewAnswer: "This section covers frontend system-design questions around user flows, screen boundaries, state ownership, caching, resilience, performance, and reusable component design.",
    codeSnippet: `type PageState = { status: 'idle' | 'loading' | 'ready' | 'error' };`,
    pitfalls: ["Talking only about backend APIs.", "Ignoring loading, errors, and accessibility."],
    tags: ["system-design", "architecture", "state", "caching"],
    oneMinuteAnswer: ["Start with users and screens.", "Then state and data flow.", "Then performance and failure modes.", "Then accessibility and observability."],
    cheatSheet: ["Users first.", "State second.", "Performance third.", "Resilience always."],
    sourceRefs: [],
    relatedTopicIds: ["system-design", "react-state"],
  },
  "resume-behavioral": {
    id: "resume-imported-bank",
    slug: "resume-behavioral-questions-from-source-library",
    track: "resume-behavioral",
    difficulty: "3-6y",
    title: "Resume and Behavioral Questions from Source Library",
    summary: "Imported behavioral and project-story questions.",
    simpleExplanation: "This topic groups interview questions about your projects, decisions, mistakes, conflict, and ownership.",
    analogy: "It is the storytelling part of the exam where you explain what you did and why it mattered.",
    interviewAnswer: "This section covers resume and behavioral interview questions using clear structure around context, ownership, decisions, impact, and learning.",
    codeSnippet: `Story = Problem + Ownership + Decision + Impact + Learning`,
    pitfalls: ["Giving vague team-only answers.", "Skipping impact or learning."],
    tags: ["resume", "behavioral", "stories", "ownership"],
    oneMinuteAnswer: ["Use context.", "Show ownership.", "Explain impact.", "End with learning."],
    cheatSheet: ["Problem.", "Ownership.", "Decision.", "Impact.", "Learning."],
    sourceRefs: [],
    relatedTopicIds: ["resume-storytelling", "system-design"],
  },
};

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function normalizeImportedPrompt(prompt: string) {
  const cleaned = prompt.replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return cleaned;
  }

  if (/[?]$/.test(cleaned)) {
    return cleaned;
  }

  if (/^(what|why|how|when|where|which|who|can|is|are|does|do|should|explain|compare|define|list)\b/i.test(cleaned)) {
    return `${cleaned}?`;
  }

  return `Explain this interview idea: ${cleaned}`;
}

function getExampleText(topic: Topic) {
  const codePreview = topic.codeSnippet
    .split("\n")
    .slice(0, 3)
    .join(" ")
    .trim();

  return codePreview.length > 10 ? codePreview : topic.analogy;
}

function scoreOverlap(left: string[], right: string[]) {
  const rightSet = new Set(right);
  let score = 0;

  left.forEach((token) => {
    if (rightSet.has(token)) {
      score += 1;
    }
  });

  return score;
}

function findBestCuratedQuestion(topic: Topic, prompt: string) {
  const promptTokens = tokenize(prompt);
  const candidates = authoredQuestions.filter((question) => question.track === topic.track);

  let bestMatch: Question | undefined;
  let bestScore = 0;

  candidates.forEach((question) => {
    const score = scoreOverlap(promptTokens, tokenize(`${question.prompt} ${question.tags.join(" ")}`));
    if (score > bestScore) {
      bestScore = score;
      bestMatch = question;
    }
  });

  return bestScore >= 2 ? bestMatch : undefined;
}

function getImportedWhyAsked(track: Track, prompt: string) {
  const normalized = prompt.toLowerCase();

  if (/difference|compare|vs/.test(normalized)) {
    return "Interviewers use this to check whether you understand related concepts well enough to compare them clearly.";
  }

  if (/implement|write|build|polyfill|code/.test(normalized)) {
    return "This checks whether you can turn the concept into code and explain the practical decisions while solving it.";
  }

  if (track === "resume-behavioral") {
    return "This helps interviewers judge ownership, communication, honesty, and how clearly you describe your real work.";
  }

  return "This is a common interview question used to test whether your fundamentals are clear, practical, and easy to explain.";
}

function getImportedRoundType(track: Track, prompt: string): Question["roundType"] {
  const normalized = prompt.toLowerCase();

  if (/implement|write|build|polyfill|code/.test(normalized)) {
    return track === "machine-coding" ? "machine-coding" : "coding";
  }

  if (/design|architecture|scale|system|structure/.test(normalized)) {
    return "design";
  }

  if (track === "resume-behavioral") {
    return "behavioral";
  }

  return "theory";
}

function getImportedLevel(track: Track, prompt: string) {
  const normalized = prompt.toLowerCase();

  if (/what is|what are|why use|benefits|jsx|props|state|keys|closure|hoisting|box model|flexbox|grid/.test(normalized)) {
    return "beginner" as const;
  }

  if (/difference|compare|controlled|uncontrolled|context|redux|promise|event loop|delegation|accessibility|responsive/.test(normalized)) {
    return "1-3y" as const;
  }

  if (/optimi|performance|lazy|code split|memo|profil|caching|virtual dom|lifecycle|portal|forwardref|higher-order|hoc/.test(normalized)) {
    return "3-6y" as const;
  }

  if (track === "system-design" || /tradeoff|scale|architecture|design/.test(normalized)) {
    return "expert" as const;
  }

  return "3-6y" as const;
}

function getImportedFollowUps(topic: Topic, match?: Question) {
  if (match) {
    return match.followUps;
  }

  return [...topic.oneMinuteAnswer.slice(0, 2), ...topic.pitfalls.slice(0, 1)];
}

function getImportedSimpleAnswer(topic: Topic, prompt: string, match?: Question) {
  const normalized = prompt.toLowerCase();

  if (match) {
    return match.answerShort;
  }

  if (normalized.includes("jsx")) {
    return "JSX is a React syntax that lets you write UI that looks a bit like HTML inside JavaScript. React turns that syntax into element objects.";
  }

  if (normalized.includes("props") && normalized.includes("state")) {
    return "Props are values given from a parent component. State is local data that a component manages and can change over time.";
  }

  if (normalized.includes("context")) {
    return "Context lets you share data through a component tree without passing props manually through every level.";
  }

  if (normalized.includes("redux")) {
    return "Redux is a state-management pattern where state changes are handled in a predictable way through actions and reducers.";
  }

  if (normalized.includes("portal")) {
    return "A portal lets React render part of the UI in a different place in the DOM while keeping it in the same React tree.";
  }

  if (normalized.includes("forwardref") || normalized.includes("ref")) {
    return "Refs give you direct access to a DOM node or component instance-like value. forwardRef lets a parent pass a ref through a component.";
  }

  if (normalized.includes("lazy") || normalized.includes("code split")) {
    return "Lazy loading and code splitting mean loading only the code needed now, instead of shipping everything on the first page load.";
  }

  if (normalized.includes("lifecycle")) {
    return "Lifecycle methods describe when work happens as a component mounts, updates, and unmounts. In modern React, hooks often replace most class lifecycle usage.";
  }

  if (normalized.includes("closure")) {
    return "A closure means a function remembers the variables around it from where it was created.";
  }

  if (normalized.includes("promise")) {
    return "A promise is an object that represents work that will finish later with either a success value or an error.";
  }

  if (normalized.includes("flexbox")) {
    return "Flexbox is best when layout mainly flows in one direction, like a row or a column.";
  }

  if (normalized.includes("grid")) {
    return "Grid is best when you want rows and columns to work together in a stronger layout system.";
  }

  return topic.simpleExplanation;
}

function getImportedInterviewAnswer(topic: Topic, prompt: string, match?: Question) {
  const normalized = prompt.toLowerCase();

  if (match) {
    return match.answerDeep;
  }

  if (normalized.includes("jsx")) {
    return "JSX is syntax sugar that lets React developers express UI declaratively inside JavaScript. It is transpiled into React element creation calls, which means browsers do not understand JSX directly but the build tool converts it before runtime.";
  }

  if (normalized.includes("props") && normalized.includes("state")) {
    return "Props are read-only inputs passed from parent to child, while state is data owned and updated by a component. Props help with composition and reuse, while state models values that change over time and drive rerenders.";
  }

  if (normalized.includes("context")) {
    return "Context is a built-in React mechanism for sharing values through a subtree without prop drilling every intermediate component. It is useful for app-wide or section-wide concerns, but it should not replace thoughtful state ownership because broad context updates can widen rerender scope.";
  }

  if (normalized.includes("redux")) {
    return "Redux centralizes state updates through actions, reducers, and a single predictable state tree. It helps when many parts of the UI depend on shared business state, but teams should still separate server data, local UI state, and derived values instead of pushing everything into one global store.";
  }

  if (normalized.includes("portal")) {
    return "Portals let React render UI into a DOM node outside the normal parent container while preserving React tree relationships such as context and event bubbling. They are commonly used for modals, tooltips, and overlays.";
  }

  if (normalized.includes("forwardref") || normalized.includes("ref")) {
    return "Refs are useful when you need imperative access to a DOM element for focus, measurement, or integration with non-React code. forwardRef allows reusable components to expose that underlying ref safely to parent components.";
  }

  if (normalized.includes("lazy") || normalized.includes("code split")) {
    return "Lazy loading and code splitting reduce initial bundle cost by loading less JavaScript upfront. In React this is often done with dynamic imports and route or component boundaries so the user downloads heavy code only when it is needed.";
  }

  if (normalized.includes("lifecycle")) {
    return "Class components use lifecycle methods such as componentDidMount, componentDidUpdate, and componentWillUnmount to run logic around mounting, updating, and cleanup. In modern React, hooks like useEffect usually handle the same concerns in function components.";
  }

  if (normalized.includes("closure")) {
    return "Closures are fundamental in JavaScript because functions capture the lexical environment where they are created. In React this matters a lot because handlers, effects, and timers can accidentally hold stale values if dependencies or updater patterns are not handled carefully.";
  }

  if (normalized.includes("promise")) {
    return "Promises represent asynchronous completion and integrate with the microtask queue, which is why their callbacks run before the next macrotask after the current call stack clears. They are central to modern async JavaScript with chaining, async-await, and error propagation.";
  }

  if (normalized.includes("flexbox")) {
    return "Flexbox is a one-dimensional layout system that is excellent for distributing and aligning items along a row or a column. It is ideal for navbars, button rows, stacked cards, and UI sections where content mainly flows in one axis.";
  }

  if (normalized.includes("grid")) {
    return "CSS Grid is a two-dimensional layout system that handles rows and columns together, which makes it strong for page sections, dashboards, and card layouts where both axes matter structurally.";
  }

  return topic.interviewAnswer;
}

function assignImportedQuestionTopic(track: Track, prompt: string, topics: Topic[]) {
  if (topics.length === 0) {
    return undefined;
  }

  if (topics.length === 1) {
    const singleTopic = topics[0];

    if (track === "frontend" && !/(test|jest|rtl|playwright|unit|integration|e2e|snapshot)/i.test(prompt)) {
      return undefined;
    }

    if (track === "javascript" && /(event loop|microtask|macrotask|promise|timer|async)/i.test(prompt)) {
      return singleTopic.id;
    }

    if (track === "javascript") {
      return undefined;
    }

    return singleTopic.id;
  }

  if (track === "react") {
    if (/(effect|hook|useeffect|usestate|cleanup|stale|closure)/i.test(prompt)) {
      return "react-hooks";
    }

    if (/(context|redux|controlled|uncontrolled|state|props|reducer|forwardref|ref|portal|hoc|higher-order)/i.test(prompt)) {
      return "react-state";
    }

    if (/(lazy|code split|performance|profile|memo|pure component|web worker)/i.test(prompt)) {
      return "react-performance";
    }

    if (/(jsx|virtual dom|render|reconciliation|keys|component|lifecycle|reactjs|benefits)/i.test(prompt)) {
      return "react-rendering";
    }
  }

  const promptTokens = tokenize(prompt);
  let bestTopicId: string | undefined;
  let bestScore = 0;

  topics.forEach((topic) => {
    const topicTokens = tokenize(`${topic.title} ${topic.summary} ${topic.tags.join(" ")}`);
    const score = scoreOverlap(promptTokens, topicTokens);
    if (score > bestScore) {
      bestScore = score;
      bestTopicId = topic.id;
    }
  });

  return bestScore > 0 ? bestTopicId : undefined;
}

function buildImportedInterviewQuestions(topic: Topic, rawQuestions: GeneratedLibrary["rawQuestions"], generatedLibrary: GeneratedLibrary): InterviewBankQuestion[] {
  const sourceMap = new Map(generatedLibrary.sources.map((source) => [source.id, source.name]));

  return rawQuestions
    .filter((rawQuestion) => rawQuestion.prompt.trim().length > 8)
    .map((rawQuestion) => {
      const normalizedPrompt = normalizeImportedPrompt(rawQuestion.prompt);
      const match = findBestCuratedQuestion(topic, normalizedPrompt);

      return {
        id: `imported-${rawQuestion.id}`,
        level: getImportedLevel(topic.track, normalizedPrompt),
        prompt: normalizedPrompt,
        simpleAnswer: getImportedSimpleAnswer(topic, normalizedPrompt, match),
        answer: getImportedInterviewAnswer(topic, normalizedPrompt, match),
        example: getExampleText(topic),
        whyAsked: getImportedWhyAsked(topic.track, normalizedPrompt),
        roundType: getImportedRoundType(topic.track, normalizedPrompt),
        followUps: getImportedFollowUps(topic, match),
        tags: Array.from(new Set([...topic.tags, ...rawQuestion.tags])).slice(0, 8),
        sourceLabel: sourceMap.get(rawQuestion.sourceId),
        sourceKind: "imported",
      };
    });
}

function buildExperienceSections(
  topic: Topic,
  importedQuestions: GeneratedLibrary["rawQuestions"] = [],
  generatedLibrary: GeneratedLibrary = fallbackGeneratedLibrary,
): InterviewBankExperienceSection[] {
  const allQuestions = [
    ...buildGeneratedInterviewQuestions(topic),
    ...buildCuratedInterviewQuestions(topic),
    ...buildImportedInterviewQuestions(topic, importedQuestions, generatedLibrary),
  ];

  return INTERVIEW_EXPERIENCE_LEVELS.map((level) => ({
    level,
    label: INTERVIEW_EXPERIENCE_LABELS[level],
    description: INTERVIEW_EXPERIENCE_DESCRIPTIONS[level],
    questions: allQuestions.filter((question) => question.level === level),
  }));
}

function buildInterviewBankTopic(
  topic: Topic,
  importedQuestions: GeneratedLibrary["rawQuestions"] = [],
  generatedLibrary: GeneratedLibrary = fallbackGeneratedLibrary,
): InterviewBankTopicSection {
  return {
    topicId: topic.id,
    topicSlug: topic.slug,
    topicTitle: topic.title,
    track: topic.track,
    summary: topic.summary,
    difficulty: topic.difficulty,
    tags: topic.tags,
    experienceSections: buildExperienceSections(topic, importedQuestions, generatedLibrary),
  };
}

export function getInterviewBankByTrack(track: Track): InterviewBankTrackSection {
  const generatedLibrary = loadGeneratedLibrary();
  const authoredTrackTopics = getTopicsByTrack(track);
  const assignmentMap = new Map<string, GeneratedLibrary["rawQuestions"]>();
  const fallbackRawQuestions: GeneratedLibrary["rawQuestions"] = [];

  generatedLibrary.rawQuestions
    .filter((rawQuestion) => rawQuestion.track === track)
    .forEach((rawQuestion) => {
      const assignedTopicId = assignImportedQuestionTopic(track, rawQuestion.prompt, authoredTrackTopics);

      if (!assignedTopicId) {
        fallbackRawQuestions.push(rawQuestion);
        return;
      }

      const current = assignmentMap.get(assignedTopicId) ?? [];
      current.push(rawQuestion);
      assignmentMap.set(assignedTopicId, current);
    });

  const topics = authoredTrackTopics.map((topic) =>
    buildInterviewBankTopic(topic, assignmentMap.get(topic.id) ?? [], generatedLibrary),
  );

  if (fallbackRawQuestions.length > 0) {
    topics.push(buildInterviewBankTopic(fallbackTrackTopics[track], fallbackRawQuestions, generatedLibrary));
  }

  return {
    track,
    label: TRACK_LABELS[track],
    description: TRACK_DESCRIPTIONS[track],
    totalQuestions: topics.reduce(
      (sum, topic) => sum + topic.experienceSections.reduce((topicSum, section) => topicSum + section.questions.length, 0),
      0,
    ),
    topicCount: topics.length,
    topics,
  };
}

export function getInterviewBankTracks() {
  return TRACKS.map((track) => getInterviewBankByTrack(track));
}

function buildGeneratedInterviewQuestions(topic: Topic): InterviewBankQuestion[] {
  const relatedTitles = topic.relatedTopicIds
    .map((id) => authoredTopics.find((item) => item.id === id)?.title)
    .filter(Boolean) as string[];

  return [
    {
      id: `${topic.id}-beginner-core`,
      level: "beginner",
      prompt: `Explain ${topic.title} in very simple words.`,
      simpleAnswer: topic.simpleExplanation,
      answer: `${topic.simpleExplanation} Easy picture: ${topic.analogy}`,
      example: topic.analogy,
      whyAsked: "Interviewers often begin with a basic question to see whether you truly understand the concept instead of repeating memorized jargon.",
      roundType: "screening",
      followUps: topic.oneMinuteAnswer.slice(0, 3),
      tags: topic.tags,
      sourceKind: "curated",
    },
    {
      id: `${topic.id}-beginner-basics`,
      level: "beginner",
      prompt: `What are the first basics to remember about ${topic.title}?`,
      simpleAnswer: topic.cheatSheet.join(" "),
      answer: topic.cheatSheet.join(" "),
      example: topic.analogy,
      whyAsked: "This checks whether you can give a short, calm answer before the interviewer adds depth or follow-ups.",
      roundType: "screening",
      followUps: topic.pitfalls.slice(0, 2),
      tags: topic.tags,
      sourceKind: "curated",
    },
    {
      id: `${topic.id}-one-three-core`,
      level: "1-3y",
      prompt: `What points should a 1-3 year frontend developer cover for ${topic.title}?`,
      simpleAnswer: topic.oneMinuteAnswer.join(" "),
      answer: topic.oneMinuteAnswer.join(" "),
      example: topic.analogy,
      whyAsked: "This checks whether you can give a clean interview answer without getting lost in too much detail.",
      roundType: "theory",
      followUps: topic.cheatSheet.slice(0, 3),
      tags: topic.tags,
      sourceKind: "curated",
    },
    {
      id: `${topic.id}-mid-core`,
      level: "3-6y",
      prompt: `How would you answer ${topic.title} in a mid-level frontend interview?`,
      simpleAnswer: topic.simpleExplanation,
      answer: topic.interviewAnswer,
      example: topic.codeSnippet.split("\n").slice(0, 3).join(" "),
      whyAsked: "Mid-level rounds expect more than definitions. They want structured explanation, correct terminology, and practical judgment.",
      roundType: "theory",
      followUps: topic.oneMinuteAnswer,
      tags: topic.tags,
      sourceKind: "curated",
    },
    {
      id: `${topic.id}-expert-tradeoffs`,
      level: "expert",
      prompt: `What tradeoffs, pitfalls, and production issues do you discuss for ${topic.title} in an expert-style round?`,
      simpleAnswer: `${topic.simpleExplanation} The main thing to avoid is: ${topic.pitfalls[0] ?? "missing the core idea."}`,
      answer: `${topic.interviewAnswer} Common pitfalls: ${topic.pitfalls.join(" ")}${
        relatedTitles.length > 0 ? ` Related areas to connect in follow-ups: ${relatedTitles.join(", ")}.` : ""
      }`,
      example: topic.codeSnippet.split("\n").slice(0, 3).join(" "),
      whyAsked: "Senior-leaning interviewers test whether you can move from definitions into tradeoffs, debugging, scale, and connected system thinking.",
      roundType: "design",
      followUps: [
        "What real bug or production issue can this topic cause?",
        "What tradeoff would make you choose one approach over another?",
        "How would you explain this decision in a code review or design discussion?",
      ],
      tags: topic.tags,
      sourceKind: "curated",
    },
  ];
}

function buildCuratedInterviewQuestions(topic: Topic): InterviewBankQuestion[] {
  return getQuestionsByTopicId(topic.id).map((question) => ({
    id: question.id,
    level: mapQuestionToInterviewLevel(topic, question),
    prompt: question.prompt,
    simpleAnswer: question.answerShort,
    answer: question.answerDeep,
    example: topic.codeSnippet.split("\n").slice(0, 3).join(" "),
    whyAsked:
      question.roundType === "coding"
        ? "This checks whether you can apply the concept in code and explain the reasoning, not only define it."
        : question.roundType === "design"
          ? "This checks your decision-making, tradeoffs, and ability to discuss the bigger picture."
          : "This is a common interview question used to test clarity, correctness, and how calmly you explain fundamentals.",
    roundType: question.roundType,
    followUps: question.followUps,
    tags: question.tags,
    sourceKind: "curated",
  }));
}
