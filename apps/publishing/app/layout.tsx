import type { Metadata } from "next";
import { Space_Grotesk, Press_Start_2P } from "next/font/google";
import { GeistMono } from "geist/font/mono";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start" });
import { SITES } from "@source/ui";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITES.publishing.url),
  title: "Source Publishing — Protect Your Songs. Collect Every Royalty.",
  description:
    "Global publishing administration for independent songwriters: PRO and MLC registration, royalty collection, sync licensing, and transparent statements.",
  openGraph: {
    type: "website",
    siteName: "Source Publishing",
    title: "Source Publishing — Publishing administration",
    description: "Protect your songs. Collect every royalty.",
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
