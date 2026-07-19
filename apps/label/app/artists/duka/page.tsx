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

const SPOTIFY_ARTIST = "https://open.spotify.com/artist/0oxAY1bzauffvCA5m6tsBZ";

/* Track titles and URLs verified against the live Spotify artist embed
   (open.spotify.com/embed/artist/0oxAY1bzauffvCA5m6tsBZ) on July 18, 2026.
   Only list tracks that can be verified — never invent releases. */
const TRACKS = [
  { title: "Toxic", url: "https://open.spotify.com/track/6yQbpdfFNGP5Q2SOxyxlVY" },
  { title: "Min Type", url: "https://open.spotify.com/track/78bd60KzEPQun7OXVEwNmQ" },
  { title: "Confidential", url: "https://open.spotify.com/track/3PnjEgXyfksI9UJQGs3wj9" },
];

export const metadata: Metadata = {
  title: "Duka — Source Music Group",
  description:
    "Duka is the first artist on the Source Music Group roster. Stream Toxic, Min Type, and Confidential on Spotify.",
  alternates: { canonical: "/artists/duka" },
};

const musicGroupJsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "Duka",
  url: `${SITES.label.url}/artists/duka`,
  sameAs: [SPOTIFY_ARTIST],
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
                with a sound that doesn&apos;t sit neatly in a box.
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

        {/* ============ SELECTED TRACKS ============ */}
        <Section className="border-t border-border bg-card-muted/50">
          <Container className="max-w-3xl">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight">Selected tracks</h2>
              <ul className="mt-6 divide-y divide-border">
                {TRACKS.map((t) => (
                  <li key={t.title} className="flex items-center justify-between gap-4 py-4">
                    <span className="flex items-center gap-3">
                      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <span className="font-medium text-foreground">{t.title}</span>
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
              <ButtonLink
                href={SPOTIFY_ARTIST}
                target="_blank"
                rel="noopener"
                variant="secondary"
                size="sm"
              >
                Open Duka on Spotify
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
            </div>
          </Container>
        </Section>

        {/* ============ BOOKING & BUSINESS ============ */}
        <Section className="border-t border-border bg-card-muted/50">
          <Container className="max-w-3xl">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight">Booking &amp; business</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                For booking, business, or press inquiries:{" "}
                <a
                  href="mailto:hello@sourcemusicgrp.com?subject=Duka%20—%20business%20inquiry"
                  className="text-gold-2 hover:underline"
                >
                  hello@sourcemusicgrp.com
                </a>
              </p>
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
