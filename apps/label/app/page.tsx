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
import { LabelPrinciples } from "./label-principles";
import { LOCAL_LINKS } from "./local-links";

const SPOTIFY_ARTIST = "https://open.spotify.com/artist/0oxAY1bzauffvCA5m6tsBZ";

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
                Independent Record Label
              </Badge>
            </Reveal>
            <Reveal delay={0.12}>
              <h1 className="mx-auto mt-6 max-w-4xl text-balance text-[clamp(2.75rem,7.5vw,5.25rem)] font-semibold leading-[0.98] tracking-tight">
                Where artists become <span className="grad-text">partners</span>.
              </h1>
            </Reveal>
            <Reveal delay={0.18}>
              <Lead className="mx-auto mt-6 max-w-xl">
                Source Music Group is a boutique label built on three things: sharp marketing
                guidance, genuinely unique music, and a real business partnership with every artist
                we sign.
              </Lead>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink href="#artists" size="lg">
                  Meet Duka
                </ButtonLink>
                <ButtonLink href="#submit" variant="secondary" size="lg">
                  Submit Your Music
                </ButtonLink>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ============ THE LABEL ============ */}
        <Section id="about" className="border-t border-border bg-card-muted/50">
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
        <Section id="artists">
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
                  with a sound that doesn&apos;t sit neatly in a box. Stream the latest below, and
                  follow along as the catalog grows.
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

        {/* ============ SUBMIT CTA ============ */}
        <Section id="submit" className="border-t border-border bg-card-muted/50">
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
          </Container>
        </Section>

        <Section className="pt-0">
          <div className="space-y-4">
            <CrossPromo
              title="Know where your money comes from."
              body="Source Royalty is building a clear view of every royalty stream for artists and managers — early access is open now."
              cta="Explore Source Royalty"
              href={SITES.royalty.url}
            />
            <CrossPromo
              title="Write your own songs?"
              body="Source Publishing registers your compositions and collects the royalties they earn."
              cta="Explore Source Publishing"
              href={SITES.publishing.url}
            />
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
