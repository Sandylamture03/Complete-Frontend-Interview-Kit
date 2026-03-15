import type { Metadata } from "next";

import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: "Frontend Interview Prep OS",
  description: "Local-first React and frontend interview preparation system.",
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
