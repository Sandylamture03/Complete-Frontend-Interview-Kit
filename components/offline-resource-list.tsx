import type { OfflineResourcePack } from "@/lib/types";

import { OfflineResourceCard } from "@/components/offline-resource-card";

type OfflineResourceListProps = {
  resources: OfflineResourcePack[];
  title?: string;
  eyebrow?: string;
  description?: string;
};

export function OfflineResourceList({
  resources,
  title = "Offline resource packs",
  eyebrow = "Offline study library",
  description = "Official and high-signal web resources converted into local interview notes inside the app.",
}: OfflineResourceListProps) {
  return (
    <section className="stack-md">
      <div className="split">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <span className="pill">{resources.length} local packs</span>
      </div>
      <p className="subtle">{description}</p>
      <div className="grid-topics">
        {resources.map((pack) => (
          <OfflineResourceCard key={pack.id} pack={pack} />
        ))}
      </div>
    </section>
  );
}
