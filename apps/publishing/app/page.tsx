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
import { CircleDollarSign, FileStack, Clapperboard, BookMarked, ShieldCheck } from "lucide-react";
import { RightsComparison } from "./rights-comparison";

const steps = [
  {
    step: "Send us your catalog",
    text: "Share your songs, splits, and any existing registrations. We review what's registered, what's missing, and what needs cleaning up.",
  },
  {
    step: "We register & administer",
    text: "We register your works across major societies and platforms, fix the splits and metadata that need it, and keep the paperwork current as your catalog grows.",
  },
  {
    step: "Royalties flow through",
    text: "As societies and platforms pay out, we account and pass your share through with transparent statements. Administration is commission-based — the exact terms are in your agreement before you sign.",
  },
];

export default function Home() {
  return (
    <>
      <SkipLink />
      <EcosystemNav active="publishing" sub="Publishing Co." />
      <main id="main">
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
                <span className="grad-text">Collect What They Earn.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <Lead className="mx-auto mt-6 max-w-xl">
                Source Publishing handles the business side of your songwriting — registrations,
                splits, society paperwork, and collection — so the royalties your compositions earn
                have a clear path back to you.
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
              <SectionTitle className="mt-3">The business side of your songs, handled.</SectionTitle>
              <Lead className="mt-4">
                Every song has two halves: the recording and the composition. We work on the
                composition side — registering your songs across major societies and platforms,
                keeping splits and metadata clean, and collecting the publishing royalties they
                generate.
              </Lead>
            </Reveal>

            <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StaggerItem>
                <FeatureCard title="Royalty Collection" icon={CircleDollarSign} accent="teal">
                  We register your works with the societies and platforms that pay composition
                  royalties — performance, mechanical, and streaming — and collect what comes in on
                  your behalf, with statements that show where each payment came from.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Publishing Administration" icon={FileStack} accent="teal">
                  Splits, metadata, and society paperwork, handled carefully and documented clearly —
                  so you always know what you earned, and why.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Sync Preparation" icon={Clapperboard} accent="teal">
                  We get your catalog sync-ready — metadata, splits, and licensing paperwork prepared
                  in advance, so when an opportunity comes you can clear it quickly.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Song Registration" icon={BookMarked} accent="teal">
                  New release or an unregistered back catalog — we submit your songs to the right
                  societies with clean splits and metadata, so identifiers like ISWCs can be assigned
                  and your works are findable.
                </FeatureCard>
              </StaggerItem>
            </Stagger>
          </Container>
        </Section>

        {/* ============ MASTER VS PUBLISHING RIGHTS ============ */}
        <Section id="rights" className="border-t border-border bg-card-muted/50">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Rights 101</Eyebrow>
              <SectionTitle className="mt-3">One song, two copyrights.</SectionTitle>
              <Lead className="mt-4">
                Every released song carries two separate rights, and they earn separately. Knowing
                which is which tells you where your money should come from — and which half we
                handle.
              </Lead>
            </Reveal>
            <RightsComparison />
          </Container>
        </Section>

        {/* ============ HOW IT WORKS ============ */}
        <Section id="how">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>How It Works</Eyebrow>
              <SectionTitle className="mt-3">How administration works.</SectionTitle>
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
