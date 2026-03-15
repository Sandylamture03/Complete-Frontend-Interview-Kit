import { InterviewBankTrackCard } from "@/components/interview-bank-track-card";
import { getInterviewBankTracks } from "@/lib/content";
import { INTERVIEW_EXPERIENCE_LEVELS, type InterviewExperienceLevel } from "@/lib/types";
import { INTERVIEW_EXPERIENCE_LABELS } from "@/lib/utils";

type InterviewBankPageProps = {
  searchParams?: Promise<{
    level?: string;
  }>;
};

export default async function InterviewBankPage({ searchParams }: InterviewBankPageProps) {
  const resolved = (await searchParams) ?? {};
  const selectedLevel = INTERVIEW_EXPERIENCE_LEVELS.find((level) => level === resolved.level) as
    | InterviewExperienceLevel
    | undefined;
  const sections = getInterviewBankTracks();

  return (
    <section className="stack-lg">
      <div className="panel stack-md">
        <span className="eyebrow">Interview bank</span>
        <h1>Track-wise interview questions and answers from beginner to expert.</h1>
        <p>
          This section is built only for interview preparation. Open any track to study topic by topic, with questions,
          answers, and follow-ups grouped by experience level.
        </p>
        <form className="grid-2" action="/interview-bank">
          <label className="field">
            <span>Experience level focus</span>
            <select className="select" name="level" defaultValue={selectedLevel ?? ""}>
              <option value="">All experience levels</option>
              {INTERVIEW_EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {INTERVIEW_EXPERIENCE_LABELS[level]}
                </option>
              ))}
            </select>
          </label>
          <button className="button-primary" type="submit">
            Apply focus
          </button>
        </form>
        {selectedLevel ? (
          <p className="subtle">
            Current focus: {INTERVIEW_EXPERIENCE_LABELS[selectedLevel]}. Open a track to see only that experience level
            across every topic.
          </p>
        ) : null}
      </div>

      <div className="grid-topics">
        {sections.map((section) => (
          <InterviewBankTrackCard key={section.track} section={section} />
        ))}
      </div>
    </section>
  );
}
