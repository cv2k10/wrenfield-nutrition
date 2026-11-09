import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wrenfield.example"),
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
    <html lang="en" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <body className="antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
