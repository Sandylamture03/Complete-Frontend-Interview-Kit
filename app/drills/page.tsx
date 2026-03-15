import { DrillStudio } from "@/components/drill-studio";
import { getAllQuestions } from "@/lib/content";

export default function DrillsPage() {
  const questions = getAllQuestions();

  return (
    <section className="stack-lg">
      <div className="panel stack-md">
        <span className="eyebrow">Practice modes</span>
        <h1>Flashcards, MCQ, and timed verbal drills</h1>
        <p>
          Use this page to turn the curated question bank into active recall. Every finished session is stored locally and
          can feed your revision queue.
        </p>
      </div>
      <DrillStudio questions={questions} />
    </section>
  );
}
