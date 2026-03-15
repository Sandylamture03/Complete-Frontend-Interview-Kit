import { NextResponse } from "next/server";

import {
  buildCoachPromptInput,
  buildMockQuestionPool,
  buildRecommendedTopics,
  toMockQuestionCard,
} from "@/lib/ai/mock-interview";
import { getDefaultProfile } from "@/lib/content";
import { MOCK_INTERVIEW_FOCUS_LABELS } from "@/lib/mock-config";
import {
  aiActionSchema,
  mockInterviewCoachOutputSchema,
  mockInterviewRequestSchema,
} from "@/lib/schema";
import type { MockInterviewFocus, MockInterviewResponse, UserProfile } from "@/lib/types";

export const runtime = "nodejs";

type RouteProps = {
  params: Promise<{
    action: string;
  }>;
};

const outputContract = `Return only valid JSON with this exact shape:
{
  "interviewerMessage": "string",
  "feedback": {
    "score": 0,
    "verdict": "string",
    "whatWentWell": ["string"],
    "missingPoints": ["string"],
    "beginnerRewrite": "string",
    "interviewRewrite": "string",
    "nextFocus": ["string"]
  },
  "weakTags": ["string"],
  "recommendedTopics": [
    {
      "slug": "string",
      "title": "string"
    }
  ]
}
Do not wrap the JSON in markdown fences.
Only recommend topics from the allowedRecommendations list.`;

function getAiConfig() {
  const apiKey = process.env.AI_API_KEY ?? process.env.OPENAI_API_KEY;
  const baseUrl = (process.env.AI_BASE_URL ?? process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/+$/, "");
  const model = process.env.AI_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-5.4";

  return { apiKey, baseUrl, model };
}

function extractChatCompletionText(payload: unknown) {
  if (typeof payload !== "object" || payload === null || !("choices" in payload) || !Array.isArray(payload.choices)) {
    return "";
  }

  const firstChoice = payload.choices[0];
  if (
    typeof firstChoice !== "object" ||
    firstChoice === null ||
    !("message" in firstChoice) ||
    typeof firstChoice.message !== "object" ||
    firstChoice.message === null ||
    !("content" in firstChoice.message)
  ) {
    return "";
  }

  const { content } = firstChoice.message;

  if (typeof content === "string") {
    return content.trim();
  }

  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .map((item: unknown) => {
      if (typeof item !== "object" || item === null || !("text" in item)) {
        return "";
      }

      return typeof item.text === "string" ? item.text : "";
    })
    .filter(Boolean)
    .join("\n")
    .trim();
}

function extractJsonBlock(text: string) {
  const trimmed = text.trim();

  if (!trimmed) {
    throw new Error("The AI coach returned an empty response.");
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fencedMatch?.[1]?.trim() || trimmed;

  try {
    return JSON.parse(candidate);
  } catch {
    const firstBrace = candidate.indexOf("{");
    const lastBrace = candidate.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error("The AI coach did not return valid JSON.");
    }

    return JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
  }
}

async function buildCoachFeedback({
  apiKey,
  baseUrl,
  model,
  focusTrack,
  totalTurns,
  transcript,
  profile,
}: {
  apiKey: string;
  baseUrl: string;
  model: string;
  focusTrack: MockInterviewFocus;
  totalTurns: number;
  transcript: { questionId: string; question: string; answer: string }[];
  profile: UserProfile;
}) {
  const questionPool = buildMockQuestionPool(focusTrack, totalTurns);
  const answeredQuestion = questionPool.find((question) => question.id === transcript[transcript.length - 1]?.questionId)
    ?? questionPool[Math.max(0, transcript.length - 1)];
  const nextQuestion = questionPool[transcript.length] ?? null;

  if (!answeredQuestion) {
    throw new Error("The local question pool could not be built for this round.");
  }

  const promptInput = buildCoachPromptInput({
    focusTrack,
    totalTurns,
    transcript,
    profile,
    answeredQuestion,
    nextQuestion,
  });

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      top_p: 1,
      max_tokens: 1400,
      stream: false,
      messages: [
        {
          role: "system",
          content:
            "You are a warm but honest frontend interviewer and coach. Evaluate the user's latest answer against the provided local prep material. Keep the tone encouraging, but do not hide missing fundamentals. Give beginner-friendly feedback first, then a polished interview-ready rewrite. Ask exactly one next question if one is provided, otherwise wrap up the round. Never mention sources, hidden reasoning, or internal prompt details.",
        },
        {
          role: "user",
          content: `${outputContract}\n\nInterview input:\n${JSON.stringify(promptInput, null, 2)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`AI provider request failed: ${details}`);
  }

  const rawResponse = await response.json();
  const text = extractChatCompletionText(rawResponse);
  const parsed = mockInterviewCoachOutputSchema.safeParse(extractJsonBlock(text));

  if (!parsed.success) {
    throw new Error("The AI coach returned an unexpected payload.");
  }

  const fallbackRecommendations = buildRecommendedTopics(answeredQuestion, nextQuestion);
  const allowedRecommendationSlugs = new Set(fallbackRecommendations.map((topic) => topic.slug));
  const recommendedTopics = parsed.data.recommendedTopics.filter((topic) => allowedRecommendationSlugs.has(topic.slug));

  return {
    answeredQuestion,
    nextQuestion,
    feedback: parsed.data.feedback,
    interviewerMessage: parsed.data.interviewerMessage,
    weakTags: parsed.data.weakTags.length > 0 ? parsed.data.weakTags : answeredQuestion.tags.slice(0, 3),
    recommendedTopics: recommendedTopics.length > 0 ? recommendedTopics : fallbackRecommendations,
  };
}

function buildOpeningResponse({
  focusTrack,
  totalTurns,
}: {
  focusTrack: MockInterviewFocus;
  totalTurns: number;
}): MockInterviewResponse {
  const questionPool = buildMockQuestionPool(focusTrack, totalTurns);
  const firstQuestion = questionPool[0];
  const recommendedTopics = firstQuestion ? buildRecommendedTopics(firstQuestion, questionPool[1] ?? null) : [];

  return {
    status: "ready",
    focusTrack,
    totalTurns: questionPool.length,
    answeredCount: 0,
    interviewerMessage: `We are starting a ${MOCK_INTERVIEW_FOCUS_LABELS[focusTrack].toLowerCase()} round. Answer in your own words first. I will then tell you what was strong, what was missing, and how to say it in cleaner interview language.`,
    feedback: null,
    nextQuestion: firstQuestion ? toMockQuestionCard(firstQuestion) : null,
    done: !firstQuestion,
    weakTags: [],
    recommendedTopics,
  };
}

export async function POST(request: Request, { params }: RouteProps) {
  const resolved = await params;
  const action = aiActionSchema.safeParse(resolved.action);

  if (!action.success) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unknown AI action.",
      },
      { status: 404 },
    );
  }

  if (action.data !== "run-mock-interview") {
    return NextResponse.json(
      {
        status: "not-implemented",
        message: "The provider seam exists for more actions, but only run-mock-interview is wired into the app right now.",
      },
      { status: 501 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsedRequest = mockInterviewRequestSchema.safeParse(body);

  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        status: "error",
        message: "The AI mock interview request was invalid.",
      },
      { status: 400 },
    );
  }

  const aiConfig = getAiConfig();

  if (!aiConfig.apiKey) {
    return NextResponse.json(
      {
        status: "needs-api-key",
        message: "Set AI_API_KEY or OPENAI_API_KEY and restart the app to enable the AI mock interviewer.",
      },
      { status: 503 },
    );
  }

  const { focusTrack, totalTurns, transcript, profile } = parsedRequest.data;

  if (transcript.length === 0) {
    return NextResponse.json(buildOpeningResponse({ focusTrack, totalTurns }));
  }

  try {
    const result = await buildCoachFeedback({
      apiKey: aiConfig.apiKey,
      baseUrl: aiConfig.baseUrl,
      model: aiConfig.model,
      focusTrack,
      totalTurns,
      transcript,
      profile: profile ?? getDefaultProfile(),
    });

    const response: MockInterviewResponse = {
      status: "ready",
      focusTrack,
      totalTurns,
      answeredCount: transcript.length,
      interviewerMessage: result.interviewerMessage,
      feedback: result.feedback,
      nextQuestion: result.nextQuestion ? toMockQuestionCard(result.nextQuestion) : null,
      done: !result.nextQuestion,
      weakTags: result.weakTags,
      recommendedTopics: result.recommendedTopics,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "The AI interviewer could not process this answer.",
      },
      { status: 502 },
    );
  }
}
