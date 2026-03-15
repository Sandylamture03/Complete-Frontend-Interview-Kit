import { SourceLibraryPanel } from "@/components/source-library-panel";
import { TopicCard } from "@/components/topic-card";
import { TrackCard } from "@/components/track-card";
import {
  getAllTopics,
  getDashboardSnapshot,
  getRawResourceHighlights,
  getTrackFromSearchParams,
  searchTopics,
} from "@/lib/content";

type TracksPageProps = {
  searchParams?: Promise<{
    q?: string;
    track?: string;
    difficulty?: string;
  }>;
};

export default async function TracksPage({ searchParams }: TracksPageProps) {
  const resolved = (await searchParams) ?? {};
  const selectedTrack = getTrackFromSearchParams(resolved.track);
  const baseTopics = selectedTrack ? getAllTopics().filter((topic) => topic.track === selectedTrack) : getAllTopics();
  const searchedTopics = resolved.q ? searchTopics(resolved.q, baseTopics) : baseTopics;
  const topics = resolved.difficulty
    ? searchedTopics.filter((topic) => topic.difficulty === resolved.difficulty)
    : searchedTopics;
  const snapshot = getDashboardSnapshot();

  return (
    <section className="stack-lg">
      <div className="panel stack-md">
        <span className="eyebrow">Track browser</span>
        <h1>Separate React prep from broad frontend prep, then filter by difficulty.</h1>
        <form className="grid-3" action="/tracks">
          <label className="field">
            <span>Search topic</span>
            <input className="input" type="search" name="q" defaultValue={resolved.q} placeholder="useEffect, system design, event loop..." />
          </label>
          <label className="field">
            <span>Track</span>
            <select className="select" name="track" defaultValue={resolved.track ?? ""}>
              <option value="">All tracks</option>
              {snapshot.trackSummaries.map((summary) => (
                <option key={summary.track} value={summary.track}>
                  {summary.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Difficulty</span>
            <select className="select" name="difficulty" defaultValue={resolved.difficulty ?? ""}>
              <option value="">All difficulty levels</option>
              <option value="foundation">foundation</option>
              <option value="1-3y">1-3y</option>
              <option value="3-6y">3-6y</option>
              <option value="senior">senior</option>
            </select>
          </label>
          <button className="button-primary" type="submit">
            Apply filters
          </button>
        </form>
      </div>

      <div className="grid-topics">
        {snapshot.trackSummaries.map((summary) => (
          <TrackCard key={summary.track} summary={summary} />
        ))}
      </div>

      <section className="stack-md">
        <div className="split">
          <div>
            <span className="eyebrow">Curated study topics</span>
            <h2>{topics.length} topic cards ready to study</h2>
          </div>
        </div>
        <div className="grid-topics">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      <SourceLibraryPanel library={snapshot.generatedLibrary} sources={getRawResourceHighlights(selectedTrack)} />
    </section>
  );
}
