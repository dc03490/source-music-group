import {
  Badge,
  ButtonLink,
  Container,
  CrossPromo,
  EcosystemNav,
  Eyebrow,
  FeatureCard,
  Footer,
  Lead,
  Reveal,
  Section,
  SectionTitle,
  Stagger,
  StaggerItem,
  SITES,
} from "@source/ui";
import { CircleDollarSign, FileStack, Clapperboard, BookMarked, ShieldCheck } from "lucide-react";

const steps = [
  {
    step: "Send us your catalog",
    text: "Share your songs, splits, and any existing registrations. We audit what's collected and what's missing.",
  },
  {
    step: "We register & collect",
    text: "We register your works globally and connect to the societies and platforms that owe you money.",
  },
  {
    step: "You get paid",
    text: "Royalties flow in with transparent statements — on a fair, independent-friendly split.",
  },
];

export default function Home() {
  return (
    <>
      <EcosystemNav active="publishing" sub="Publishing Co." />
      <main>
        {/* ============ HERO ============ */}
        <Section className="relative overflow-hidden pb-20 pt-24 sm:pt-32">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[420px] max-w-3xl rounded-full bg-gradient-to-r from-teal/15 via-blue/15 to-purple/10 blur-3xl"
          />
          <Container className="relative text-center">
            <Reveal>
              <Badge>
                <ShieldCheck className="h-3.5 w-3.5 text-teal" />
                Music publishing &amp; royalty collection
              </Badge>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mx-auto mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                Protect Your Songs.
                <br />
                <span className="grad-text">Collect Every Royalty.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <Lead className="mx-auto mt-6 max-w-xl">
                Source Publishing makes sure the money your songs earn actually reaches you. We handle
                the registrations, the collection societies, and the paperwork — so you can focus on
                writing.
              </Lead>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink href="#register" size="lg">
                  Register your works
                </ButtonLink>
                <ButtonLink href="#services" variant="secondary" size="lg">
                  What we collect
                </ButtonLink>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ============ WHAT WE DO ============ */}
        <Section id="services" className="border-t border-border bg-card-muted/50">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>What We Do</Eyebrow>
              <SectionTitle className="mt-3">Your royalties, fully collected.</SectionTitle>
              <Lead className="mt-4">
                Independent songwriters leave real money on the table every year — uncollected
                mechanicals, performance royalties, and sync fees scattered across dozens of
                societies. We chase all of it.
              </Lead>
            </Reveal>

            <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StaggerItem>
                <FeatureCard title="Royalty Collection" icon={CircleDollarSign} accent="teal">
                  We register your catalog with collection societies and streaming platforms worldwide
                  and gather every mechanical, performance, and streaming royalty you&apos;re owed.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Publishing Administration" icon={FileStack} accent="teal">
                  Splits, metadata, and society paperwork handled correctly the first time — with
                  clear, transparent statements so you always know what you earned and why.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Sync Licensing" icon={Clapperboard} accent="teal">
                  We pitch your catalog for film, TV, ads, and games — and negotiate the license so
                  your music earns beyond the stream.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Register Your Works" icon={BookMarked} accent="teal">
                  New release or a back catalog that&apos;s never been collected — we get every song
                  properly registered with the right ISWCs, splits, and territories.
                </FeatureCard>
              </StaggerItem>
            </Stagger>
          </Container>
        </Section>

        {/* ============ HOW IT WORKS ============ */}
        <Section id="how">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>How It Works</Eyebrow>
              <SectionTitle className="mt-3">Three steps to getting paid.</SectionTitle>
            </Reveal>

            <Stagger className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
              {steps.map((item, i) => (
                <StaggerItem key={item.step}>
                  <div className="h-full rounded-[var(--radius-xl)] border border-border bg-card p-6">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-teal font-semibold text-[#04231c]">
                      {i + 1}
                    </span>
                    <h3 className="mt-4 text-base font-semibold tracking-tight">{item.step}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </Section>

        {/* ============ REGISTER CTA ============ */}
        <Section id="register" className="border-t border-border bg-card-muted/50">
          <Container className="text-center">
            <Reveal>
              <Eyebrow>Get Started</Eyebrow>
              <SectionTitle className="mt-3">Register your works</SectionTitle>
              <Lead className="mx-auto mt-4 max-w-lg">
                Tell us about your catalog and we&apos;ll show you what&apos;s collectable. No catalog
                too small.
              </Lead>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink
                  href="mailto:publishing@sourcemusicgrp.com?subject=Publishing%20—%20Register%20my%20works"
                  size="lg"
                >
                  Email the publishing team →
                </ButtonLink>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Or reach us at{" "}
                <a href="mailto:publishing@sourcemusicgrp.com" className="text-teal hover:underline">
                  publishing@sourcemusicgrp.com
                </a>
              </p>
            </Reveal>
          </Container>
        </Section>

        <Section className="pt-0">
          <CrossPromo
            title="Want to audit your catalog?"
            body="Source Royalty finds metadata issues and missing income with AI."
            cta="Try Source Royalty"
            href={SITES.royalty.url}
          />
        </Section>
      </main>
      <Footer />
    </>
  );
}
