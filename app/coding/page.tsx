import { getCodingPrompts } from "@/lib/content";

export default function CodingPage() {
  const prompts = getCodingPrompts();

  return (
    <section className="stack-lg">
      <div className="panel stack-md">
        <span className="eyebrow">Coding rounds</span>
        <h1>Polyfills, DOM tasks, machine coding, and frontend design prompts</h1>
        <p>Each prompt below is structured for interview practice: scope, hints, outline, and evaluation checklist.</p>
      </div>

      <div className="grid-topics">
        {prompts.map((prompt) => (
          <article key={prompt.id} className="panel stack-md">
            <div className="split">
              <div>
                <span className="eyebrow">{prompt.track}</span>
                <h2>{prompt.title}</h2>
              </div>
              <span className="pill">{prompt.difficulty}</span>
            </div>
            <p>{prompt.scenario}</p>
            <div>
              <strong>Requirements</strong>
              <ul className="plain-list subtle">
                {prompt.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Hints</strong>
              <ul className="plain-list subtle">
                {prompt.hints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Solution outline</strong>
              <ul className="plain-list subtle">
                {prompt.solutionOutline.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            {prompt.starterCode ? (
              <pre className="code-block">
                <code>{prompt.starterCode}</code>
              </pre>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
