import type { GeneratedLibrary, SourceDocument } from "@/lib/types";

type SourceLibraryPanelProps = {
  library: GeneratedLibrary;
  sources: SourceDocument[];
};

export function SourceLibraryPanel({ library, sources }: SourceLibraryPanelProps) {
  return (
    <section className="panel stack-md">
      <div className="split">
        <div>
          <span className="eyebrow">Imported source library</span>
          <h2>Raw material from your existing folder</h2>
        </div>
        <p className="subtle">Generated {library.generatedAt}</p>
      </div>
      <p className="subtle">
        This layer keeps the original resource library visible while the curated study system gives you cleaner answers.
      </p>
      <div className="stack-sm">
        {sources.map((source) => (
          <article key={source.id} className="source-item">
            <div className="split">
              <strong>{source.name}</strong>
              <span className={`pill ${source.importStatus === "manual-only" ? "warn" : "muted"}`}>
                {source.importStatus}
              </span>
            </div>
            <p className="subtle">{source.path}</p>
            <p>{source.extractedPreview || "No clean preview extracted. Use this source through manual curation."}</p>
            <div className="tag-row">
              {source.highlights.slice(0, 3).map((highlight) => (
                <span key={highlight} className="tag">
                  {highlight}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
