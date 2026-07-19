import type { Metadata } from "next";
import { Space_Grotesk, Press_Start_2P } from "next/font/google";
import { GeistMono } from "geist/font/mono";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start" });
import { SITES } from "@source/ui";
import "./globals.css";
import { SiteAnalytics } from "./site-analytics";

const title = "Source Royalty — AI Music Royalty Audit & Catalog Monitoring";
const description =
  "AI-powered music royalty audit and catalog monitoring — find metadata issues, missing registrations, and potential royalty gaps across PRO, MLC, and DSP statements. In development — join early access.";

const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Source Royalty — AI music royalty audit & catalog monitoring, in development",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITES.royalty.url),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Source Royalty",
    title,
    description,
    url: SITES.royalty.url,
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
  name: "Source Royalty",
  url: SITES.royalty.url,
  description,
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
        <SiteAnalytics site="royalty" />
      </body>
    </html>
  );
}
