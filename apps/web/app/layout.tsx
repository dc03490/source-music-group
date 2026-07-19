import type { Metadata } from "next";
import { Space_Grotesk, Press_Start_2P } from "next/font/google";
import { GeistMono } from "geist/font/mono";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start" });
import { SITES } from "@source/ui";
import "./globals.css";
import { SiteAnalytics } from "./site-analytics";

const title = "Source — One company for the life of a song.";
const description =
  "A music rights & music technology company — record label, publishing administration, and royalty intelligence for artists, songwriters, producers, managers, and rights holders.";

const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Source — a music rights & music technology company",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITES.source.url),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Source",
    title,
    description,
    url: SITES.source.url,
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
  name: "Source",
  url: SITES.source.url,
  description:
    "A music rights & music technology company — record label, publishing administration, and royalty intelligence for artists, songwriters, producers, managers, and rights holders.",
  subOrganization: [
    { "@type": "Organization", name: "Source Royalty", url: SITES.royalty.url },
    { "@type": "Organization", name: "Source Publishing", url: SITES.publishing.url },
    { "@type": "Organization", name: "Source Music Group", url: SITES.label.url },
  ],
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
        <SiteAnalytics site="web" />
      </body>
    </html>
  );
}
