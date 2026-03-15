import Link from "next/link";

import { DashboardStats } from "@/components/dashboard-stats";
import { MetricCard } from "@/components/metric-card";
import { OfflineResourceList } from "@/components/offline-resource-list";
import { SourceLibraryPanel } from "@/components/source-library-panel";
import { TopicCard } from "@/components/topic-card";
import { TrackCard } from "@/components/track-card";
import {
  getDashboardSnapshot,
  getDefaultProfile,
  getFeaturedTopics,
  getOfflineResourcePacks,
  getRawResourceHighlights,
} from "@/lib/content";

export default function HomePage() {
  const snapshot = getDashboardSnapshot();
  const featuredTopics = getFeaturedTopics();
  const defaultProfile = getDefaultProfile();

  return (
    <>
      <section className="hero-panel stack-lg">
        <div className="hero-grid">
          <div className="stack-md">
            <span className="eyebrow">Local-first interview command center</span>
            <h1>React and frontend interview prep, turned into one structured system.</h1>
            <p className="lede">
              Learn with simple explanations, switch into interview-ready language, practice with drills and mock rounds,
              and keep your original resource library connected underneath the curated experience.
            </p>
            <div className="pill-row">
              <Link href="/tracks" className="primary-link">
                Start with tracks
              </Link>
              <Link href="/interview-bank" className="text-link">
                Open interview bank
              </Link>
              <Link href="/drills" className="text-link">
                Take a drill
              </Link>
              <Link href="/resume" className="text-link">
                Build resume answers
              </Link>
            </div>
          </div>

          <div className="grid-3">
            <MetricCard label="Curated topics" value={snapshot.topics.length} hint="Beginner-first explanations plus interview mode." />
            <MetricCard label="Guided questions" value={snapshot.questions.length} tone="warm" hint="Structured prompts with follow-ups." />
            <MetricCard label="Imported raw questions" value={snapshot.generatedLibrary.rawQuestions.length} tone="accent" hint="Pulled from your existing documents." />
          </div>
        </div>
      </section>

      <DashboardStats defaultProfile={defaultProfile} />

      <section className="grid-topics">
        {snapshot.trackSummaries.map((summary) => (
          <TrackCard key={summary.track} summary={summary} />
        ))}
      </section>

      <section className="stack-md">
        <div className="split">
          <div>
            <span className="eyebrow">Featured study zones</span>
            <h2>Start where interview impact is highest</h2>
          </div>
          <Link href="/tracks" className="text-link">
            Browse all topics
          </Link>
        </div>
        <div className="grid-topics">
          {featuredTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      <OfflineResourceList
        resources={getOfflineResourcePacks().slice(0, 6)}
        title="Local resource packs from the best web material"
        description="These are offline interview notes derived from official and high-signal resources, stored inside the app so you do not need to open external pages while studying."
      />

      <SourceLibraryPanel library={snapshot.generatedLibrary} sources={getRawResourceHighlights()} />
    </>
  );
}
