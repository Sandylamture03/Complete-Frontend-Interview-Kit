import { AiMockInterviewer } from "@/components/ai-mock-interviewer";
import { MockSimulator } from "@/components/mock-simulator";
import { getAllQuestions, getDefaultProfile } from "@/lib/content";

export default function MockPage() {
  const aiConfigured = Boolean(process.env.AI_API_KEY ?? process.env.OPENAI_API_KEY);

  return (
    <section className="stack-lg">
      <div className="panel stack-md">
        <span className="eyebrow">Mock round</span>
        <h1>Practice with AI guidance or self-scored rounds</h1>
        <p>
          Use the AI mode when you want one-question-at-a-time coaching based on your local resources, or use the
          deterministic self-scored round when you want offline practice with no external model.
        </p>
      </div>
      <AiMockInterviewer aiConfigured={aiConfigured} defaultProfile={getDefaultProfile()} />
      <MockSimulator questions={getAllQuestions()} />
    </section>
  );
}
