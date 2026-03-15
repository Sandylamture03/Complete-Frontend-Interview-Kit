import { RevisionBoard } from "@/components/revision-board";
import { getAllTopics } from "@/lib/content";

export default function RevisionPage() {
  return (
    <section className="stack-lg">
      <div className="panel stack-md">
        <span className="eyebrow">Revision engine</span>
        <h1>Turn saved drills and mocks into your next study list</h1>
        <p>
          This page reads your locally stored session history, counts weaker tags, and maps them back to curated topics so
          revision becomes focused instead of random.
        </p>
      </div>
      <RevisionBoard topics={getAllTopics()} />
    </section>
  );
}
