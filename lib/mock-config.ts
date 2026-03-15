import type { MockInterviewFocus, Track } from "@/lib/types";

export const MOCK_INTERVIEW_FOCUS_LABELS: Record<MockInterviewFocus, string> = {
  mixed: "Mixed round",
  react: "React.js",
  frontend: "Frontend breadth",
  javascript: "JavaScript",
  "machine-coding": "Machine coding",
  "system-design": "System design",
  "resume-behavioral": "Resume and behavioral",
};

export const MOCK_INTERVIEW_FOCUS_DESCRIPTIONS: Record<MockInterviewFocus, string> = {
  mixed: "A balanced round that mixes React, frontend breadth, JavaScript, design, and resume questions.",
  react: "Best when you want React hooks, rendering, state, and performance questions first.",
  frontend: "Best when you want browser, accessibility, testing, HTML/CSS, and product-quality questions.",
  javascript: "Best when you want async JavaScript, closures, browser runtime, and tricky language questions.",
  "machine-coding": "Best when you want practical UI-building, state modeling, and time-boxed delivery practice.",
  "system-design": "Best when you want architecture, state boundaries, scale, resilience, and tradeoff questions.",
  "resume-behavioral": "Best when you want project storytelling, ownership, tradeoffs, and behavioral practice.",
};

export const MOCK_INTERVIEW_TRACK_PRIORITY: Record<MockInterviewFocus, Track[]> = {
  mixed: ["react", "frontend", "javascript", "system-design", "machine-coding", "resume-behavioral"],
  react: ["react", "javascript", "frontend", "performance-security", "system-design"],
  frontend: ["frontend", "browser", "accessibility", "performance-security", "react"],
  javascript: ["javascript", "browser", "react", "frontend", "machine-coding"],
  "machine-coding": ["machine-coding", "frontend", "accessibility", "javascript", "system-design"],
  "system-design": ["system-design", "react", "frontend", "performance-security", "machine-coding"],
  "resume-behavioral": ["resume-behavioral", "system-design", "frontend", "react", "machine-coding"],
};
