import { z } from "zod";

import {
  AI_ACTIONS,
  DIFFICULTIES,
  MOCK_INTERVIEW_FOCUSES,
  ROUND_TYPES,
  SESSION_MODES,
  TRACKS,
} from "@/lib/types";

export const trackSchema = z.enum(TRACKS);
export const difficultySchema = z.enum(DIFFICULTIES);
export const roundTypeSchema = z.enum(ROUND_TYPES);
export const sessionModeSchema = z.enum(SESSION_MODES);
export const aiActionSchema = z.enum(AI_ACTIONS);
export const mockInterviewFocusSchema = z.enum(MOCK_INTERVIEW_FOCUSES);

export const sourceRefSchema = z.object({
  sourceId: z.string(),
  label: z.string(),
  path: z.string(),
  notes: z.string().optional(),
  kind: z.enum(["curated", "imported", "manual"]),
});

export const topicSchema = z.object({
  id: z.string(),
  slug: z.string(),
  track: trackSchema,
  difficulty: difficultySchema,
  title: z.string(),
  summary: z.string(),
  simpleExplanation: z.string(),
  analogy: z.string(),
  interviewAnswer: z.string(),
  codeSnippet: z.string(),
  pitfalls: z.array(z.string()),
  tags: z.array(z.string()),
  oneMinuteAnswer: z.array(z.string()),
  cheatSheet: z.array(z.string()),
  sourceRefs: z.array(sourceRefSchema),
  relatedTopicIds: z.array(z.string()),
});

export const questionSchema = z.object({
  id: z.string(),
  topicId: z.string(),
  track: trackSchema,
  prompt: z.string(),
  answerShort: z.string(),
  answerDeep: z.string(),
  followUps: z.array(z.string()),
  roundType: roundTypeSchema,
  tags: z.array(z.string()),
  timerSeconds: z.number().optional(),
  mcq: z
    .object({
      question: z.string(),
      options: z.array(z.string()).min(2),
      correctAnswer: z.string(),
      explanation: z.string(),
    })
    .optional(),
});

export const codingPromptSchema = z.object({
  id: z.string(),
  track: trackSchema,
  difficulty: difficultySchema,
  title: z.string(),
  scenario: z.string(),
  requirements: z.array(z.string()),
  hints: z.array(z.string()),
  solutionOutline: z.array(z.string()),
  evaluationChecklist: z.array(z.string()),
  starterCode: z.string().optional(),
  sourceRefs: z.array(sourceRefSchema),
});

export const userProfileSchema = z.object({
  name: z.string(),
  title: z.string(),
  yearsExperience: z.string(),
  targetBand: z.string(),
  coreStack: z.array(z.string()),
  projectHighlights: z.array(z.string()),
  weakAreas: z.array(z.string()),
  targetCompanies: z.array(z.string()),
  elevatorPitch: z.string(),
  resumeNotes: z.array(z.string()),
});

export const sessionResultSchema = z.object({
  id: z.string(),
  mode: sessionModeSchema,
  questionIds: z.array(z.string()),
  score: z.number().min(0).max(100),
  weakTags: z.array(z.string()),
  reviewedAt: z.string(),
  nextReviewAt: z.string(),
});

export const sourceDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string(),
  extension: z.string(),
  category: z.string(),
  trackHint: trackSchema,
  importStatus: z.enum(["parsed", "manual-only", "skipped"]),
  charCount: z.number(),
  extractedPreview: z.string(),
  questionCount: z.number(),
  highlights: z.array(z.string()),
});

export const rawLibraryQuestionSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  prompt: z.string(),
  track: trackSchema,
  tags: z.array(z.string()),
});

export const generatedLibrarySchema = z.object({
  generatedAt: z.string(),
  sources: z.array(sourceDocumentSchema),
  rawQuestions: z.array(rawLibraryQuestionSchema),
  manualResumeSource: z.object({
    path: z.string(),
    note: z.string(),
  }),
});

export const resumePromptSchema = z.object({
  id: z.string(),
  title: z.string(),
  question: z.string(),
  whyItMatters: z.string(),
  answerFrame: z.array(z.string()),
});

export const mockInterviewTranscriptTurnSchema = z.object({
  questionId: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const mockInterviewQuestionCardSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  answerHint: z.string(),
  roundType: roundTypeSchema,
  tags: z.array(z.string()),
  topicSlug: z.string(),
  topicTitle: z.string(),
});

export const mockInterviewCoachFeedbackSchema = z.object({
  score: z.number().min(0).max(100),
  verdict: z.string(),
  whatWentWell: z.array(z.string()).min(1),
  missingPoints: z.array(z.string()).min(1),
  beginnerRewrite: z.string(),
  interviewRewrite: z.string(),
  nextFocus: z.array(z.string()).min(1),
});

export const mockInterviewRecommendationSchema = z.object({
  slug: z.string(),
  title: z.string(),
});

export const mockInterviewRequestSchema = z.object({
  focusTrack: mockInterviewFocusSchema.default("react"),
  totalTurns: z.number().int().min(2).max(6).default(5),
  transcript: z.array(mockInterviewTranscriptTurnSchema).max(12).default([]),
  profile: userProfileSchema.optional(),
});

export const mockInterviewCoachOutputSchema = z.object({
  interviewerMessage: z.string(),
  feedback: mockInterviewCoachFeedbackSchema,
  weakTags: z.array(z.string()),
  recommendedTopics: z.array(mockInterviewRecommendationSchema).max(3),
});

export const mockInterviewResponseSchema = z.object({
  status: z.enum(["ready", "needs-api-key"]),
  focusTrack: mockInterviewFocusSchema,
  totalTurns: z.number().int().min(2).max(6),
  answeredCount: z.number().int().min(0),
  interviewerMessage: z.string(),
  feedback: mockInterviewCoachFeedbackSchema.nullable(),
  nextQuestion: mockInterviewQuestionCardSchema.nullable(),
  done: z.boolean(),
  weakTags: z.array(z.string()),
  recommendedTopics: z.array(mockInterviewRecommendationSchema),
});
