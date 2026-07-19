import type { Metadata } from "next";
import { Space_Grotesk, Press_Start_2P } from "next/font/google";
import { GeistMono } from "geist/font/mono";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start" });
import { SITES } from "@source/ui";
import "./globals.css";
import { SiteAnalytics } from "./site-analytics";

const title = "Source Publishing — Music Publishing Administration for Independent Songwriters";
const description =
  "Publishing administration for songwriters, producers, and composers — song registration across major societies and platforms, split and metadata management, royalty collection, and sync preparation.";

const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Source Publishing — music publishing administration for independent songwriters",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITES.publishing.url),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Source Publishing",
    title,
    description: "Protect your songs. Collect what they earn.",
    url: SITES.publishing.url,
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
  name: "Source Publishing",
  url: SITES.publishing.url,
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
        <SiteAnalytics site="publishing" />
      </body>
    </html>
  );
}
