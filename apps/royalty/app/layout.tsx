import type { Metadata } from "next";
import { Space_Grotesk, Press_Start_2P } from "next/font/google";
import { GeistMono } from "geist/font/mono";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start" });
import { SITES } from "@source/ui";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITES.royalty.url),
  title: "Source Royalty — Know Where Every Dollar Comes From",
  description:
    "Source Royalty uses AI to identify metadata issues, missing registrations, and potential royalty opportunities across your music catalog.",
  openGraph: {
    type: "website",
    siteName: "Source Royalty",
    title: "Source Royalty — AI-powered royalty intelligence",
    description:
      "Identify metadata issues, missing registrations, and royalty opportunities across your catalog.",
    url: SITES.royalty.url,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${pressStart.variable} ${GeistMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
