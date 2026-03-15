import Link from "next/link";

import type { Topic } from "@/lib/types";
import { TRACK_LABELS } from "@/lib/utils";

type TopicCardProps = {
  topic: Topic;
};

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <article className="panel topic-card">
      <div className="stack-sm">
        <div className="pill-row">
          <span className="pill">{TRACK_LABELS[topic.track]}</span>
          <span className="pill muted">{topic.difficulty}</span>
        </div>
        <h3>{topic.title}</h3>
        <p>{topic.summary}</p>
      </div>
      <p className="subtle card-support">Simple mode, interview mode, example, pitfalls, and follow-ups are all inside this topic.</p>
      <div className="tag-row">
        {topic.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <Link href={`/topics/${topic.slug}`} className="primary-link">
        Study topic
      </Link>
    </article>
  );
}
