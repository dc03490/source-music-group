import {
  Badge,
  BrowserFrame,
  ButtonLink,
  Card,
  Container,
  CrossPromo,
  DesktopDashboard,
  EcosystemNav,
  Eyebrow,
  FAQ,
  FeatureCard,
  Footer,
  SkipLink,
  Lead,
  PhoneFrame,
  PhoneTabBar,
  PricingCard,
  Reveal,
  ScreenHome,
  Section,
  SectionTitle,
  Stagger,
  StaggerItem,
  SITES,
} from "@source/ui";
import {
  Activity,
  Archive,
  BrainCircuit,
  Briefcase,
  ClipboardX,
  Disc3,
  FileSearch,
  FileWarning,
  Gauge,
  ListChecks,
  Mic2,
  Network,
  PenLine,
  Radar,
  SlidersHorizontal,
  Smartphone,
  Users,
} from "lucide-react";
import { FeaturesWalkthrough } from "./features-walkthrough";
import { EarlyAccessForm } from "./early-access-form";
import { LOCAL_LINKS } from "./local-links";

const faqItems = [
  {
    q: "What exactly is a catalog audit?",
    a: "We read your releases, registrations, splits, and statements, then flag metadata issues, missing registrations, and potentially unmatched royalties, ranked by estimated value so you know what's worth investigating first.",
  },
  {
    q: "Is my catalog data safe?",
    a: "Protecting catalog data is a core design requirement. Early-access data will be encrypted in transit and at rest, used only to run your audit, and never sold. You'll be able to request deletion at any time.",
  },
  {
    q: "Which platforms and societies do you cover?",
    a: "Source Royalty is being built to analyze the statements and registration data you authorize or export, from PROs, the MLC, distributors, and DSP portals, with supported sources expanding through early access.",
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

const joinSteps = [
  {
    title: "You're on the list",
    text: "We confirm your spot by email. No spam, just launch updates.",
  },
  {
    title: "Audits open in waves",
    text: "Early-access members are invited first as the platform comes online.",
  },
  {
    title: "You connect your data",
    text: "Link or upload the statements and registrations you want reviewed. You stay in control.",
  },
  {
    title: "You get your first audit",
    text: "A catalog health score and a ranked list of issues worth investigating, free at launch.",
  },
];

export default function Home() {
  return (
    <>
      <SkipLink />
      <EcosystemNav
        active="royalty"
        sub="Royalty"
        logoSrc="/assets/logo.png"
        localLinks={LOCAL_LINKS}
        cta={{ label: "Join Early Access", href: "/early-access" }}
      />
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
                    Know Where <span className="grad-text">Your Royalties</span> Come From.
                  </h1>
                </Reveal>
                <Reveal delay={0.16}>
                  <Lead className="mx-auto mt-6 max-w-xl lg:mx-0">
                    Source Royalty uses AI to identify metadata issues, missing registrations, and
                    potential royalty opportunities across your music catalog, from your pocket, on
                    the go, or on the big screen.
                  </Lead>
                </Reveal>
                <Reveal delay={0.24}>
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                    <ButtonLink
                      href="#audit"
                      size="lg"
                      data-evt="primary_cta_clicked"
                      data-evt-cta="join_early_access"
                      data-evt-location="hero"
                    >
                      Join early access
                    </ButtonLink>
                    <ButtonLink
                      href="#demo"
                      variant="secondary"
                      size="lg"
                      data-evt="primary_cta_clicked"
                      data-evt-cta="see_demo"
                      data-evt-location="hero"
                    >
                      See the demo
                    </ButtonLink>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.2} className="mx-auto">
                <PhoneFrame tabBar={<PhoneTabBar active="home" />}>
                  <ScreenHome />
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
                van, or the couch, one dashboard, planned for every screen.
              </Lead>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mx-auto mt-14 flex max-w-5xl flex-col items-center gap-10 lg:flex-row lg:items-end">
                <BrowserFrame className="w-full flex-1" url="source-royalty.com/dashboard">
                  <DesktopDashboard />
                </BrowserFrame>
                <PhoneFrame className="shrink-0" tabBar={<PhoneTabBar active="home" />}>
                  <ScreenHome />
                </PhoneFrame>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ============ WHO IT'S FOR ============ */}
        <Section id="who">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Who It&apos;s For</Eyebrow>
              <SectionTitle className="mt-3">Built for the people who own the rights.</SectionTitle>
            </Reveal>

            <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <StaggerItem>
                <FeatureCard title="Artists" icon={Mic2} accent="blue">
                  Independent or signed, see how your releases are registered and where your
                  recording royalties flow.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Songwriters" icon={PenLine} accent="blue">
                  Track compositions across PROs and the MLC, and spot works that may be
                  unregistered or mismatched.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Producers" icon={SlidersHorizontal} accent="blue">
                  Follow your splits and credits across every track you&apos;ve touched, in one
                  place.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Managers" icon={Briefcase} accent="blue">
                  Monitor every client&apos;s catalog health from one dashboard, wherever you are.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Independent labels" icon={Disc3} accent="blue">
                  Roster-wide visibility into registrations, statements, and potential gaps.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Catalog owners & estates" icon={Archive} accent="blue">
                  Bring order to inherited or acquired catalogs before the next statement cycle.
                </FeatureCard>
              </StaggerItem>
            </Stagger>
          </Container>
        </Section>

        {/* ============ WALKTHROUGH ============ */}
        <Section id="demo" className="border-t border-border bg-card-muted/50">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>How It Works</Eyebrow>
              <SectionTitle className="mt-3">Three taps from scan to action.</SectionTitle>
              <Lead className="mt-4">
                Tap a step to see the screen: a preview of the planned flow, sized for one thumb.
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
        <Section id="features">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>The Platform</Eyebrow>
              <SectionTitle className="mt-3">Built to find what others miss.</SectionTitle>
            </Reveal>

            <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <StaggerItem>
                <FeatureCard title="Catalog Health Score" icon={Gauge} accent="blue">
                  One number that tells you how collectable your catalog is, and exactly what&apos;s
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
                  Every work, every society, every territory: tracked so nothing falls out of the
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
                  Proactive alerts when something changes: a spike, a gap, a new unclaimed match
                  worth chasing.
                </FeatureCard>
              </StaggerItem>
            </Stagger>
          </Container>
        </Section>

        {/* ============ WHY ROYALTIES GO MISSING ============ */}
        <Section id="problem" className="border-t border-border bg-card-muted/50">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>The Problem</Eyebrow>
              <SectionTitle className="mt-3">Why royalties go missing.</SectionTitle>
              <Lead className="mt-4">
                Royalties rarely vanish because someone took them. They stall because the data
                behind a song breaks somewhere along the chain.
              </Lead>
            </Reveal>

            <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StaggerItem>
                <FeatureCard title="Metadata mismatches" icon={FileWarning} accent="teal">
                  A misspelled name or a missing ISRC or ISWC can keep a royalty from ever matching
                  to you.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Missing registrations" icon={ClipboardX} accent="teal">
                  Works not registered with a PRO, the MLC, or a society in a key territory
                  can&apos;t pay out properly.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Undocumented splits" icon={Users} accent="teal">
                  When collaborators never file matching splits, payments can sit unmatched or
                  route to the wrong party.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Fragmented sources" icon={Network} accent="teal">
                  Royalties arrive from dozens of sources on different schedules. Gaps are hard to
                  see without one view.
                </FeatureCard>
              </StaggerItem>
            </Stagger>
          </Container>
        </Section>

        {/* ============ SECURITY & PRIVACY ============ */}
        <Section id="security">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Security &amp; Privacy</Eyebrow>
              <SectionTitle className="mt-3">Your data, on your terms.</SectionTitle>
            </Reveal>

            <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StaggerItem className="h-full">
                <Card className="h-full">
                  <h3 className="text-base font-semibold tracking-tight">What we collect</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Only what an audit needs: catalog metadata, registration details, and the
                    statements you choose to share.
                  </p>
                </Card>
              </StaggerItem>
              <StaggerItem className="h-full">
                <Card className="h-full">
                  <h3 className="text-base font-semibold tracking-tight">Why we need it</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Audits compare your statements against registration and release data to flag
                    inconsistencies worth reviewing.
                  </p>
                </Card>
              </StaggerItem>
              <StaggerItem className="h-full">
                <Card className="h-full">
                  <h3 className="text-base font-semibold tracking-tight">How it&apos;s protected</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Early-access data will be encrypted in transit and at rest, used only for your
                    audit, and never sold.
                  </p>
                </Card>
              </StaggerItem>
              <StaggerItem className="h-full">
                <Card className="h-full">
                  <h3 className="text-base font-semibold tracking-tight">What we don&apos;t guarantee</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    An audit surfaces potential gaps for review. We don&apos;t promise missing
                    money, recovery amounts, or outcomes.
                  </p>
                </Card>
              </StaggerItem>
            </Stagger>

            <Reveal delay={0.1}>
              <p className="mt-10 text-center">
                <a
                  href="/data-policy"
                  className="text-sm font-medium text-gold-2 underline-offset-4 hover:underline"
                >
                  Read the full data policy →
                </a>
              </p>
            </Reveal>
          </Container>
        </Section>

        {/* ============ EARLY ACCESS ============ */}
        <Section id="early-access" className="border-t border-border bg-card-muted/50">
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
                    Your first full catalog audit is free when audits open: a health score and a
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
                    Tell us what your catalog needs. Early feedback shapes what we build first.
                  </p>
                </Card>
              </StaggerItem>
            </Stagger>
          </Container>
        </Section>

        {/* ============ PRICING (planned tiers) ============ */}
        <Section id="pricing">
          <Container>
            {/* pricing_viewed fires once when this header block is half visible —
                attached to the short header (not the tall card grid) so the 0.5
                threshold is reachable on mobile. */}
            <div data-evt-view="pricing_viewed">
              <Reveal className="mx-auto max-w-2xl text-center">
                <Eyebrow>Planned Pricing</Eyebrow>
                <SectionTitle className="mt-3">Start free. Upgrade when it pays for itself.</SectionTitle>
                <Lead className="mt-4">
                  Planned launch pricing. Plans and prices may change before release.
                </Lead>
              </Reveal>
            </div>

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
                  href="mailto:royalty@sourcemusicgrp.com?subject=Source%20Royalty%20-%20Label%20plan"
                />
              </StaggerItem>
            </Stagger>
          </Container>
        </Section>

        {/* ============ FAQ ============ */}
        <Section id="faq" className="border-t border-border bg-card-muted/50">
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

        {/* ============ AFTER YOU JOIN ============ */}
        <Section id="after-you-join">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Early Access</Eyebrow>
              <SectionTitle className="mt-3">What happens after you join.</SectionTitle>
            </Reveal>
            <Reveal delay={0.1}>
              <ol className="mx-auto mt-12 max-w-2xl space-y-6">
                {joinSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span
                      aria-hidden
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono text-sm font-semibold text-gold"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold tracking-tight">{s.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
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
            </Reveal>
            {/* Form stays outside Reveal/Stagger — arming remounts children. */}
            <div className="mx-auto mt-10 max-w-md">
              <EarlyAccessForm />
            </div>
          </Container>
        </Section>

        <Section className="pt-0">
          {/* Wrapper div carries analytics attrs so @source/ui stays untouched. */}
          <div data-evt="ecosystem_company_selected" data-evt-company="publishing" data-evt-source="cross_promo">
            <CrossPromo
              title="Need publishing administration?"
              body="Source Publishing registers your works and collects across major societies and platforms."
              cta="Visit Source Publishing"
              href={SITES.publishing.url}
            />
          </div>
        </Section>
      </main>
      <Footer
        contactEmail="royalty@sourcemusicgrp.com"
        extraLinks={[{ label: "Data Policy", href: "/data-policy" }]}
      />
    </>
  );
}
