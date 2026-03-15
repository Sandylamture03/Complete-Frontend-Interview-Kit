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
  getInterviewBankTracks,
  getOfflineResourcePacks,
  getRawResourceHighlights,
} from "@/lib/content";

export default function HomePage() {
  const snapshot = getDashboardSnapshot();
  const featuredTopics = getFeaturedTopics();
  const defaultProfile = getDefaultProfile();
  const expandedTracks = getInterviewBankTracks()
    .filter((track) =>
      [
        "browser",
        "accessibility",
        "performance-security",
        "dsa",
        "machine-coding",
        "system-design",
        "resume-behavioral",
        "frontend",
      ].includes(track.track),
    )
    .sort((left, right) => left.label.localeCompare(right.label));

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
            <div className="pill-row hero-badge-row">
              <span className="hero-badge">Easy learning first</span>
              <span className="hero-badge">Interview answers next</span>
              <span className="hero-badge">AI mock practice ready</span>
            </div>
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

      <section className="panel stack-lg feature-showcase">
        <div className="split">
          <div>
            <span className="eyebrow">Study runway</span>
            <h2>One simple flow from beginner understanding to interview confidence.</h2>
          </div>
          <Link href="/mock" className="text-link">
            Practice the full flow
          </Link>
        </div>
        <div className="study-rail">
          <article className="study-step">
            <span className="eyebrow">Step 1</span>
            <h3>Understand like a beginner</h3>
            <p>Start with plain-English topics and offline packs that explain the idea before the jargon.</p>
          </article>
          <article className="study-step">
            <span className="eyebrow">Step 2</span>
            <h3>Answer like an interviewer expects</h3>
            <p>Use the interview bank to see the short answer, deeper answer, example, and follow-ups for each topic.</p>
          </article>
          <article className="study-step">
            <span className="eyebrow">Step 3</span>
            <h3>Practice with pressure</h3>
            <p>Switch to drills, coding rounds, and AI mock interviews so weak points appear before the real interview.</p>
          </article>
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
            <span className="eyebrow">Expanded coverage</span>
            <h2>Weaker tracks now have deeper topic-wise interview coverage too.</h2>
          </div>
          <Link href="/interview-bank" className="text-link">
            Open full interview bank
          </Link>
        </div>
        <div className="coverage-grid">
          {expandedTracks.map((track) => (
            <article key={track.track} className="coverage-card">
              <div className="stack-sm">
                <div className="pill-row">
                  <span className="pill">{track.label}</span>
                  <span className="pill muted">{track.topicCount} topics</span>
                </div>
                <strong>{track.totalQuestions} interview Q&A</strong>
                <p>
                  Topic-first prep with beginner explanations, interview-ready answers, examples, and follow-ups for {track.label.toLowerCase()}.
                </p>
              </div>
              <Link href={`/interview-bank/${track.track}`} className="text-link">
                Open {track.label}
              </Link>
            </article>
          ))}
        </div>
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
