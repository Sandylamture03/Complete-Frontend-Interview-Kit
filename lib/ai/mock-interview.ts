import {
  getAllQuestions,
  getAllTopics,
  getOfflineResourcePacksByTrack,
} from "@/lib/content";
import {
  MOCK_INTERVIEW_FOCUS_LABELS,
  MOCK_INTERVIEW_TRACK_PRIORITY,
} from "@/lib/mock-config";
import type {
  MockInterviewFocus,
  MockInterviewQuestionCard,
  MockInterviewRecommendation,
  MockInterviewTranscriptTurn,
  Question,
  Topic,
  UserProfile,
} from "@/lib/types";

const allQuestions = getAllQuestions();
const topicById = new Map(getAllTopics().map((topic) => [topic.id, topic]));

function getTopicForQuestion(question: Question): Topic | undefined {
  return topicById.get(question.topicId);
}

export function buildMockQuestionPool(focusTrack: MockInterviewFocus, totalTurns: number) {
  const trackOrder = MOCK_INTERVIEW_TRACK_PRIORITY[focusTrack];
  const buckets = trackOrder.map((track) => allQuestions.filter((question) => question.track === track));
  const selected: Question[] = [];
  const usedIds = new Set<string>();

  while (selected.length < totalTurns && buckets.some((bucket) => bucket.length > 0)) {
    buckets.forEach((bucket) => {
      const nextQuestion = bucket.shift();
      if (!nextQuestion || usedIds.has(nextQuestion.id) || selected.length >= totalTurns) {
        return;
      }

      selected.push(nextQuestion);
      usedIds.add(nextQuestion.id);
    });
  }

  if (selected.length < totalTurns) {
    allQuestions.forEach((question) => {
      if (usedIds.has(question.id) || selected.length >= totalTurns) {
        return;
      }

      selected.push(question);
      usedIds.add(question.id);
    });
  }

  return selected.slice(0, totalTurns);
}

export function toMockQuestionCard(question: Question): MockInterviewQuestionCard {
  const topic = getTopicForQuestion(question);

  return {
    id: question.id,
    prompt: question.prompt,
    answerHint: question.answerShort,
    roundType: question.roundType,
    tags: question.tags,
    topicSlug: topic?.slug ?? "tracks",
    topicTitle: topic?.title ?? "Interview prep topic",
  };
}

function serializeTopic(topic?: Topic) {
  if (!topic) return null;

  return {
    title: topic.title,
    slug: topic.slug,
    simpleExplanation: topic.simpleExplanation,
    analogy: topic.analogy,
    interviewAnswer: topic.interviewAnswer,
    pitfalls: topic.pitfalls,
    cheatSheet: topic.cheatSheet,
  };
}

function serializeLocalPacks(question: Question) {
  return getOfflineResourcePacksByTrack(question.track)
    .slice(0, 2)
    .map((pack) => ({
      title: pack.title,
      summary: pack.summary,
      simpleStart: pack.simpleStart,
      keyTakeaways: pack.keyTakeaways,
      interviewAngles: pack.interviewAngles,
      quickRevision: pack.quickRevision,
    }));
}

export function buildRecommendedTopics(question: Question, nextQuestion?: Question | null): MockInterviewRecommendation[] {
  const currentTopic = getTopicForQuestion(question);
  const relatedTopics = currentTopic?.relatedTopicIds
    .map((id) => topicById.get(id))
    .filter(Boolean) as Topic[] | undefined;

  const picks = [
    currentTopic,
    ...(relatedTopics ?? []),
    nextQuestion ? getTopicForQuestion(nextQuestion) : undefined,
  ].filter(Boolean) as Topic[];

  const seen = new Set<string>();

  return picks
    .filter((topic) => {
      if (seen.has(topic.slug)) return false;
      seen.add(topic.slug);
      return true;
    })
    .slice(0, 3)
    .map((topic) => ({ slug: topic.slug, title: topic.title }));
}

export function buildCoachPromptInput({
  focusTrack,
  totalTurns,
  transcript,
  profile,
  answeredQuestion,
  nextQuestion,
}: {
  focusTrack: MockInterviewFocus;
  totalTurns: number;
  transcript: MockInterviewTranscriptTurn[];
  profile: UserProfile;
  answeredQuestion: Question;
  nextQuestion?: Question | null;
}) {
  const currentTopic = getTopicForQuestion(answeredQuestion);
  const nextTopic = nextQuestion ? getTopicForQuestion(nextQuestion) : undefined;
  const recommendations = buildRecommendedTopics(answeredQuestion, nextQuestion);

  return {
    interviewMode: MOCK_INTERVIEW_FOCUS_LABELS[focusTrack],
    totalTurns,
    candidateProfile: {
      name: profile.name,
      title: profile.title,
      yearsExperience: profile.yearsExperience,
      targetBand: profile.targetBand,
      coreStack: profile.coreStack,
      projectHighlights: profile.projectHighlights,
      weakAreas: profile.weakAreas,
      elevatorPitch: profile.elevatorPitch,
      resumeNotes: profile.resumeNotes,
    },
    completedTurns: transcript.map((turn) => ({
      question: turn.question,
      answer: turn.answer,
    })),
    answeredQuestion: {
      prompt: answeredQuestion.prompt,
      answerShort: answeredQuestion.answerShort,
      answerDeep: answeredQuestion.answerDeep,
      followUps: answeredQuestion.followUps,
      roundType: answeredQuestion.roundType,
      tags: answeredQuestion.tags,
      topic: serializeTopic(currentTopic),
      localResourcePacks: serializeLocalPacks(answeredQuestion),
    },
    nextQuestion: nextQuestion
      ? {
          prompt: nextQuestion.prompt,
          answerShort: nextQuestion.answerShort,
          roundType: nextQuestion.roundType,
          tags: nextQuestion.tags,
          topic: serializeTopic(nextTopic),
        }
      : null,
    allowedRecommendations: recommendations,
  };
}
