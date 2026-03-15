import { ProfileStudio } from "@/components/profile-studio";
import { getDefaultProfile, getResumePrompts } from "@/lib/content";

export default function ResumePage() {
  return (
    <section className="stack-lg">
      <div className="panel stack-md">
        <span className="eyebrow">Resume and behavioral prep</span>
        <h1>Convert your experience into strong interview stories</h1>
        <p>
          The resume PDF is kept as a source file, but the main path in v1 is manual onboarding so your real project
          ownership and story framing are clean, editable, and interview-ready.
        </p>
      </div>
      <ProfileStudio defaultProfile={getDefaultProfile()} prompts={getResumePrompts()} />
    </section>
  );
}
