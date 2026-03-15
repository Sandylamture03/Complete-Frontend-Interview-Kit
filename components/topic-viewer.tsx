"use client";

import { useState } from "react";

import type { Question, Topic } from "@/lib/types";

type TopicViewerProps = {
  topic: Topic;
  questions: Question[];
};

const MODES = [
  { id: "simple", label: "Explain Like 5th Standard" },
  { id: "interview", label: "Interview Mode" },
  { id: "code", label: "Code / Real Example" },
] as const;

export function TopicViewer({ topic, questions }: TopicViewerProps) {
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("simple");

  return (
    <section className="stack-lg">
      <div className="panel stack-md">
        <div className="split">
          <div>
            <span className="eyebrow">{topic.difficulty}</span>
            <h1>{topic.title}</h1>
          </div>
          <div className="pill-row">
            {MODES.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`toggle-pill ${mode === option.id ? "active" : ""}`}
                onClick={() => setMode(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {mode === "simple" ? (
          <div className="stack-sm">
            <p className="lede">{topic.simpleExplanation}</p>
            <div className="callout">
              <strong>Analogy</strong>
              <p>{topic.analogy}</p>
            </div>
          </div>
        ) : null}

        {mode === "interview" ? (
          <div className="stack-sm">
            <p className="lede">{topic.interviewAnswer}</p>
            <div className="callout">
              <strong>One minute answer</strong>
              <ul className="plain-list">
                {topic.oneMinuteAnswer.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {mode === "code" ? (
          <div className="stack-sm">
            <pre className="code-block">
              <code>{topic.codeSnippet}</code>
            </pre>
            <div className="callout">
              <strong>Pitfalls</strong>
              <ul className="plain-list">
                {topic.pitfalls.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid-2">
        <section className="panel stack-md">
          <div>
            <span className="eyebrow">Follow-up questions</span>
            <h2>Topic practice prompts</h2>
          </div>
          <div className="stack-sm">
            {questions.map((question) => (
              <article key={question.id} className="question-card">
                <strong>{question.prompt}</strong>
                <p>{question.answerShort}</p>
                <ul className="plain-list subtle">
                  {question.followUps.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="panel stack-md">
          <div>
            <span className="eyebrow">Cheat sheet</span>
            <h2>Last-day revision lines</h2>
          </div>
          <ul className="plain-list">
            {topic.cheatSheet.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div>
            <span className="eyebrow">Source references</span>
            <ul className="plain-list subtle">
              {topic.sourceRefs.map((source) => (
                <li key={`${source.sourceId}-${source.path}`}>
                  {source.label}: {source.path}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </section>
  );
}
