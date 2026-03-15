"use client";

import { useEffect, useMemo, useState } from "react";

import { loadSessionResults } from "@/lib/storage/session-store";
import type { SessionResult, Topic } from "@/lib/types";

type RevisionBoardProps = {
  topics: Topic[];
};

export function RevisionBoard({ topics }: RevisionBoardProps) {
  const [sessions, setSessions] = useState<SessionResult[]>([]);

  useEffect(() => {
    loadSessionResults().then(setSessions).catch(() => setSessions([]));
  }, []);

  const weakTagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    sessions.forEach((session) => {
      session.weakTags.forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [sessions]);

  const recommendedTopics = useMemo(() => {
    const weakTags = new Set(weakTagCounts.slice(0, 6).map(([tag]) => tag));
    return topics.filter((topic) => topic.tags.some((tag) => weakTags.has(tag))).slice(0, 6);
  }, [topics, weakTagCounts]);

  return (
    <section className="stack-lg">
      <div className="panel stack-md">
        <div className="split">
          <div>
            <span className="eyebrow">Revision queue</span>
            <h2>What to revise next</h2>
          </div>
          <span className="pill">{sessions.length} saved sessions</span>
        </div>
        {weakTagCounts.length === 0 ? (
          <p>No saved drill or mock sessions yet. Finish one drill and this page will turn into a revision planner.</p>
        ) : (
          <div className="tag-row">
            {weakTagCounts.slice(0, 8).map(([tag, count]) => (
              <span key={tag} className="tag">
                {tag} x{count}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid-2">
        {recommendedTopics.map((topic) => (
          <article key={topic.id} className="panel stack-sm">
            <span className="eyebrow">{topic.title}</span>
            <p>{topic.summary}</p>
            <ul className="plain-list subtle">
              {topic.oneMinuteAnswer.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
