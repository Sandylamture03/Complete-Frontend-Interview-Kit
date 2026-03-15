import { notFound } from "next/navigation";

import { OfflineResourceList } from "@/components/offline-resource-list";
import { TopicCard } from "@/components/topic-card";
import { TopicViewer } from "@/components/topic-viewer";
import {
  getOfflineResourcePacksByTrack,
  getQuestionsByTopicId,
  getRelatedTopics,
  getTopicBySlug,
} from "@/lib/content";

type TopicPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TopicPage({ params }: TopicPageProps) {
  const resolved = await params;
  const topic = getTopicBySlug(resolved.slug);

  if (!topic) {
    notFound();
  }

  const questions = getQuestionsByTopicId(topic.id);
  const relatedTopics = getRelatedTopics(topic);
  const relatedPacks = getOfflineResourcePacksByTrack(topic.track).slice(0, 2);

  return (
    <section className="stack-lg">
      <TopicViewer topic={topic} questions={questions} />

      {relatedPacks.length > 0 ? (
        <OfflineResourceList
          resources={relatedPacks}
          eyebrow="Offline study support"
          title="Local resource packs for this topic"
          description="Use these local packs when you want broader official-source context without leaving the app."
        />
      ) : null}

      {relatedTopics.length > 0 ? (
        <section className="stack-md">
          <div>
            <span className="eyebrow">Next step</span>
            <h2>Related topics to study after this one</h2>
          </div>
          <div className="grid-topics">
            {relatedTopics.map((item) => (
              <TopicCard key={item.id} topic={item} />
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
