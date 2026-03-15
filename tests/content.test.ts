import {
  getAllQuestions,
  getAllTopics,
  getCodingPrompts,
  getInterviewBankByTrack,
  getOfflineResourcePacks,
  getTopicsByTrack,
  loadGeneratedLibrary,
} from "@/lib/content";
import { topicSchema } from "@/lib/schema";

describe("content layer", () => {
  it("loads the generated resource library", () => {
    const library = loadGeneratedLibrary();

    expect(library.sources.length).toBeGreaterThan(0);
    expect(library.rawQuestions.length).toBeGreaterThan(100);
  });

  it("keeps React-only topics inside the React track", () => {
    const topics = getTopicsByTrack("react");
    expect(topics.length).toBeGreaterThan(0);
    expect(topics.every((topic) => topic.track === "react")).toBe(true);
  });

  it("ensures every curated topic has all four learning layers", () => {
    const topics = getAllTopics();

    topics.forEach((topic) => {
      expect(topicSchema.safeParse(topic).success).toBe(true);
      expect(topic.simpleExplanation.length).toBeGreaterThan(20);
      expect(topic.interviewAnswer.length).toBeGreaterThan(20);
      expect(topic.codeSnippet.length).toBeGreaterThan(10);
      expect(topic.oneMinuteAnswer.length).toBeGreaterThan(0);
    });
  });

  it("ships coding prompts across multiple round types", () => {
    const prompts = getCodingPrompts();
    expect(prompts.length).toBeGreaterThanOrEqual(5);
  });

  it("stores offline resource packs mapped to tracks", () => {
    const packs = getOfflineResourcePacks();
    expect(packs.length).toBeGreaterThanOrEqual(6);
    expect(packs.every((pack) => pack.mappedTracks.length > 0)).toBe(true);
    expect(packs.every((pack) => pack.simpleStart.length > 0)).toBe(true);
    expect(packs.some((pack) => pack.group === "react")).toBe(true);
    expect(packs.some((pack) => pack.group === "testing")).toBe(true);
  });

  it("builds interview banks with topic coverage across experience levels", () => {
    const bank = getInterviewBankByTrack("react");
    expect(bank.topicCount).toBeGreaterThan(0);
    expect(bank.totalQuestions).toBeGreaterThan(100);
    expect(bank.topics.every((topic) => topic.experienceSections.length === 4)).toBe(true);
    expect(bank.topics.every((topic) => topic.experienceSections.every((section) => section.questions.length > 0))).toBe(true);
    expect(
      bank.topics.some((topic) =>
        topic.experienceSections.some((section) => section.questions.some((question) => question.sourceKind === "imported")),
      ),
    ).toBe(true);
  });

  it("ships a question bank with follow-ups", () => {
    const questions = getAllQuestions();
    expect(questions.length).toBeGreaterThan(10);
    expect(questions.every((question) => question.followUps.length > 0)).toBe(true);
  });
});
