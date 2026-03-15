import { notFound } from "next/navigation";

import { InterviewBankTopicSectionView } from "@/components/interview-bank-topic-section";
import { getInterviewBankByTrack } from "@/lib/content";
import { INTERVIEW_EXPERIENCE_LEVELS, TRACKS, type InterviewExperienceLevel, type Track } from "@/lib/types";
import { INTERVIEW_EXPERIENCE_LABELS } from "@/lib/utils";

type InterviewBankTrackPageProps = {
  params: Promise<{
    track: string;
  }>;
  searchParams?: Promise<{
    level?: string;
  }>;
};

export default async function InterviewBankTrackPage({ params, searchParams }: InterviewBankTrackPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const track = TRACKS.find((item) => item === resolvedParams.track) as Track | undefined;
  const selectedLevel = INTERVIEW_EXPERIENCE_LEVELS.find((level) => level === resolvedSearchParams.level) as
    | InterviewExperienceLevel
    | undefined;

  if (!track) {
    notFound();
  }

  const section = getInterviewBankByTrack(track);

  return (
    <section className="stack-lg">
      <div className="panel stack-md">
        <span className="eyebrow">Interview bank track</span>
        <h1>{section.label}</h1>
        <p>{section.description}</p>
        <div className="split stat-row">
          <span>{section.topicCount} topics</span>
          <span>{section.totalQuestions} interview questions with answers</span>
        </div>
        <form className="grid-2" action={`/interview-bank/${track}`}>
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
            Filter track bank
          </button>
        </form>
      </div>

      <div className="stack-lg">
        {section.topics.map((topicSection) => (
          <InterviewBankTopicSectionView key={topicSection.topicId} section={topicSection} selectedLevel={selectedLevel} />
        ))}
      </div>
    </section>
  );
}
