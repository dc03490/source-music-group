import {
  Badge,
  BrowserFrame,
  ButtonLink,
  Card,
  Container,
  CrossPromo,
  EcosystemNav,
  Eyebrow,
  FAQ,
  FeatureCard,
  Footer,
  SkipLink,
  Lead,
  PhoneFrame,
  PricingCard,
  Reveal,
  ScreenDashboard,
  Section,
  SectionTitle,
  Stagger,
  StaggerItem,
  SITES,
} from "@source/ui";
import {
  Activity,
  BrainCircuit,
  FileSearch,
  Gauge,
  ListChecks,
  Radar,
  Smartphone,
} from "lucide-react";
import { FeaturesWalkthrough } from "./features-walkthrough";

const faqItems = [
  {
    q: "What exactly is a catalog audit?",
    a: "We read your releases, registrations, splits, and statements, then flag metadata issues, missing registrations, and potentially unmatched royalties — ranked by estimated value so you know what's worth investigating first.",
  },
  {
    q: "Is my catalog data safe?",
    a: "Protecting catalog data is a core design requirement. Early-access data will be encrypted in transit and at rest, used only to run your audit, and never sold. You'll be able to request deletion at any time.",
  },
  {
    q: "Which platforms and societies do you cover?",
    a: "Source Royalty is being built to analyze the statements and registration data you authorize or export — from PROs, the MLC, distributors, and DSP portals — with supported sources expanding through early access.",
  },
  {
    q: "When does the platform launch?",
    a: "Source Royalty is in active development. Join the early-access list below and you'll be first in line when audits open.",
  },
  {
    q: "Will I be locked into a contract?",
    a: "The plan is month-to-month pricing with no long-term lock-in, and the first audit free. Final terms will be published at launch before you pay anything.",
  },
];

export default function Home() {
  return (
    <>
      <SkipLink />
      <EcosystemNav active="royalty" sub="Royalty" cta={{ label: "Join Early Access", href: "#audit" }} />
      <main id="main">
        {/* ============ HERO ============ */}
        <Section className="relative overflow-hidden pb-16 pt-20 sm:pt-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[420px] max-w-3xl rounded-full bg-gradient-to-r from-blue/15 via-purple/15 to-magenta/10 blur-3xl"
          />
          <Container className="relative">
            <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_auto]">
              <div className="text-center lg:text-left">
                <Reveal>
                  <Badge>
                    <Smartphone className="h-3.5 w-3.5 text-teal" />
                    Designed for mobile &amp; desktop
                  </Badge>
                </Reveal>
                <Reveal delay={0.08}>
                  <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                    Know Where <span className="grad-text">Every Dollar</span> Comes From.
                  </h1>
                </Reveal>
                <Reveal delay={0.16}>
                  <Lead className="mx-auto mt-6 max-w-xl lg:mx-0">
                    Source Royalty uses AI to identify metadata issues, missing registrations, and
                    potential royalty opportunities across your music catalog — from your pocket, on
                    the go, or on the big screen.
                  </Lead>
                </Reveal>
                <Reveal delay={0.24}>
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                    <ButtonLink href="#audit" size="lg">
                      Join early access
                    </ButtonLink>
                    <ButtonLink href="#demo" variant="secondary" size="lg">
                      See the demo
                    </ButtonLink>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.2} className="mx-auto">
                <PhoneFrame>
                  <ScreenDashboard />
                </PhoneFrame>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* ============ ANY DEVICE ============ */}
        <Section id="devices" className="border-t border-border bg-card-muted/50">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Any Device</Eyebrow>
              <SectionTitle className="mt-3">
                Your catalog in your pocket. Your audit on the big screen.
              </SectionTitle>
              <Lead className="mt-4">
                One URL, no downloads. Check your catalog&apos;s status from the studio, the tour
                van, or the couch — one dashboard, planned for every screen.
              </Lead>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mx-auto mt-14 flex max-w-4xl flex-col items-center gap-10 lg:flex-row lg:items-end">
                <BrowserFrame className="w-full flex-1" url="source-royalty.com/dashboard">
                  <div className="mx-auto max-w-sm">
                    <ScreenDashboard />
                  </div>
                </BrowserFrame>
                <PhoneFrame className="shrink-0">
                  <ScreenDashboard />
                </PhoneFrame>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ============ WALKTHROUGH ============ */}
        <Section id="demo">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>How It Works</Eyebrow>
              <SectionTitle className="mt-3">Three taps from scan to action.</SectionTitle>
              <Lead className="mt-4">
                Tap a step to see the screen — a preview of the planned flow, sized for one thumb.
              </Lead>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-14">
                <FeaturesWalkthrough />
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ============ FEATURES GRID ============ */}
        <Section id="features" className="border-t border-border bg-card-muted/50">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>The Platform</Eyebrow>
              <SectionTitle className="mt-3">Built to find what others miss.</SectionTitle>
            </Reveal>

            <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <StaggerItem>
                <FeatureCard title="Catalog Health Score" icon={Gauge} accent="blue">
                  One number that tells you how collectable your catalog is — and exactly what&apos;s
                  dragging it down.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Royalty Audit" icon={Radar} accent="blue">
                  A full sweep across registrations, splits, and statements to surface royalties
                  that may not be reaching you.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Metadata Intelligence" icon={BrainCircuit} accent="blue">
                  AI that catches the typos, missing ISRCs, and mismatched credits that quietly
                  starve your royalties.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Registration Tracking" icon={ListChecks} accent="blue">
                  Every work, every society, every territory — tracked so nothing falls out of the
                  system unnoticed.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Statement Analysis" icon={FileSearch} accent="blue">
                  Upload royalty statements and get a plain-English readout of what happened and
                  what looks wrong.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="AI Insights" icon={Activity} accent="blue">
                  Proactive alerts when something changes — a spike, a gap, a new unclaimed match
                  worth chasing.
                </FeatureCard>
              </StaggerItem>
            </Stagger>
          </Container>
        </Section>

        {/* ============ EARLY ACCESS ============ */}
        <Section id="early-access">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Early Access</Eyebrow>
              <SectionTitle className="mt-3">What early access includes.</SectionTitle>
            </Reveal>
            <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <StaggerItem className="h-full">
                <Card className="h-full">
                  <h3 className="text-base font-semibold tracking-tight">Free first audit</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Your first full catalog audit is free when audits open — a health score and a
                    ranked issue list.
                  </p>
                </Card>
              </StaggerItem>
              <StaggerItem className="h-full">
                <Card className="h-full">
                  <h3 className="text-base font-semibold tracking-tight">First in line</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Early-access members are invited in waves before public launch.
                  </p>
                </Card>
              </StaggerItem>
              <StaggerItem className="h-full">
                <Card className="h-full">
                  <h3 className="text-base font-semibold tracking-tight">A say in the roadmap</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Tell us what your catalog needs — early feedback shapes what we build first.
                  </p>
                </Card>
              </StaggerItem>
            </Stagger>
          </Container>
        </Section>

        {/* ============ PRICING (planned tiers) ============ */}
        <Section id="pricing" className="border-t border-border bg-card-muted/50">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Planned Pricing</Eyebrow>
              <SectionTitle className="mt-3">Start free. Upgrade when it pays for itself.</SectionTitle>
              <Lead className="mt-4">
                Planned launch pricing — plans and prices may change before release.
              </Lead>
            </Reveal>

            <Stagger className="mx-auto mt-14 grid max-w-4xl gap-5 pt-3 lg:grid-cols-3">
              <StaggerItem>
                <PricingCard
                  name="Free Audit"
                  tag="At launch"
                  price="$0"
                  blurb="See what's out there before you spend a dollar."
                  features={["One full catalog scan", "Catalog Health Score", "Top 3 issues surfaced"]}
                  cta="Join early access"
                  href="#audit"
                />
              </StaggerItem>
              <StaggerItem>
                <PricingCard
                  name="Artist"
                  tag="At launch"
                  price="$9"
                  period="/month"
                  blurb="Continuous monitoring for working artists."
                  features={[
                    "Unlimited scans & monitoring",
                    "Statement analysis",
                    "Guided registration fixes",
                    "Mobile alerts",
                  ]}
                  cta="Join Early Access"
                  href="#audit"
                  highlighted
                />
              </StaggerItem>
              <StaggerItem>
                <PricingCard
                  name="Label"
                  tag="At launch"
                  price="$29"
                  period="/month"
                  blurb="Every artist on your roster, one dashboard."
                  features={["Up to 25 artists", "Roster-wide health scores", "Priority claim support", "Exports & reporting"]}
                  cta="Talk to us"
                  href="mailto:royalty@sourcemusicgrp.com?subject=Source%20Royalty%20—%20Label%20plan"
                />
              </StaggerItem>
            </Stagger>
          </Container>
        </Section>

        {/* ============ FAQ ============ */}
        <Section id="faq">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>FAQ</Eyebrow>
              <SectionTitle className="mt-3">Questions, answered.</SectionTitle>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mx-auto mt-12 max-w-2xl">
                <FAQ items={faqItems} />
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ============ FINAL CTA ============ */}
        <Section id="audit" className="border-t border-border bg-card-muted/50">
          <Container className="text-center">
            <Reveal>
              <Eyebrow>Launching Soon</Eyebrow>
              <SectionTitle className="mt-3">Be first in line for your free audit.</SectionTitle>
              <Lead className="mx-auto mt-4 max-w-lg">
                The platform is in active development. Join the early-access list and we&apos;ll
                open your audit the moment it&apos;s ready.
              </Lead>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink
                  href="mailto:royalty@sourcemusicgrp.com?subject=Early%20access%20—%20Source%20Royalty"
                  size="lg"
                >
                  Join the early-access list →
                </ButtonLink>
              </div>
            </Reveal>
          </Container>
        </Section>

        <Section className="pt-0">
          <CrossPromo
            title="Need publishing administration?"
            body="Source Publishing registers your works and collects every royalty, worldwide."
            cta="Visit Source Publishing"
            href={SITES.publishing.url}
          />
        </Section>
      </main>
      <Footer />
    </>
  );
}
