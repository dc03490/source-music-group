/** Single source of truth for the ecosystem: sites, nav, and cross-promotion.
   Shared by every app so navigation and cross-links stay consistent. */

export type SiteKey = "source" | "royalty" | "publishing" | "label";

export interface SiteMeta {
  key: SiteKey;
  name: string;
  short: string;
  url: string;
  tagline: string;
}

/* URLs are environment-aware: on localhost (next dev, or a local production
   preview with NEXT_PUBLIC_ECOSYSTEM_ENV=local) the apps link to each other's
   dev ports; in real production they use the public domains. NEXT_PUBLIC_ vars
   are inlined at build time, so changing them requires a rebuild. */
const isLocal =
  process.env.NEXT_PUBLIC_ECOSYSTEM_ENV === "local" || process.env.NODE_ENV === "development";

/* Per-site env overrides (set in Vercel project settings) let deployments link
   to each other before the final domains exist. NEXT_PUBLIC_ vars are inlined
   at build time, so each override must be referenced literally. */
const pick = (override: string | undefined, local: string, prod: string) =>
  override && override.length > 0 ? override : isLocal ? local : prod;

const URLS: Record<SiteKey, string> = {
  source: pick(process.env.NEXT_PUBLIC_URL_SOURCE, "http://localhost:3000", "https://source.com"),
  royalty: pick(process.env.NEXT_PUBLIC_URL_ROYALTY, "http://localhost:3001", "https://source-royalty.com"),
  publishing: pick(
    process.env.NEXT_PUBLIC_URL_PUBLISHING,
    "http://localhost:3002",
    "https://source-publishing.com",
  ),
  label: pick(process.env.NEXT_PUBLIC_URL_LABEL, "http://localhost:3003", "https://sourcemusicgrp.com"),
};

export const SITES: Record<SiteKey, SiteMeta> = {
  source: {
    key: "source",
    name: "Source",
    short: "Source",
    url: URLS.source,
    tagline: "The modern operating system for music rights.",
  },
  royalty: {
    key: "royalty",
    name: "Source Royalty",
    short: "Royalty",
    url: URLS.royalty,
    tagline: "AI-powered royalty intelligence.",
  },
  publishing: {
    key: "publishing",
    name: "Source Publishing",
    short: "Publishing",
    url: URLS.publishing,
    tagline: "Publishing administration.",
  },
  label: {
    key: "label",
    name: "Source Music Group",
    short: "Music Group",
    url: URLS.label,
    tagline: "Record label & artist development.",
  },
};

export interface NavLink {
  key: string;
  label: string;
  href: string;
  siteKey?: SiteKey;
}

export const NAV_LINKS: NavLink[] = [
  { key: "royalty", label: "Royalty", href: SITES.royalty.url, siteKey: "royalty" },
  { key: "publishing", label: "Publishing", href: SITES.publishing.url, siteKey: "publishing" },
  { key: "label", label: "Music Group", href: SITES.label.url, siteKey: "label" },
  { key: "about", label: "About", href: `${SITES.source.url}/about` },
  { key: "contact", label: "Contact", href: `${SITES.source.url}/contact` },
];

