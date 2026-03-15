import type { OfflineResourcePack } from "@/lib/types";

import { TRACK_LABELS } from "@/lib/utils";

type OfflineResourcePackViewProps = {
  pack: OfflineResourcePack;
};

export function OfflineResourcePackView({ pack }: OfflineResourcePackViewProps) {
  return (
    <section className="stack-lg">
      <div className="panel stack-md">
        <div className="pill-row">
          <span className="pill">{pack.group}</span>
          <span className="pill muted">{pack.category}</span>
        </div>
        <h1>{pack.title}</h1>
        <p className="lede">{pack.summary}</p>
        <div className="tag-row">
          {pack.mappedTracks.map((track) => (
            <span key={track} className="tag">
              {TRACK_LABELS[track]}
            </span>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <section className="panel stack-md">
          <div>
            <span className="eyebrow">Easy start</span>
            <h2>Learn it in plain school-level language first</h2>
          </div>
          <ul className="plain-list">
            {pack.simpleStart.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="panel stack-md">
          <div>
            <span className="eyebrow">Best for</span>
            <h2>What this local pack helps you answer</h2>
          </div>
          <p>{pack.bestFor}</p>
          <div className="callout">
            <strong>Why this matters for your profile</strong>
            <p>{pack.whyThisMattersForYou}</p>
          </div>
        </section>

      </div>

      <div className="grid-2">
        <section className="panel stack-md">
          <div>
            <span className="eyebrow">Quick revision</span>
            <h2>Fast last-day recap</h2>
          </div>
          <ul className="plain-list">
            {pack.quickRevision.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="panel stack-md">
          <div>
            <span className="eyebrow">Key takeaways</span>
            <h2>Local study notes</h2>
          </div>
          <ul className="plain-list">
            {pack.keyTakeaways.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="panel stack-md">
          <div>
            <span className="eyebrow">Interview angles</span>
            <h2>How to use it in answers</h2>
          </div>
          <ul className="plain-list">
            {pack.interviewAngles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="panel stack-md">
        <div>
          <span className="eyebrow">Source attribution</span>
          <h2>Derived from official material</h2>
        </div>
        <p className="subtle">
          This pack is stored locally in the app as interview-focused notes. The source references are kept for attribution,
          but you do not need to leave the application to study this material.
        </p>
        <ul className="plain-list subtle">
          {pack.sourceRefs.map((source) => (
            <li key={source.url}>
              {source.title} ({source.type}) - {source.url}
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
