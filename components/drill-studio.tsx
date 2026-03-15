"use client";

import { useEffect, useMemo, useState } from "react";

import { saveSessionResult } from "@/lib/storage/session-store";
import type { Question, SessionMode } from "@/lib/types";
import { clampScore, plusDays } from "@/lib/utils";

type DrillStudioProps = {
  questions: Question[];
};

type DrillMode = SessionMode | "all";

export function DrillStudio({ questions }: DrillStudioProps) {
  const [mode, setMode] = useState<DrillMode>("flashcards");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [countdown, setCountdown] = useState(90);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const filtered = useMemo(() => {
    if (mode === "mcq") return questions.filter((question) => question.mcq).slice(0, 8);
    if (mode === "timed-verbal") return questions.filter((question) => question.timerSeconds).slice(0, 8);
    if (mode === "mock") return questions.slice(0, 8);
    return questions.slice(0, 8);
  }, [mode, questions]);

  const current = filtered[index];

  useEffect(() => {
    if (mode !== "timed-verbal" || !current || countdown <= 0) return;

    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, current, mode]);

  function resetForQuestion(nextIndex: number, nextMode: DrillMode = mode) {
    const nextQuestions =
      nextMode === "mcq"
        ? questions.filter((question) => question.mcq).slice(0, 8)
        : nextMode === "timed-verbal"
          ? questions.filter((question) => question.timerSeconds).slice(0, 8)
          : questions.slice(0, 8);
    const nextQuestion = nextQuestions[nextIndex];

    setIndex(nextIndex);
    setRevealed(false);
    setCountdown(nextQuestion?.timerSeconds ?? 90);
  }

  async function finishSession(nextAnswers: Record<string, number>) {
    const values = Object.values(nextAnswers);
    const average = values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    const weakTags = filtered
      .filter((question) => (nextAnswers[question.id] ?? 0) < 70)
      .flatMap((question) => question.tags);

    await saveSessionResult({
      id: crypto.randomUUID(),
      mode: mode === "all" ? "flashcards" : (mode as SessionMode),
      questionIds: filtered.map((question) => question.id),
      score: clampScore(average),
      weakTags,
      reviewedAt: new Date().toISOString(),
      nextReviewAt: plusDays(3),
    });
  }

  async function recordScore(score: number) {
    if (!current) return;

    const nextAnswers = { ...answers, [current.id]: score };
    setAnswers(nextAnswers);

    if (index >= filtered.length - 1) {
      await finishSession(nextAnswers);
      setIndex(filtered.length);
      return;
    }

    resetForQuestion(index + 1);
  }

  if (!current && index >= filtered.length) {
    const values = Object.values(answers);
    const average = values.length > 0 ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;

    return (
      <section className="panel stack-md">
        <span className="eyebrow">Session saved</span>
        <h2>Drill complete</h2>
        <p>Your average confidence score for this session is {average}. Open the revision tab to see weak-tag suggestions.</p>
        <button type="button" className="button-secondary" onClick={() => {
          resetForQuestion(0, "flashcards");
          setAnswers({});
          setMode("flashcards");
        }}>
          Start another drill
        </button>
      </section>
    );
  }

  return (
    <section className="stack-lg">
      <div className="panel split">
        <div>
          <span className="eyebrow">Drill mode</span>
          <h2>Guided question practice</h2>
        </div>
        <select value={mode} onChange={(event) => {
          const nextMode = event.target.value as DrillMode;
          setMode(nextMode);
          resetForQuestion(0, nextMode);
          setAnswers({});
        }} className="select">
          <option value="flashcards">Flashcards</option>
          <option value="mcq">MCQ</option>
          <option value="timed-verbal">Timed verbal</option>
        </select>
      </div>

      <div className="panel stack-md">
        <div className="split">
          <span className="pill">Question {index + 1} of {filtered.length}</span>
          {mode === "timed-verbal" ? <span className="pill warn">{countdown}s</span> : null}
        </div>
        <h3>{current.prompt}</h3>
        <p className="subtle">{current.answerShort}</p>

        {mode === "mcq" && current.mcq ? (
          <div className="stack-sm">
            {current.mcq.options.map((option) => (
              <button
                key={option}
                type="button"
                className="button-secondary button-block"
                onClick={() => recordScore(option === current.mcq?.correctAnswer ? 100 : 40)}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <>
            <button type="button" className="button-secondary" onClick={() => setRevealed((value) => !value)}>
              {revealed ? "Hide detailed answer" : "Reveal detailed answer"}
            </button>
            {revealed ? (
              <div className="callout">
                <p>{current.answerDeep}</p>
                <ul className="plain-list subtle">
                  {current.followUps.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="split">
              <button type="button" className="button-danger" onClick={() => recordScore(45)}>
                Need revision
              </button>
              <button type="button" className="button-primary" onClick={() => recordScore(90)}>
                Confident
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
