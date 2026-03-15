import { buildMockQuestionPool } from "@/lib/ai/mock-interview";

describe("AI mock interview pool", () => {
  it("builds a focused frontend round without duplicates", () => {
    const pool = buildMockQuestionPool("frontend", 5);

    expect(pool).toHaveLength(5);
    expect(new Set(pool.map((question) => question.id)).size).toBe(5);
  });

  it("keeps mixed rounds broad across tracks", () => {
    const pool = buildMockQuestionPool("mixed", 5);
    const trackCount = new Set(pool.map((question) => question.track)).size;

    expect(trackCount).toBeGreaterThanOrEqual(4);
  });
});
