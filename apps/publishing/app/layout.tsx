import type { Metadata } from "next";
import { Space_Grotesk, Press_Start_2P } from "next/font/google";
import { GeistMono } from "geist/font/mono";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start" });
import { SITES } from "@source/ui";
import "./globals.css";

const title = "Source Publishing — Music Publishing Administration for Independent Songwriters";
const description =
  "Publishing administration for songwriters, producers, and composers — song registration across major societies and platforms, split and metadata management, royalty collection, and sync preparation.";

export const metadata: Metadata = {
  metadataBase: new URL(SITES.publishing.url),
  title,
  description,
  openGraph: {
    type: "website",
    siteName: "Source Publishing",
    title,
    description: "Protect your songs. Collect what they earn.",
    url: SITES.publishing.url,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${pressStart.variable} ${GeistMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
