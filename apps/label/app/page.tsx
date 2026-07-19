import {
  Badge,
  ButtonLink,
  Container,
  CrossPromo,
  EcosystemNav,
  Eyebrow,
  Footer,
  SkipLink,
  Lead,
  Reveal,
  Section,
  SectionTitle,
  SITES,
} from "@source/ui";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Disc3 } from "lucide-react";
import { SubmissionForm } from "./submission-form";
import { FanSignupForm } from "./fan-signup-form";
import { LabelPrinciples } from "./label-principles";
import { LOCAL_LINKS } from "./local-links";
import { LATEST, SPOTIFY_ARTIST, TRACKS } from "./artists/duka/tracks";

export default function Home() {
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
        {/* ============ HERO ============ */}
        <Section className="relative overflow-hidden pb-20 pt-20 sm:pt-24">
          {/* Legacy hero glow: purple/teal/magenta radials */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -bottom-24 opacity-90 blur-2xl"
            style={{
              background:
                "radial-gradient(closest-side at 50% 30%, rgba(123,47,247,.28), transparent 70%), radial-gradient(closest-side at 30% 60%, rgba(29,211,176,.18), transparent 70%), radial-gradient(closest-side at 72% 55%, rgba(224,33,138,.22), transparent 70%)",
            }}
          />
          <Container className="relative text-center">
            <Reveal>
              <Image
                src="/assets/logo.png"
                alt="Source Music Group"
                width={96}
                height={96}
                priority
                className="mx-auto mb-8 h-20 w-20 sm:h-24 sm:w-24 drop-shadow-[0_0_32px_rgba(224,33,138,0.35)]"
              />
            </Reveal>
            <Reveal delay={0.06}>
              <Badge>
                <Disc3 className="h-3.5 w-3.5 text-gold" />
                Independent Hip Hop / R&amp;B Label
              </Badge>
            </Reveal>
            <Reveal delay={0.12}>
              <h1 className="mx-auto mt-6 max-w-4xl text-balance text-[clamp(2.75rem,7.5vw,5.25rem)] font-semibold leading-[0.98] tracking-tight">
                Where artists become <span className="grad-text">partners</span>.
              </h1>
            </Reveal>
            <Reveal delay={0.18}>
              <Lead className="mx-auto mt-6 max-w-xl">
                Source Music Group is a boutique Hip Hop and R&amp;B label built on three things:
                sharp marketing guidance, genuinely unique music, and a real business partnership
                with every artist we sign.
              </Lead>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink
                  href="#artists"
                  size="lg"
                  data-evt="primary_cta_clicked"
                  data-evt-cta="listen_duka"
                  data-evt-location="hero"
                >
                  Listen to Duka
                </ButtonLink>
                <ButtonLink
                  href="#submit"
                  variant="secondary"
                  size="lg"
                  data-evt="primary_cta_clicked"
                  data-evt-cta="submit_music"
                  data-evt-location="hero"
                >
                  Submit Your Music
                </ButtonLink>
              </div>
              <a
                href="#updates"
                className="mt-5 inline-block font-mono text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Get the next release first ↓
              </a>
            </Reveal>
          </Container>
        </Section>

        {/* ============ THE LABEL ============ */}
        <Section id="about" className="scroll-mt-20 border-t border-border bg-card-muted/50">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <Reveal>
                <Eyebrow>The Label</Eyebrow>
                <SectionTitle className="mt-3">Not a factory. A partnership.</SectionTitle>
                <Lead className="mt-4">
                  We stay small on purpose. Fewer artists, deeper focus, and a model where your wins
                  are our wins. No faceless machine — just a team invested in building something
                  that lasts with you.
                </Lead>
              </Reveal>
              <LabelPrinciples />
            </div>
          </Container>
        </Section>

        {/* ============ ARTISTS / DUKA ============ */}
        <Section id="artists" className="scroll-mt-20">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>The Roster</Eyebrow>
              <SectionTitle className="mt-3">Artists</SectionTitle>
            </Reveal>

            <div className="mx-auto mt-14 grid max-w-5xl items-start gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
              <Reveal>
                <Eyebrow className="text-magenta-text">First on the Roster</Eyebrow>
                <h3 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">
                  <span className="grad-text">Duka</span>
                </h3>
                <p className="mt-1 font-pixel text-[0.55rem] uppercase tracking-[0.14em] text-magenta-text">
                  Source Music Group · Artist
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Duka is the first artist on the Source Music Group roster — an independent voice
                  working the lane between Hip Hop and R&amp;B. Stream the latest below, and follow
                  along as the catalog grows.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <ButtonLink href="/artists/duka" size="sm">
                    Artist page
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </ButtonLink>
                  <ButtonLink
                    href={SPOTIFY_ARTIST}
                    target="_blank"
                    rel="noopener"
                    variant="secondary"
                    size="sm"
                    data-evt="external_music_link_clicked"
                    data-evt-artist="duka"
                    data-evt-item="artist"
                  >
                    Open in Spotify
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </ButtonLink>
                </div>
                {/* PHOTO SLOT (future): when real Duka photography arrives, convert this grid to
                    [photo | text] — add an <Image> column here; see /artists/duka for the
                    matching slot. */}
              </Reveal>

              {/* Embed stays outside Reveal/Stagger — arming remounts the iframe. */}
              <div>
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
            </div>
          </Container>
        </Section>

        {/* ============ LATEST RELEASE ============ */}
        {/* "Latest Release" label + year verified July 19, 2026 from the Spotify artist
            page ("Latest Release • Single" card for Min Type, <time datetime="2026">) —
            see artists/duka/tracks.ts for the full provenance note. */}
        <Section id="latest" className="scroll-mt-20 border-t border-border bg-card-muted/50">
          <Container className="text-center">
            <Reveal>
              <Eyebrow>Latest Release</Eyebrow>
              <SectionTitle className="mt-3 text-2xl sm:text-3xl">Latest release</SectionTitle>
              <p className="mx-auto mt-8 max-w-4xl text-balance break-words text-[clamp(3rem,9vw,6.5rem)] font-semibold leading-[0.95] tracking-tight">
                {LATEST.track.title}
              </p>
              <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-gold">
                DUKA{LATEST.track.credit ? ` WITH ${LATEST.track.credit.toUpperCase()}` : ""} · HIP
                HOP / R&amp;B · SPOTIFY · {LATEST.year}
              </p>
            </Reveal>
            {/* Embed stays outside Reveal/Stagger — arming remounts the iframe. */}
            {/* ARTWORK SLOT: the embed carries official artwork; swap in owner-supplied art
                via <Image> when available. */}
            <div className="mx-auto mt-8 max-w-xl">
              <iframe
                title={`${LATEST.track.title} — Duka on Spotify`}
                style={{ borderRadius: 12, border: 0 }}
                src={`${LATEST.track.url.replace(
                  "open.spotify.com/track/",
                  "open.spotify.com/embed/track/"
                )}?utm_source=generator&theme=0`}
                width="100%"
                height={152}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
            <Reveal>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {/* Spotify destination is captured via the href property on this event. */}
                <ButtonLink
                  href={LATEST.track.url}
                  target="_blank"
                  rel="noopener"
                  size="lg"
                  data-evt="primary_cta_clicked"
                  data-evt-cta="play_latest"
                  data-evt-location="latest"
                >
                  Play on Spotify
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
                <ButtonLink href="#updates" variant="link">
                  Get release alerts
                </ButtonLink>
              </div>
              <p
                aria-hidden
                className="mt-12 overflow-hidden whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em] text-subtle"
              >
                {TRACKS.map((t) => t.title).join(" · ")}
              </p>
            </Reveal>
          </Container>
        </Section>

        {/* ============ FAN LIST ============ */}
        <Section id="updates" className="scroll-mt-20">
          <Container className="text-center">
            <Reveal className="mx-auto max-w-2xl">
              <Eyebrow>Fan List</Eyebrow>
              <SectionTitle className="mt-3">Get the next release first.</SectionTitle>
              <Lead className="mx-auto mt-4 max-w-lg">
                One email when new Duka music drops — a link to press play, and that&apos;s it.
              </Lead>
            </Reveal>
            {/* Form stays outside Reveal/Stagger — arming remounts children. */}
            <div className="mx-auto mt-10 max-w-md">
              <FanSignupForm />
            </div>
          </Container>
        </Section>

        {/* ============ SUBMIT CTA ============ */}
        <Section id="submit" className="scroll-mt-20 border-t border-border bg-card-muted/50">
          <Container className="text-center">
            <Reveal>
              <Eyebrow>Submissions</Eyebrow>
              <SectionTitle className="mt-3">Submit your music</SectionTitle>
              <Lead className="mx-auto mt-4 max-w-lg">
                Send us your music and a few lines about your goals. We&apos;re a small team and we
                sign selectively — submissions are reviewed in batches, and if it&apos;s a fit,
                we&apos;ll reach out.
              </Lead>
            </Reveal>
            {/* Form stays outside Reveal/Stagger — arming remounts children. */}
            <div className="mx-auto mt-10 max-w-md">
              <SubmissionForm />
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Prefer email? Send links to{" "}
              <a href="mailto:hello@sourcemusicgrp.com" className="text-gold-2 hover:underline">
                hello@sourcemusicgrp.com
              </a>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Not submitting music? Reach the right desk:{" "}
              <a
                href="mailto:hello@sourcemusicgrp.com?subject=Booking%20inquiry%20—%20Source%20Music%20Group"
                className="text-gold-2 hover:underline"
                data-evt="primary_cta_clicked"
                data-evt-cta="booking_email"
                data-evt-location="submit"
              >
                Booking
              </a>{" "}
              ·{" "}
              <a
                href="mailto:hello@sourcemusicgrp.com?subject=Press%20inquiry%20—%20Source%20Music%20Group"
                className="text-gold-2 hover:underline"
                data-evt="primary_cta_clicked"
                data-evt-cta="press_email"
                data-evt-location="submit"
              >
                Press
              </a>{" "}
              ·{" "}
              <a
                href="mailto:hello@sourcemusicgrp.com?subject=Partnership%20inquiry%20—%20Source%20Music%20Group"
                className="text-gold-2 hover:underline"
                data-evt="primary_cta_clicked"
                data-evt-cta="partnership_email"
                data-evt-location="submit"
              >
                Partnerships
              </a>
            </p>
          </Container>
        </Section>

        <Section className="pt-0">
          <div className="space-y-4">
            {/* Wrapper divs carry analytics attrs so @source/ui stays untouched. */}
            <div data-evt="ecosystem_company_selected" data-evt-company="royalty" data-evt-source="cross_promo">
              <CrossPromo
                title="Know where your money comes from."
                body="Source Royalty is building a clear view of every royalty stream for artists and managers — early access is open now."
                cta="Explore Source Royalty"
                href={SITES.royalty.url}
              />
            </div>
            <div data-evt="ecosystem_company_selected" data-evt-company="publishing" data-evt-source="cross_promo">
              <CrossPromo
                title="Write your own songs?"
                body="Source Publishing registers your compositions and collects the royalties they earn."
                cta="Explore Source Publishing"
                href={SITES.publishing.url}
              />
            </div>
          </div>
        </Section>
      </main>
      <Footer
        contactEmail="hello@sourcemusicgrp.com"
        extraLinks={[{ label: "Submission Terms", href: "/submission-terms" }]}
      />
    </>
  );
}
