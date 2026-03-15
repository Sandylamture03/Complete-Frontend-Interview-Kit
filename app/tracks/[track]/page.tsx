import { notFound } from "next/navigation";

import { OfflineResourceList } from "@/components/offline-resource-list";
import { SourceLibraryPanel } from "@/components/source-library-panel";
import { TopicCard } from "@/components/topic-card";
import {
  getDashboardSnapshot,
  getOfflineResourcePacksByTrack,
  getRawResourceHighlights,
  getTopicsByTrack,
} from "@/lib/content";
import { TRACKS, type Track } from "@/lib/types";
import { TRACK_LABELS } from "@/lib/utils";

type TrackPageProps = {
  params: Promise<{
    track: string;
  }>;
};

export default async function TrackPage({ params }: TrackPageProps) {
  const resolved = await params;
  const track = TRACKS.find((item) => item === resolved.track) as Track | undefined;

  if (!track) {
    notFound();
  }

  const snapshot = getDashboardSnapshot();
  const topics = getTopicsByTrack(track);
  const resources = getOfflineResourcePacksByTrack(track);

  return (
    <section className="stack-lg">
      <div className="panel stack-md">
        <span className="eyebrow">Track view</span>
        <h1>{TRACK_LABELS[track]}</h1>
        <p>{snapshot.trackSummaries.find((summary) => summary.track === track)?.description}</p>
      </div>

      <div className="grid-topics">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>

      {resources.length > 0 ? (
        <OfflineResourceList
          resources={resources}
          eyebrow="Offline track resources"
          title={`Local ${TRACK_LABELS[track]} resource packs`}
          description="These local packs are mapped to this track so you can study official-source ideas without leaving the application."
        />
      ) : null}

      <SourceLibraryPanel library={snapshot.generatedLibrary} sources={getRawResourceHighlights(track)} />
    </section>
  );
}
