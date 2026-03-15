import Link from "next/link";

import type { InterviewBankTrackSection } from "@/lib/types";

type InterviewBankTrackCardProps = {
  section: InterviewBankTrackSection;
};

export function InterviewBankTrackCard({ section }: InterviewBankTrackCardProps) {
  return (
    <article className="panel track-card">
      <div className="stack-sm">
        <span className="pill">{section.label}</span>
        <h3>{section.label}</h3>
        <p>{section.description}</p>
      </div>
      <div className="split stat-row">
        <span>{section.topicCount} topics</span>
        <span>{section.totalQuestions} interview Q&A</span>
      </div>
      <div className="split stat-row">
        <span>Beginner to expert</span>
        <Link href={`/interview-bank/${section.track}`} className="text-link">
          Open interview bank
        </Link>
      </div>
    </article>
  );
}
