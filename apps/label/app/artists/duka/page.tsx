import type { Metadata } from "next";
import {
  ButtonLink,
  Container,
  EcosystemNav,
  Eyebrow,
  Footer,
  Reveal,
  Section,
  SkipLink,
  SITES,
} from "@source/ui";
import { ArrowUpRight } from "lucide-react";
import { LOCAL_LINKS } from "../../local-links";
import { FanSignupForm } from "../../fan-signup-form";
import { SPOTIFY_ARTIST, TRACKS } from "./tracks";

export const metadata: Metadata = {
  title: "Duka — Source Music Group",
  description:
    "Duka is the first artist on the Source Music Group roster — Hip Hop / R&B. Stream the full catalog on Spotify: Toxic, Min Type, Confidential, and more.",
  keywords: ["Duka", "Hip Hop", "R&B", "independent artist", "Source Music Group"],
  alternates: { canonical: "/artists/duka" },
};

const musicGroupJsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "Duka",
  url: `${SITES.label.url}/artists/duka`,
  genre: ["Hip Hop", "R&B"],
  sameAs: [SPOTIFY_ARTIST],
  // One MusicRecording per verified track — built from the same verified array
  // that renders the discography. Co-credits only where verified (see tracks.ts).
  track: TRACKS.map((t) => ({
    "@type": "MusicRecording",
    name: t.title,
    url: t.url,
    byArtist: [
      { "@type": "MusicGroup", name: "Duka" },
      ...(t.credit ? [{ "@type": "MusicGroup", name: t.credit }] : []),
    ],
  })),
};

export default function DukaPage() {
  return (
    <>
      <SkipLink />
      <EcosystemNav
        active="label"
        sub="Music Group"
        localLinks={LOCAL_LINKS}
        cta={{ label: "Submit Your Music", href: "/#submit" }}
      />
      <main id="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(musicGroupJsonLd) }}
        />
        {/* ============ HEADER ============ */}
        <Section className="pt-20 sm:pt-24">
          <Container className="max-w-3xl">
            <Reveal>
              <a
                href="/#artists"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← All artists
              </a>
              <div className="mt-8">
                <Eyebrow>The Roster</Eyebrow>
              </div>
              <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">
                <span className="grad-text">Duka</span>
              </h1>
              <div className="mt-3">
                <Eyebrow className="text-magenta-text">Source Music Group · Artist</Eyebrow>
              </div>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                Duka is the first artist on the Source Music Group roster — an independent voice
                working the lane between Hip Hop and R&amp;B, with a sound that doesn&apos;t sit
                neatly in either box.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Like every Source artist, Duka&apos;s relationship with the label is a partnership:
                transparent terms, shared upside, and creative control that stays with the artist.
              </p>
            </Reveal>
            {/* PHOTO SLOT: artist photography */}
            {/* VIDEO SLOT: embed when official videos exist */}
            {/* PRESS SLOT: real press quotes only — never invented */}
          </Container>
        </Section>

        {/* ============ DISCOGRAPHY ============ */}
        <Section className="border-t border-border bg-card-muted/50">
          <Container className="max-w-3xl">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight">Discography</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {TRACKS.length} tracks, streaming now on Spotify.
              </p>
              <ul className="mt-6 divide-y divide-border">
                {TRACKS.map((t, i) => (
                  <li key={t.title} className="flex items-center justify-between gap-4 py-4">
                    <span className="flex items-center gap-3">
                      <span aria-hidden className="font-mono text-sm text-subtle">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <span className="font-medium text-foreground">
                        {t.title}
                        {t.credit ? (
                          <span className="ml-2 text-sm font-normal text-muted-foreground">
                            with {t.credit}
                          </span>
                        ) : null}
                      </span>
                    </span>
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Listen
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                      <span className="sr-only">to {t.title} on Spotify</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </Section>

        {/* ============ LISTEN ============ */}
        <Section>
          <Container className="max-w-3xl">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight">Listen</h2>
            </Reveal>
            {/* Embed stays outside Reveal/Stagger — arming remounts the iframe. */}
            <div className="mt-6">
              <iframe
                title="Duka on Spotify"
                style={{ borderRadius: 12, border: 0 }}
                src="https://open.spotify.com/embed/artist/0oxAY1bzauffvCA5m6tsBZ?utm_source=generator&theme=0"
                width="100%"
                height={352}
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
            <div className="mt-6">
              <ButtonLink href={SPOTIFY_ARTIST} target="_blank" rel="noopener" size="sm">
                Follow Duka on Spotify
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
            </div>
            {/* SOCIAL SLOTS (owner input needed): Instagram / TikTok / YouTube are unverified —
                do not link until the owner confirms official accounts. When confirmed, render a
                simple icon row here (lucide icons, aria-labels). */}
          </Container>
        </Section>

        {/* ============ FAN LIST ============ */}
        <Section className="border-t border-border bg-card-muted/50">
          <Container className="max-w-3xl">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight">
                Get the next release first
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                One email when new music drops — a link to press play, and that&apos;s it.
              </p>
            </Reveal>
            {/* Form stays outside Reveal/Stagger — arming remounts children. */}
            <div className="mt-8 max-w-md">
              <FanSignupForm />
            </div>
          </Container>
        </Section>

        {/* ============ BOOKING & BUSINESS ============ */}
        <Section>
          <Container className="max-w-3xl">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight">Booking &amp; business</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Real people read these. Pick the right lane and we&apos;ll get back to you.
              </p>
              <ul className="mt-6 divide-y divide-border">
                <li className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">
                    Booking
                  </span>
                  <a
                    href="mailto:hello@sourcemusicgrp.com?subject=Duka%20—%20Booking%20inquiry"
                    className="text-gold-2 hover:underline"
                  >
                    hello@sourcemusicgrp.com
                  </a>
                </li>
                <li className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">
                    Press
                  </span>
                  <a
                    href="mailto:hello@sourcemusicgrp.com?subject=Duka%20—%20Press%20inquiry"
                    className="text-gold-2 hover:underline"
                  >
                    hello@sourcemusicgrp.com
                  </a>
                </li>
                <li className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">
                    Partnerships
                  </span>
                  <a
                    href="mailto:hello@sourcemusicgrp.com?subject=Duka%20—%20Partnership%20inquiry"
                    className="text-gold-2 hover:underline"
                  >
                    hello@sourcemusicgrp.com
                  </a>
                </li>
              </ul>
            </Reveal>
          </Container>
        </Section>
      </main>
      <Footer
        contactEmail="hello@sourcemusicgrp.com"
        extraLinks={[{ label: "Submission Terms", href: "/submission-terms" }]}
      />
    </>
  );
}
