"use client";

import { useState } from "react";

import { saveSessionResult } from "@/lib/storage/session-store";
import type { Question } from "@/lib/types";
import { clampScore, plusDays } from "@/lib/utils";

type MockSimulatorProps = {
  questions: Question[];
};

export function MockSimulator({ questions }: MockSimulatorProps) {
  const [index, setIndex] = useState(0);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const activeQuestions = questions.slice(0, 6);
  const current = activeQuestions[index];

  async function finishSession(nextScores: Record<string, number>) {
    const scoreList = Object.values(nextScores);
    const average = scoreList.length
      ? scoreList.reduce((sum, value) => sum + value, 0) / scoreList.length
      : 0;

    await saveSessionResult({
      id: crypto.randomUUID(),
      mode: "mock",
      questionIds: activeQuestions.map((question) => question.id),
      score: clampScore(average),
      weakTags: activeQuestions.filter((question) => (nextScores[question.id] ?? 0) < 70).flatMap((question) => question.tags),
      reviewedAt: new Date().toISOString(),
      nextReviewAt: plusDays(2),
    });
  }

  async function saveAndContinue(score: number) {
    if (!current) return;
    const nextScores = { ...scores, [current.id]: score };
    setScores(nextScores);

    if (index >= activeQuestions.length - 1) {
      await finishSession(nextScores);
      setIndex(activeQuestions.length);
      return;
    }

    setIndex((value) => value + 1);
  }

  if (!current && index >= activeQuestions.length) {
    return (
      <section className="panel stack-md">
        <span className="eyebrow">Mock saved</span>
        <h2>Mixed round complete</h2>
        <p>Your self-scored mock has been stored locally. Use the revision page to turn the weaker tags into a focused review list.</p>
      </section>
    );
  }

  return (
    <section className="stack-lg">
      <div className="panel split">
        <div>
          <span className="eyebrow">Full mixed round</span>
          <h2>Simulate a real interviewer flow</h2>
        </div>
        <span className="pill">
          {index + 1} / {activeQuestions.length}
        </span>
      </div>

      <div className="panel stack-md">
        <h3>{current.prompt}</h3>
        <p className="subtle">{current.answerShort}</p>
        <textarea
          className="textarea"
          rows={7}
          value={notes[current.id] ?? ""}
          onChange={(event) => setNotes((value) => ({ ...value, [current.id]: event.target.value }))}
          placeholder="Speak your answer aloud, then type quick notes about what you missed."
        />
        <div className="split">
          <button type="button" className="button-danger" onClick={() => saveAndContinue(45)}>
            Weak answer
          </button>
          <button type="button" className="button-secondary" onClick={() => saveAndContinue(70)}>
            Decent answer
          </button>
          <button type="button" className="button-primary" onClick={() => saveAndContinue(90)}>
            Strong answer
          </button>
        </div>
      </div>
    </section>
  );
}
