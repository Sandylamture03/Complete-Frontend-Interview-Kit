export const TRACKS = [
  "react",
  "frontend",
  "javascript",
  "browser",
  "html-css",
  "accessibility",
  "performance-security",
  "dsa",
  "machine-coding",
  "system-design",
  "resume-behavioral",
] as const;

export const DIFFICULTIES = [
  "foundation",
  "1-3y",
  "3-6y",
  "senior",
] as const;

export const ROUND_TYPES = [
  "screening",
  "theory",
  "coding",
  "machine-coding",
  "design",
  "behavioral",
] as const;

export const SESSION_MODES = [
  "flashcards",
  "self-rating",
  "mcq",
  "timed-verbal",
  "mock",
] as const;

export const AI_ACTIONS = [
  "evaluate-answer",
  "run-mock-interview",
  "generate-followups",
  "build-study-plan",
] as const;

export const MOCK_INTERVIEW_FOCUSES = [
  "mixed",
  "react",
  "frontend",
  "javascript",
  "machine-coding",
  "system-design",
  "resume-behavioral",
] as const;

export const INTERVIEW_EXPERIENCE_LEVELS = [
  "beginner",
  "1-3y",
  "3-6y",
  "expert",
] as const;

export type Track = (typeof TRACKS)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export type RoundType = (typeof ROUND_TYPES)[number];
export type SessionMode = (typeof SESSION_MODES)[number];
export type AiAction = (typeof AI_ACTIONS)[number];
export type MockInterviewFocus = (typeof MOCK_INTERVIEW_FOCUSES)[number];
export type InterviewExperienceLevel = (typeof INTERVIEW_EXPERIENCE_LEVELS)[number];

export type SourceRef = {
  sourceId: string;
  label: string;
  path: string;
  notes?: string;
  kind: "curated" | "imported" | "manual";
};

export type Topic = {
  id: string;
  slug: string;
  track: Track;
  difficulty: Difficulty;
  title: string;
  summary: string;
  simpleExplanation: string;
  analogy: string;
  interviewAnswer: string;
  codeSnippet: string;
  pitfalls: string[];
  tags: string[];
  oneMinuteAnswer: string[];
  cheatSheet: string[];
  sourceRefs: SourceRef[];
  relatedTopicIds: string[];
};

export type Question = {
  id: string;
  topicId: string;
  track: Track;
  prompt: string;
  answerShort: string;
  answerDeep: string;
  followUps: string[];
  roundType: RoundType;
  tags: string[];
  timerSeconds?: number;
  mcq?: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
};

export type CodingPrompt = {
  id: string;
  track: Track;
  difficulty: Difficulty;
  title: string;
  scenario: string;
  requirements: string[];
  hints: string[];
  solutionOutline: string[];
  evaluationChecklist: string[];
  starterCode?: string;
  sourceRefs: SourceRef[];
};

export type UserProfile = {
  name: string;
  title: string;
  yearsExperience: string;
  targetBand: string;
  coreStack: string[];
  projectHighlights: string[];
  weakAreas: string[];
  targetCompanies: string[];
  elevatorPitch: string;
  resumeNotes: string[];
};

export type SessionResult = {
  id: string;
  mode: SessionMode;
  questionIds: string[];
  score: number;
  weakTags: string[];
  reviewedAt: string;
  nextReviewAt: string;
};

export type SourceDocument = {
  id: string;
  name: string;
  path: string;
  extension: string;
  category: string;
  trackHint: Track;
  importStatus: "parsed" | "manual-only" | "skipped";
  charCount: number;
  extractedPreview: string;
  questionCount: number;
  highlights: string[];
};

export type RawLibraryQuestion = {
  id: string;
  sourceId: string;
  prompt: string;
  track: Track;
  tags: string[];
};

export type GeneratedLibrary = {
  generatedAt: string;
  sources: SourceDocument[];
  rawQuestions: RawLibraryQuestion[];
  manualResumeSource: {
    path: string;
    note: string;
  };
};

export type TrackSummary = {
  track: Track;
  label: string;
  description: string;
  topicCount: number;
  questionCount: number;
  resourceCount: number;
  priorityTopics: string[];
};

export type DashboardSnapshot = {
  topics: Topic[];
  questions: Question[];
  codingPrompts: CodingPrompt[];
  generatedLibrary: GeneratedLibrary;
  trackSummaries: TrackSummary[];
};

export type ResumePrompt = {
  id: string;
  title: string;
  question: string;
  whyItMatters: string;
  answerFrame: string[];
};

export type MockInterviewTranscriptTurn = {
  questionId: string;
  question: string;
  answer: string;
};

export type MockInterviewQuestionCard = {
  id: string;
  prompt: string;
  answerHint: string;
  roundType: RoundType;
  tags: string[];
  topicSlug: string;
  topicTitle: string;
};

export type MockInterviewCoachFeedback = {
  score: number;
  verdict: string;
  whatWentWell: string[];
  missingPoints: string[];
  beginnerRewrite: string;
  interviewRewrite: string;
  nextFocus: string[];
};

export type MockInterviewRecommendation = {
  slug: string;
  title: string;
};

export type MockInterviewRequest = {
  focusTrack: MockInterviewFocus;
  totalTurns: number;
  transcript: MockInterviewTranscriptTurn[];
  profile?: UserProfile;
};

export type MockInterviewResponse = {
  status: "ready" | "needs-api-key";
  focusTrack: MockInterviewFocus;
  totalTurns: number;
  answeredCount: number;
  interviewerMessage: string;
  feedback: MockInterviewCoachFeedback | null;
  nextQuestion: MockInterviewQuestionCard | null;
  done: boolean;
  weakTags: string[];
  recommendedTopics: MockInterviewRecommendation[];
};

export type ResourceGroup =
  | "react"
  | "javascript"
  | "frontend"
  | "testing"
  | "performance"
  | "accessibility"
  | "system-design";

export type OfflineResourceSource = {
  title: string;
  url: string;
  type: "official-docs" | "official-guide";
};

export type OfflineResourcePack = {
  id: string;
  title: string;
  slug: string;
  group: ResourceGroup;
  mappedTracks: Track[];
  category: string;
  summary: string;
  simpleStart: string[];
  bestFor: string;
  whyThisMattersForYou: string;
  keyTakeaways: string[];
  interviewAngles: string[];
  quickRevision: string[];
  sourceRefs: OfflineResourceSource[];
};

export type InterviewBankQuestion = {
  id: string;
  level: InterviewExperienceLevel;
  prompt: string;
  simpleAnswer: string;
  answer: string;
  example: string;
  whyAsked: string;
  roundType: RoundType;
  followUps: string[];
  tags: string[];
  sourceLabel?: string;
  sourceKind?: "curated" | "imported";
};

export type InterviewBankExperienceSection = {
  level: InterviewExperienceLevel;
  label: string;
  description: string;
  questions: InterviewBankQuestion[];
};

export type InterviewBankTopicSection = {
  topicId: string;
  topicSlug: string;
  topicTitle: string;
  track: Track;
  summary: string;
  difficulty: Difficulty;
  tags: string[];
  experienceSections: InterviewBankExperienceSection[];
};

export type InterviewBankTrackSection = {
  track: Track;
  label: string;
  description: string;
  totalQuestions: number;
  topicCount: number;
  topics: InterviewBankTopicSection[];
};
