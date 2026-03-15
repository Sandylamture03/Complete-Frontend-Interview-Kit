import Link from "next/link";

import type { OfflineResourcePack } from "@/lib/types";
import { TRACK_LABELS } from "@/lib/utils";

type OfflineResourceCardProps = {
  pack: OfflineResourcePack;
};

export function OfflineResourceCard({ pack }: OfflineResourceCardProps) {
  return (
    <article className="panel stack-sm">
      <div className="pill-row">
        <span className="pill">{pack.group}</span>
        <span className="pill muted">{pack.category}</span>
      </div>
      <h3>{pack.title}</h3>
      <p>{pack.summary}</p>
      <div className="tag-row">
        {pack.mappedTracks.map((track) => (
          <span key={track} className="tag">
            {TRACK_LABELS[track]}
          </span>
        ))}
      </div>
      <p className="subtle">{pack.bestFor}</p>
      <Link href={`/resources/${pack.slug}`} className="primary-link">
        Open local study pack
      </Link>
    </article>
  );
}
