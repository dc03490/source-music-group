import type { Metadata } from "next";
import { Space_Grotesk, Press_Start_2P } from "next/font/google";
import { GeistMono } from "geist/font/mono";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start" });
import { SITES } from "@source/ui";
import "./globals.css";
import { SiteAnalytics } from "./site-analytics";

const title = "Source Music Group | Independent Record Label Where Artists Become Partners";
const description =
  "Source Music Group is an independent Hip Hop and R&B label focused on artist development and real partnership: sharp marketing guidance, genuinely unique music, and transparent, artist-first terms. Home of Duka.";

const ogImage = {
  url: "/assets/og-image.png",
  width: 1200,
  height: 630,
  alt: "Source Music Group, an independent record label",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITES.label.url),
  title,
  description,
  keywords: [
    "independent record label",
    "Hip Hop label",
    "R&B label",
    "artist development",
    "label services",
    "Duka",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Source Music Group",
    title,
    description: "Independent record label. Artist development. Real partnership.",
    url: SITES.label.url,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Source Music Group",
  url: SITES.label.url,
  description,
  genre: ["Hip Hop", "R&B"],
  parentOrganization: {
    "@type": "Organization",
    name: "Source",
    url: SITES.source.url,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${pressStart.variable} ${GeistMono.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
        <SiteAnalytics site="label" />
      </body>
    </html>
  );
}
