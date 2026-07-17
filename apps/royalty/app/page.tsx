import {
  BrowserFrame,
  ButtonLink,
  Container,
  CrossPromo,
  EcosystemNav,
  Eyebrow,
  FAQ,
  FeatureCard,
  Footer,
  Lead,
  PhoneFrame,
  PricingCard,
  Reveal,
  ScreenDashboard,
  ScreenEarnings,
  Section,
  SectionTitle,
  SparkChip,
  Stagger,
  StaggerItem,
  StatChip,
  TestimonialCard,
  SITES,
} from "@source/ui";
import { Activity, BrainCircuit, FileSearch, Gauge, ListChecks, Radar } from "lucide-react";
import { FeaturesWalkthrough } from "./features-walkthrough";

const faqItems = [
  {
    q: "What exactly is a catalog audit?",
    a: "We read your releases, registrations, splits, and statements, then flag metadata issues, missing registrations, and unclaimed royalties — ranked by how much each one is likely worth to you.",
  },
  {
    q: "Is my catalog data safe?",
    a: "Yes. Your data is used only to run your audit, encrypted in transit and at rest, and never shared or sold. You can delete it at any time.",
  },
  {
    q: "Which platforms and societies do you cover?",
    a: "Streaming DSPs plus the major collection points — PROs, the MLC, and international societies — with coverage expanding as the platform grows.",
  },
  {
    q: "When does the platform launch?",
    a: "Source Royalty is in active development. Join the early-access list below and you'll be first in line when audits open.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — paid plans are month-to-month with no lock-in, and the free audit is exactly that: free.",
  },
];

export default function Home() {
  return (
    <>
      <EcosystemNav active="royalty" sub="Royalty" />
      <main>
        {/* ============ HERO — Trade-style purple panel ============ */}
        <Section className="pb-16 pt-8 sm:pt-10">
          <Container>
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#a184fa] to-purple px-6 pt-14 text-center sm:rounded-[2.5rem] sm:pt-20">
                {/* soft blurred blobs */}
                <div aria-hidden className="pointer-events-none absolute -left-10 top-1/3 h-56 w-56 rounded-full bg-magenta/45 blur-3xl" />
                <div aria-hidden className="pointer-events-none absolute -right-8 bottom-10 h-64 w-64 rounded-full bg-[#ff9ecb]/40 blur-3xl" />
                <div aria-hidden className="pointer-events-none absolute right-1/4 top-6 h-40 w-40 rounded-full bg-teal/25 blur-3xl" />

                <div className="relative">
                  <p className="font-pixel text-[0.55rem] uppercase tracking-[0.16em] text-black/60">
                    Source Royalty · Mobile &amp; Desktop
                  </p>
                  <h1 className="mx-auto mt-4 max-w-3xl text-balance text-5xl font-bold leading-[1.02] tracking-tight text-[#0d0714] sm:text-6xl lg:text-7xl">
                    Royalties in Your Pocket.
                  </h1>
                  <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-black/70 sm:text-lg">
                    AI that finds metadata issues, missing registrations, and unclaimed money across
                    your catalog — and tells you what every dollar is doing, wherever you are.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href="#audit"
                      className="inline-flex h-12 items-center rounded-full bg-[#0d0714] px-6 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
                    >
                      Start Free Audit
                    </a>
                    <a
                      href="#demo"
                      className="inline-flex h-12 items-center rounded-full border border-black/35 px-6 text-sm font-medium text-[#0d0714] transition-colors hover:bg-black/10"
                    >
                      See Demo
                    </a>
                  </div>

                  {/* phone rising from the panel bottom, chips floating beside it */}
                  <div className="relative mx-auto mt-12 w-fit">
                    <PhoneFrame className="-mb-24 sm:-mb-20">
                      <ScreenEarnings />
                    </PhoneFrame>
                    <StatChip
                      value="$460.14"
                      caption="unclaimed · claim-ready"
                      className="absolute -left-52 top-16 hidden md:flex"
                    />
                    <SparkChip
                      label="MLC · Mechanical"
                      delta="0.08%"
                      className="absolute -right-44 top-40 hidden md:block"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
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
                One URL, no downloads. Check what you&apos;re owed from the studio, the tour van, or
                the couch — the same live dashboard follows you everywhere.
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
              <SectionTitle className="mt-3">Three taps to found money.</SectionTitle>
              <Lead className="mt-4">
                Tap a step to see the screen — this is the actual flow, sized for one thumb.
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
                  A full sweep across registrations, splits, and statements to surface money
                  you&apos;re owed but not receiving.
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

        {/* ============ REVIEWS (placeholder) ============ */}
        <Section id="reviews">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Early Access</Eyebrow>
              <SectionTitle className="mt-3">What early users are saying.</SectionTitle>
            </Reveal>
            <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <StaggerItem>
                <TestimonialCard
                  quote="Placeholder — an artist on finding four unregistered songs in their first scan."
                  name="Artist Name"
                  role="Independent Artist · Placeholder"
                />
              </StaggerItem>
              <StaggerItem>
                <TestimonialCard
                  quote="Placeholder — a manager on checking claim status from the road between shows."
                  name="Artist Name"
                  role="Artist Manager · Placeholder"
                />
              </StaggerItem>
              <StaggerItem>
                <TestimonialCard
                  quote="Placeholder — a producer on the health score finally making royalties make sense."
                  name="Artist Name"
                  role="Producer · Placeholder"
                />
              </StaggerItem>
            </Stagger>
          </Container>
        </Section>

        {/* ============ PRICING (placeholder tiers) ============ */}
        <Section id="pricing" className="border-t border-border bg-card-muted/50">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Pricing</Eyebrow>
              <SectionTitle className="mt-3">Start free. Upgrade when it pays for itself.</SectionTitle>
              <Lead className="mt-4">Launch pricing — final plans may change before release.</Lead>
            </Reveal>

            <Stagger className="mx-auto mt-14 grid max-w-4xl gap-5 pt-3 lg:grid-cols-3">
              <StaggerItem>
                <PricingCard
                  name="Free Audit"
                  price="$0"
                  blurb="See what's out there before you spend a dollar."
                  features={["One full catalog scan", "Catalog Health Score", "Top 3 issues surfaced"]}
                  cta="Start Free Audit"
                  href="#audit"
                />
              </StaggerItem>
              <StaggerItem>
                <PricingCard
                  name="Artist"
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

        {/* ============ FINAL CTA — purple panel bookend ============ */}
        <Section id="audit">
          <Container>
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#a184fa] to-purple px-6 py-16 text-center sm:rounded-[2.5rem] sm:py-20">
                <div aria-hidden className="pointer-events-none absolute -left-8 bottom-0 h-48 w-48 rounded-full bg-magenta/40 blur-3xl" />
                <div aria-hidden className="pointer-events-none absolute -right-8 top-0 h-48 w-48 rounded-full bg-[#ff9ecb]/40 blur-3xl" />
                <div className="relative">
                  <p className="font-pixel text-[0.55rem] uppercase tracking-[0.16em] text-black/60">
                    Launching Soon
                  </p>
                  <h2 className="mx-auto mt-4 max-w-2xl text-balance text-3xl font-bold tracking-tight text-[#0d0714] sm:text-5xl">
                    Be first in line for your free audit.
                  </h2>
                  <p className="mx-auto mt-4 max-w-lg text-black/70">
                    The platform is in active development. Join the early-access list and we&apos;ll
                    open your audit the moment it&apos;s ready.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href="mailto:royalty@sourcemusicgrp.com?subject=Early%20access%20—%20Source%20Royalty"
                      className="inline-flex h-12 items-center rounded-full bg-[#0d0714] px-6 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
                    >
                      Join the early-access list →
                    </a>
                  </div>
                </div>
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
