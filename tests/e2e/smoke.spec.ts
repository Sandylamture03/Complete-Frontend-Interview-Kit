import { expect, test } from "@playwright/test";

test("dashboard renders the core prep surfaces", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /React and frontend interview prep/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Interview Bank", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Tracks", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Resources", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Resume", exact: true })).toBeVisible();
});

test("mock page shows the AI-guided interview surface", async ({ page }) => {
  await page.goto("/mock");

  await expect(page.getByRole("heading", { name: /practice with ai guidance or self-scored rounds/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /practice one question at a time with feedback in two layers/i })).toBeVisible();
  await expect(page.getByText(/your browser can read the interviewer aloud/i)).toBeVisible();
});

test("interview bank renders track-first interview prep", async ({ page }) => {
  await page.goto("/interview-bank");

  await expect(page.getByRole("heading", { name: /track-wise interview questions and answers from beginner to expert/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /open interview bank/i }).first()).toBeVisible();
});
