import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#FBF7F0",
  colorScheme: "light",
};

const siteUrl = "https://wrenfield.example";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title:
    "Wrenfield Nutrition | GLP-1 nutrition coaching that works alongside your prescriber",
  description:
    "One-to-one video nutrition coaching for U.S. adults on GLP-1 weight-loss medication, or coming off one. Protein-first plates, side-effect-friendly food and strength habits. A free fit call, clear sample pricing, no supplements to buy. Not medical advice.",
  keywords: [
    "GLP-1 nutrition coaching",
    "semaglutide nutrition",
    "tirzepatide nutrition",
    "protein-first meals",
    "nutrition coaching",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Wrenfield Nutrition",
    title: "Your appetite changed. Your nutrition plan should too.",
    description:
      "Calm, honest one-to-one nutrition coaching for people on GLP-1 medications. Protein-first plates, food-first side-effect help, and habits that last. Concept website: fictional business.",
    images: [
      {
        url: "https://images.pexels.com/photos/14515103/pexels-photo-14515103.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
        width: 1200,
        height: 630,
        alt: "A grilled salmon fillet with roasted vegetables on a ceramic plate.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wrenfield Nutrition | GLP-1 nutrition coaching",
    description:
      "Protein-first, food-first nutrition coaching that works alongside your prescriber. Concept website: fictional business, sample content.",
    images: [
      "https://images.pexels.com/photos/14515103/pexels-photo-14515103.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    ],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400&family=Inter:wght@400;500;600;700&display=swap"
        />
        <link rel="preconnect" href="https://images.pexels.com" />
      </head>
      <body className="bg-cream text-sage antialiased">{children}</body>
    </html>
  );
}
