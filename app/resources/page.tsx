import { OfflineResourceList } from "@/components/offline-resource-list";
import { getOfflineResourcePacks } from "@/lib/content";

export default function ResourcesPage() {
  return (
    <section className="stack-lg">
      <div className="panel stack-md">
        <span className="eyebrow">Offline resources</span>
        <h1>Best web material, converted into local interview study packs</h1>
        <p>
          These packs are written into the application itself, grouped by study lane, and designed for fast revision plus
          interview-ready explanation. You do not need to open external websites to use them.
        </p>
      </div>

      <OfflineResourceList resources={getOfflineResourcePacks()} />
    </section>
  );
}
