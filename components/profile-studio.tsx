"use client";

import { useState } from "react";

import { loadProfile, saveProfile } from "@/lib/storage/profile-store";
import type { ResumePrompt, UserProfile } from "@/lib/types";

type ProfileStudioProps = {
  defaultProfile: UserProfile;
  prompts: ResumePrompt[];
};

function toLines(values: string[]) {
  return values.join("\n");
}

function parseLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ProfileStudio({ defaultProfile, prompts }: ProfileStudioProps) {
  const [profile, setProfile] = useState(() => loadProfile(defaultProfile));
  const [saved, setSaved] = useState(false);

  function update(key: keyof UserProfile, value: string | string[]) {
    setSaved(false);
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    saveProfile(profile);
    setSaved(true);
  }

  return (
    <section className="stack-lg">
      <div className="panel stack-md">
        <div className="split">
          <div>
            <span className="eyebrow">Manual onboarding</span>
            <h2>Resume profile builder</h2>
          </div>
          <span className="pill warn">PDF import stays optional in v1</span>
        </div>
        <div className="grid-2">
          <label className="field">
            <span>Name</span>
            <input value={profile.name} onChange={(event) => update("name", event.target.value)} className="input" />
          </label>
          <label className="field">
            <span>Title</span>
            <input value={profile.title} onChange={(event) => update("title", event.target.value)} className="input" />
          </label>
          <label className="field">
            <span>Years of experience</span>
            <input value={profile.yearsExperience} onChange={(event) => update("yearsExperience", event.target.value)} className="input" />
          </label>
          <label className="field">
            <span>Target band</span>
            <input value={profile.targetBand} onChange={(event) => update("targetBand", event.target.value)} className="input" />
          </label>
        </div>
        <label className="field">
          <span>Elevator pitch</span>
          <textarea className="textarea" rows={4} value={profile.elevatorPitch} onChange={(event) => update("elevatorPitch", event.target.value)} />
        </label>
        <div className="grid-2">
          <label className="field">
            <span>Core stack (one per line)</span>
            <textarea className="textarea" rows={6} value={toLines(profile.coreStack)} onChange={(event) => update("coreStack", parseLines(event.target.value))} />
          </label>
          <label className="field">
            <span>Weak areas (one per line)</span>
            <textarea className="textarea" rows={6} value={toLines(profile.weakAreas)} onChange={(event) => update("weakAreas", parseLines(event.target.value))} />
          </label>
          <label className="field">
            <span>Project highlights (one per line)</span>
            <textarea className="textarea" rows={6} value={toLines(profile.projectHighlights)} onChange={(event) => update("projectHighlights", parseLines(event.target.value))} />
          </label>
          <label className="field">
            <span>Target companies (one per line)</span>
            <textarea className="textarea" rows={6} value={toLines(profile.targetCompanies)} onChange={(event) => update("targetCompanies", parseLines(event.target.value))} />
          </label>
        </div>
        <button type="button" className="button-primary" onClick={handleSave}>
          Save local profile
        </button>
        {saved ? <p className="subtle">Saved locally in your browser on this machine.</p> : null}
      </div>

      <div className="grid-2">
        {prompts.map((prompt) => (
          <article key={prompt.id} className="panel stack-sm">
            <span className="eyebrow">{prompt.title}</span>
            <h3>{prompt.question}</h3>
            <p>{prompt.whyItMatters}</p>
            <ul className="plain-list subtle">
              {prompt.answerFrame.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
