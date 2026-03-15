import type { Metadata } from "next";

import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

const siteName = "Frontend Interview Prep OS";
const siteDescription =
  "Beginner-friendly React and frontend interview preparation with topic-wise Q&A, offline resources, drills, coding rounds, resume prep, and AI mock interviews.";
const siteUrl = new URL("https://prep.ai-developer.in");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: `${siteName} | prep.ai-developer.in`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "react interview questions",
    "frontend interview prep",
    "react developer mock interview",
    "javascript interview questions",
    "frontend coding rounds",
    "prep.ai-developer.in",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: `${siteName} | prep.ai-developer.in`,
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | prep.ai-developer.in`,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "education",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="page-shell">
          <div className="backdrop backdrop-one" />
          <div className="backdrop backdrop-two" />
          <SiteHeader />
          <main className="page-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
