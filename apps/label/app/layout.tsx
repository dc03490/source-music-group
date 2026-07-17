import type { Metadata } from "next";
import { Space_Grotesk, Press_Start_2P } from "next/font/google";
import { GeistMono } from "geist/font/mono";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start" });
import { SITES } from "@source/ui";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITES.label.url),
  title: "Source Music Group — Building Artists With Long-Term Vision",
  description:
    "Source Music Group is a modern record label: artist development, creative services, marketing, distribution, and management — built on real partnership.",
  openGraph: {
    type: "website",
    siteName: "Source Music Group",
    title: "Source Music Group — Building Artists With Long-Term Vision",
    description: "Artist development. Label services. Creative partnerships.",
    url: SITES.label.url,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${pressStart.variable} ${GeistMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
