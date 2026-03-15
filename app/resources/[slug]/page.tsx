import { notFound } from "next/navigation";

import { OfflineResourceCard } from "@/components/offline-resource-card";
import { OfflineResourcePackView } from "@/components/offline-resource-pack-view";
import { getOfflineResourcePackBySlug, getOfflineResourcePacksByTrack } from "@/lib/content";

type ResourcePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ResourcePage({ params }: ResourcePageProps) {
  const resolved = await params;
  const pack = getOfflineResourcePackBySlug(resolved.slug);

  if (!pack) {
    notFound();
  }

  const related = getOfflineResourcePacksByTrack(pack.mappedTracks[0]).filter((item) => item.id !== pack.id).slice(0, 3);

  return (
    <section className="stack-lg">
      <OfflineResourcePackView pack={pack} />

      {related.length > 0 ? (
        <section className="stack-md">
          <div>
            <span className="eyebrow">Related local packs</span>
            <h2>Study next without leaving the app</h2>
          </div>
          <div className="grid-topics">
            {related.map((item) => (
              <OfflineResourceCard key={item.id} pack={item} />
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
