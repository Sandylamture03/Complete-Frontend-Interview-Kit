"use client";

import type { UserProfile } from "@/lib/types";

const PROFILE_KEY = "frontend-interview-prep.profile";

export function loadProfile(defaultProfile: UserProfile): UserProfile {
  if (typeof window === "undefined") return defaultProfile;

  const raw = window.localStorage.getItem(PROFILE_KEY);
  if (!raw) return defaultProfile;

  try {
    return { ...defaultProfile, ...JSON.parse(raw) } as UserProfile;
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: UserProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
