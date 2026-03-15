"use client";

import { useEffect, useState } from "react";

import { loadProfile } from "@/lib/storage/profile-store";
import { loadSessionResults } from "@/lib/storage/session-store";
import type { SessionResult, UserProfile } from "@/lib/types";

type DashboardStatsProps = {
  defaultProfile: UserProfile;
};

export function DashboardStats({ defaultProfile }: DashboardStatsProps) {
  const [profile] = useState(() => loadProfile(defaultProfile));
  const [sessions, setSessions] = useState<SessionResult[]>([]);

  useEffect(() => {
    loadSessionResults().then(setSessions).catch(() => setSessions([]));
  }, []);

  const averageScore =
    sessions.length > 0
      ? Math.round(sessions.reduce((sum, session) => sum + session.score, 0) / sessions.length)
      : 0;

  return (
    <section className="panel">
      <div className="split">
        <div>
          <span className="eyebrow">Your local profile</span>
          <h2>{profile.title}</h2>
        </div>
        <span className="pill">{profile.yearsExperience}</span>
      </div>
      <div className="grid-3">
        <div className="metric-card metric-accent">
          <span className="eyebrow">Saved sessions</span>
          <strong>{sessions.length}</strong>
          <p>Drills and mocks stored locally on this machine.</p>
        </div>
        <div className="metric-card metric-warm">
          <span className="eyebrow">Average score</span>
          <strong>{averageScore || "Start"}</strong>
          <p>{averageScore ? "Good signal for revision planning." : "Take one drill to start tracking progress."}</p>
        </div>
        <div className="metric-card">
          <span className="eyebrow">Weak areas</span>
          <strong>{profile.weakAreas.length}</strong>
          <p>{profile.weakAreas.join(", ")}</p>
        </div>
      </div>
    </section>
  );
}
