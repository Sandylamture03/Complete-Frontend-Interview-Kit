import Link from "next/link";

import type { TrackSummary } from "@/lib/types";

type TrackCardProps = {
  summary: TrackSummary;
};

export function TrackCard({ summary }: TrackCardProps) {
  return (
    <article className="panel track-card">
      <div className="stack-sm">
        <span className="pill">{summary.label}</span>
        <h3>{summary.label}</h3>
        <p>{summary.description}</p>
      </div>
      <div className="split stat-row">
        <span>{summary.topicCount} curated topics</span>
        <span>{summary.questionCount} guided questions</span>
      </div>
      <div className="split stat-row">
        <span>{summary.resourceCount} imported sources</span>
        <Link href={`/tracks/${summary.track}`} className="text-link">
          Open track
        </Link>
      </div>
    </article>
  );
}
