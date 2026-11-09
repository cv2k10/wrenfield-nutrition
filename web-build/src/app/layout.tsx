import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/source-sans-3";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://wrenfield-nutrition.createyourbestsite-cl.workers.dev"),
  title: "Wrenfield Nutrition — GLP-1 Nutrition Coaching That Keeps You Strong",
  description:
    "One-to-one nutrition coaching by video for U.S. adults on GLP-1 medications (semaglutide, tirzepatide) or coming off them — protein-first plates, side-effect-friendly food strategies, and habits that last. Works alongside your prescriber, never around them.",
  openGraph: {
    type: "website",
    siteName: "Wrenfield Nutrition",
    title: "Wrenfield Nutrition — Your appetite changed. Your nutrition plan should too.",
    description:
      "Honest, kitchen-real nutrition coaching for people on GLP-1 weight-loss medication. Clear pricing, no supplements, no hype — and a free fit call to start.",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "A balanced protein-forward plate with salmon, eggs, and vegetables" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
