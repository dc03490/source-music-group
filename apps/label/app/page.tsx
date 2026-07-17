import {
  Badge,
  ButtonLink,
  Container,
  CrossPromo,
  EcosystemNav,
  Eyebrow,
  FeatureCard,
  Footer,
  SkipLink,
  Lead,
  Reveal,
  Section,
  SectionTitle,
  Stagger,
  StaggerItem,
  SITES,
} from "@source/ui";
import { Disc3, Megaphone, Gem, Handshake } from "lucide-react";

const SPOTIFY_ARTIST = "https://open.spotify.com/artist/0oxAY1bzauffvCA5m6tsBZ";

export default function Home() {
  return (
    <>
      <SkipLink />
      <EcosystemNav active="label" sub="Music Group" />
      <main id="main">
        {/* ============ HERO ============ */}
        <Section className="relative overflow-hidden pb-20 pt-20 sm:pt-24">
          {/* Legacy hero glow: purple/teal/magenta radials */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-80 blur-2xl"
            style={{
              background:
                "radial-gradient(closest-side at 50% 30%, rgba(123,47,247,.28), transparent 70%), radial-gradient(closest-side at 30% 60%, rgba(29,211,176,.18), transparent 70%), radial-gradient(closest-side at 72% 55%, rgba(224,33,138,.22), transparent 70%)",
            }}
          />
          <Container className="relative text-center">
            <Reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/logo.png"
                alt="Source Music Group"
                className="mx-auto mb-6 h-auto w-[clamp(180px,32vw,300px)] drop-shadow-[0_0_40px_rgba(224,33,138,0.35)]"
                width={300}
                height={300}
              />
            </Reveal>
            <Reveal delay={0.06}>
              <Badge>
                <Disc3 className="h-3.5 w-3.5 text-gold" />
                Boutique music label
              </Badge>
            </Reveal>
            <Reveal delay={0.12}>
              <h1 className="mx-auto mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
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
                <ButtonLink href="mailto:hello@sourcemusicgrp.com" variant="secondary" size="lg">
                  Submit Your Music
                </ButtonLink>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ============ THE LABEL ============ */}
        <Section id="about" className="border-t border-border bg-card-muted/50">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>The Label</Eyebrow>
              <SectionTitle className="mt-3">Not a factory. A partnership.</SectionTitle>
              <Lead className="mt-4">
                We stay small on purpose. Fewer artists, deeper focus, and a model where your wins
                are our wins. No faceless machine — just a team invested in building something that
                lasts with you.
              </Lead>
            </Reveal>

            <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <StaggerItem>
                <FeatureCard title="Marketing Guidance" icon={Megaphone} accent="gold">
                  Strategy that cuts through the noise — rollout planning, audience growth, playlist
                  and social positioning, and the data to know what&apos;s actually working.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Unique Music" icon={Gem} accent="gold">
                  We champion artists with a distinct voice. No chasing trends — we help you sharpen
                  what already makes you different and put it in front of the right ears.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Artist Partnership" icon={Handshake} accent="gold">
                  An independent, business-partner relationship — transparent terms, shared upside,
                  and decisions made together. You stay in control of your art and your career.
                </FeatureCard>
              </StaggerItem>
            </Stagger>
          </Container>
        </Section>

        {/* ============ ARTISTS / DUKA ============ */}
        <Section id="artists">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>The Roster</Eyebrow>
              <SectionTitle className="mt-3">Artists</SectionTitle>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mx-auto mt-14 grid max-w-4xl items-start gap-8 lg:grid-cols-[280px_1fr]">
                <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card">
                  {/* Replace duka-placeholder.svg with a real photo when available */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/duka-placeholder.svg" alt="Duka" className="aspect-square w-full object-cover" />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold tracking-tight">Duka</h3>
                  <p className="mt-1 font-pixel text-[0.55rem] uppercase tracking-[0.14em] text-magenta">
                    Source Music Group · Artist
                  </p>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    {/* PLACEHOLDER BIO — replace with Duka's real bio when ready. */}
                    Duka is the first artist on the Source Music Group roster — an independent voice
                    with a sound that doesn&apos;t sit neatly in a box. Stream the latest below, and
                    follow along as the catalog grows.
                  </p>

                  <div className="mt-5">
                    <ButtonLink href={SPOTIFY_ARTIST} target="_blank" rel="noopener" variant="secondary" size="sm">
                      Open in Spotify ↗
                    </ButtonLink>
                  </div>

                  <div className="mt-6">
                    <iframe
                      title="Duka on Spotify"
                      style={{ borderRadius: 12 }}
                      src="https://open.spotify.com/embed/artist/0oxAY1bzauffvCA5m6tsBZ?utm_source=generator&theme=0"
                      width="100%"
                      height={352}
                      frameBorder={0}
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ============ SUBMIT CTA ============ */}
        <Section id="submit" className="border-t border-border bg-card-muted/50">
          <Container className="text-center">
            <Reveal>
              <Eyebrow>Get In Touch</Eyebrow>
              <SectionTitle className="mt-3">Submit your music</SectionTitle>
              <Lead className="mx-auto mt-4 max-w-lg">
                Looking for a partner who actually has your back? Send us your music and a little
                about your goals. We listen to everything.
              </Lead>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink href="mailto:hello@sourcemusicgrp.com?subject=Music%20Submission" size="lg">
                  Submit Your Music →
                </ButtonLink>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Prefer email? Reach us at{" "}
                <a href="mailto:hello@sourcemusicgrp.com" className="text-gold-2 hover:underline">
                  hello@sourcemusicgrp.com
                </a>
              </p>
            </Reveal>
          </Container>
        </Section>

        <Section className="pt-0">
          <CrossPromo
            title="Looking to manage your catalog?"
            body="Source Royalty gives artists and managers a clear view of every income stream."
            cta="Use Source Royalty"
            href={SITES.royalty.url}
          />
        </Section>
      </main>
      <Footer />
    </>
  );
}
