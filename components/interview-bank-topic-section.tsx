import Link from "next/link";

import type { InterviewExperienceLevel, InterviewBankTopicSection } from "@/lib/types";
import { INTERVIEW_EXPERIENCE_LABELS, TRACK_LABELS } from "@/lib/utils";

type InterviewBankTopicSectionProps = {
  section: InterviewBankTopicSection;
  selectedLevel?: InterviewExperienceLevel;
};

export function InterviewBankTopicSectionView({ section, selectedLevel }: InterviewBankTopicSectionProps) {
  const experienceSections = selectedLevel
    ? section.experienceSections.filter((experienceSection) => experienceSection.level === selectedLevel)
    : section.experienceSections;

  return (
    <article className="panel stack-lg">
      <div className="split">
        <div className="stack-sm">
          <div className="pill-row">
            <span className="pill">{TRACK_LABELS[section.track]}</span>
            <span className="pill muted">{section.difficulty}</span>
          </div>
          <h2>{section.topicTitle}</h2>
          <p>{section.summary}</p>
        </div>
        <Link href={`/topics/${section.topicSlug}`} className="text-link">
          Open study topic
        </Link>
      </div>

      <div className="tag-row">
        {section.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      {experienceSections.map((experienceSection) => (
        <section key={`${section.topicId}-${experienceSection.level}`} className="stack-md">
          <div className="split">
            <div>
              <span className="eyebrow">{INTERVIEW_EXPERIENCE_LABELS[experienceSection.level]}</span>
              <h3>{experienceSection.label} interview questions</h3>
            </div>
            <span className="pill">{experienceSection.questions.length} questions</span>
          </div>
          <p className="subtle">{experienceSection.description}</p>
          <div className="stack-sm">
            {experienceSection.questions.map((question) => (
              <article key={question.id} className="question-card stack-sm">
                <div className="split">
                  <span className="eyebrow">{question.roundType}</span>
                  <div className="pill-row">
                    <span className="pill muted">{INTERVIEW_EXPERIENCE_LABELS[question.level]}</span>
                    {question.sourceLabel ? <span className="pill muted">{question.sourceLabel}</span> : null}
                  </div>
                </div>
                <strong>{question.prompt}</strong>
                <div className="callout">
                  <strong>Easy answer</strong>
                  <p>{question.simpleAnswer}</p>
                </div>
                <div className="callout">
                  <strong>Interview-ready answer</strong>
                  <p>{question.answer}</p>
                </div>
                <div className="callout">
                  <strong>Example</strong>
                  <p>{question.example}</p>
                </div>
                <div className="callout">
                  <strong>Why interviewers ask this</strong>
                  <p>{question.whyAsked}</p>
                </div>
                <div className="tag-row">
                  {question.tags.map((tag) => (
                    <span key={`${question.id}-${tag}`} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                {question.followUps.length > 0 ? (
                  <div>
                    <span className="eyebrow">Common follow-ups</span>
                    <ul className="plain-list subtle">
                      {question.followUps.map((followUp) => (
                        <li key={`${question.id}-${followUp}`}>{followUp}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
