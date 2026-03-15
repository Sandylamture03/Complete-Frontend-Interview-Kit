import { clsx } from "clsx";

import type { InterviewExperienceLevel, Track } from "@/lib/types";

export const TRACK_LABELS: Record<Track, string> = {
  react: "React.js",
  frontend: "Frontend Breadth",
  javascript: "JavaScript",
  browser: "Browser and DOM",
  "html-css": "HTML and CSS",
  accessibility: "Accessibility",
  "performance-security": "Performance and Security",
  dsa: "DSA for Frontend",
  "machine-coding": "Machine Coding",
  "system-design": "Frontend System Design",
  "resume-behavioral": "Resume and Behavioral",
};

export const TRACK_DESCRIPTIONS: Record<Track, string> = {
  react: "Hooks, rendering, data flow, and performance patterns used in React interviews.",
  frontend: "Broad frontend concepts that connect product work, browser behavior, and user experience.",
  javascript: "Core language knowledge, async thinking, and interview-ready JS mental models.",
  browser: "DOM, events, rendering pipeline, storage, and browser APIs.",
  "html-css": "Layout, semantics, responsive design, and the basics interviewers still ask.",
  accessibility: "Inclusive UI practices, keyboard support, semantics, and testing for accessibility.",
  "performance-security": "Web vitals, rendering cost, caching, and browser-side security basics.",
  dsa: "Patterns most useful for frontend rounds, not random competitive programming.",
  "machine-coding": "How to structure the practical round, communicate tradeoffs, and ship clean UI fast.",
  "system-design": "Client-side architecture, state boundaries, data flow, and scale questions.",
  "resume-behavioral": "Your stories, project deep dives, and recruiter or hiring-manager round prep.",
};

export const INTERVIEW_EXPERIENCE_LABELS: Record<InterviewExperienceLevel, string> = {
  beginner: "Beginner",
  "1-3y": "1-3 Years",
  "3-6y": "3-6 Years",
  expert: "Expert",
};

export const INTERVIEW_EXPERIENCE_DESCRIPTIONS: Record<InterviewExperienceLevel, string> = {
  beginner: "Start with simple definitions, the main idea, and the basic mistakes interviewers expect you to avoid.",
  "1-3y": "Cover common screening and theory questions that prove you know the fundamentals and can answer clearly.",
  "3-6y": "Focus on mid-level answers with practical examples, tradeoffs, and implementation thinking.",
  expert: "Practice high-signal follow-ups around architecture, pitfalls, debugging, scale, and leadership-level judgment.",
};

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function plusDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}
