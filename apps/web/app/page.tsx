import {
  Badge,
  ButtonLink,
  CompanyIndexStrip,
  Container,
  EcosystemCard,
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
  Globe,
  SkipLink,
  SITES,
} from "@source/ui";
import {
  ArrowRight,
  AudioLines,
  BarChart3,
  Disc3,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AudienceGrid } from "../components/audience-grid";
import { CompanySelector } from "../components/company-selector";
import { StatusList } from "../components/status-list";

/* Hero globe accent pulses — music-capital coordinates, brand accent cycle. */
const GLOBE_ACCENTS = [
  { color: "#2e6bff", coords: [-118.24, 34.05] as [number, number] }, // Los Angeles
  { color: "#1dd3b0", coords: [-0.13, 51.51] as [number, number] }, // London
  { color: "#e8a33d", coords: [3.38, 6.52] as [number, number] }, // Lagos
  { color: "#e0218a", coords: [139.69, 35.68] as [number, number] }, // Tokyo
  { color: "#7b2ff7", coords: [-46.63, -23.55] as [number, number] }, // São Paulo
];

export default function Home() {
  return (
    <>
      <SkipLink />
      <EcosystemNav cta={{ label: "Explore the companies", href: "#companies" }} />

      <main id="main">
        {/* ============ HERO ============ */}
        <Section className="relative overflow-hidden pb-10 pt-20 sm:pb-14 sm:pt-24">
          {/* Legacy switcher globe as the hero backdrop */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Globe
              stroke="#e0218a"
              dot="#1dd3b0"
              strokeAlpha={0.5}
              dotAlpha={0.45}
              speed={0.18}
              density={24}
              accentDots={GLOBE_ACCENTS}
            />
          </div>
          {/* Radial scrim so headline text stays readable over the globe */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side_at_50%_45%,rgba(10,10,11,0.72),transparent_75%)]"
          />
          <Container className="relative text-center">
            <Reveal>
              <Badge>
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                A music rights &amp; music technology company
              </Badge>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mx-auto mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                One company for the <span className="grad-text">life of a song</span>.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <Lead className="mx-auto mt-6 max-w-2xl">
                Source is the parent of three connected companies — a record label, a publishing
                administrator, and a royalty-intelligence platform — built for artists, songwriters,
                producers, managers, and rights holders.
              </Lead>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink
                  href="#companies"
                  size="lg"
                  data-evt="primary_cta_clicked"
                  data-evt-cta="explore_companies"
                  data-evt-location="hero"
                >
                  Explore the companies
                </ButtonLink>
                <ButtonLink
                  href="/contact"
                  variant="secondary"
                  size="lg"
                  data-evt="primary_cta_clicked"
                  data-evt-cta="partner_with_us"
                  data-evt-location="hero"
                >
                  Partner with us
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <div data-evt="ecosystem_company_selected" data-evt-source="index_strip">
                <CompanyIndexStrip className="mx-auto mt-10 max-w-3xl" />
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ============ THREE COMPANY CARDS ============ */}
        <Section id="companies" className="pt-4 sm:pt-8">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>The Companies</Eyebrow>
              <SectionTitle className="mt-3">Three companies. One system.</SectionTitle>
            </Reveal>
            <Stagger className="mt-12 grid gap-5 lg:grid-cols-3">
              <StaggerItem>
                {/* Wrapper divs carry analytics attrs so @source/ui stays untouched. */}
                <div data-evt="ecosystem_company_selected" data-evt-company="royalty" data-evt-source="cards">
                <EcosystemCard
                  eyebrow="Source Royalty"
                  title="Understand your royalties."
                  lines={["AI-powered royalty intelligence for your entire catalog."]}
                  cta="Join the early access list"
                  href={SITES.royalty.url}
                  icon={Radar}
                  accent="blue"
                />
                </div>
              </StaggerItem>
              <StaggerItem>
                <div data-evt="ecosystem_company_selected" data-evt-company="publishing" data-evt-source="cards">
                <EcosystemCard
                  eyebrow="Source Publishing"
                  title="Protect your songs."
                  lines={["Registration, administration, and royalty-collection support for your compositions."]}
                  cta="Learn More"
                  href={SITES.publishing.url}
                  icon={ShieldCheck}
                  accent="teal"
                />
                </div>
              </StaggerItem>
              <StaggerItem>
                <div data-evt="ecosystem_company_selected" data-evt-company="label" data-evt-source="cards">
                <EcosystemCard
                  eyebrow="Source Music Group"
                  title="Build a lasting career."
                  lines={["Artist development. Label services.", "Creative partnerships."]}
                  cta="Explore Label"
                  href={SITES.label.url}
                  icon={Disc3}
                  accent="gold"
                />
                </div>
              </StaggerItem>
            </Stagger>
          </Container>
        </Section>

        {/* ============ START HERE — AUDIENCE ROUTING ============ */}
        <Section id="start-here" className="border-t border-border bg-card-muted/50">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Start Here</Eyebrow>
              <SectionTitle className="mt-3">Built for every side of a song.</SectionTitle>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-12">
                <AudienceGrid />
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ============ WHY SOURCE ============ */}
        <Section id="why">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Why Source</Eyebrow>
              <SectionTitle className="mt-3">
                Your rights are an asset. Treat them like one.
              </SectionTitle>
              <Lead className="mt-4">
                Most creators never see the full value of their work — royalties go uncollected,
                metadata drifts, and ownership gets murky. Source turns rights management into
                infrastructure.
              </Lead>
            </Reveal>

            <Stagger className="mt-14 grid gap-5 sm:grid-cols-3">
              <StaggerItem>
                <FeatureCard title="Data-driven" icon={BarChart3}>
                  Every recommendation is grounded in your actual catalog, statements, and
                  registrations — not guesswork.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="AI-native" icon={Sparkles}>
                  Intelligence that reads statements, spots metadata issues, and flags data
                  inconsistencies and possible unmatched royalties for review.
                </FeatureCard>
              </StaggerItem>
              <StaggerItem>
                <FeatureCard title="Creator-owned" icon={ShieldCheck}>
                  You keep ownership and control. Transparent terms across every Source company —
                  no fine-print surprises.
                </FeatureCard>
              </StaggerItem>
            </Stagger>
          </Container>
        </Section>

        {/* ============ HOW THE COMPANIES WORK TOGETHER ============ */}
        <Section id="how-it-connects" className="border-t border-border bg-card-muted/50">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>The Ecosystem</Eyebrow>
              <SectionTitle className="mt-3">How the companies work together</SectionTitle>
              <Lead className="mt-4">
                Each Source company stands on its own — together they cover the full life of a song,
                from release to royalty.
              </Lead>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
                {[
                  {
                    icon: AudioLines,
                    step: "Release",
                    name: SITES.label.name,
                    text: "Develop, release, and market your music with a label that acts like a partner.",
                  },
                  {
                    icon: ShieldCheck,
                    step: "Protect",
                    name: SITES.publishing.name,
                    text: "Register every work correctly and coordinate collection across societies and territories.",
                  },
                  {
                    icon: Radar,
                    step: "Understand",
                    name: SITES.royalty.name,
                    text: "Review your catalog with AI and spot potential gaps that may need correction or follow-up.",
                  },
                ].map((item, i) => (
                  <div key={item.step} className="relative">
                    {i > 0 ? (
                      <span
                        aria-hidden
                        className="absolute -left-2 top-1/2 hidden h-px w-4 bg-border sm:block"
                      />
                    ) : null}
                    <div className="h-full rounded-[var(--radius-xl)] border border-border bg-card p-6 text-center">
                      <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-brand">
                        <item.icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-subtle">
                        {`0${i + 1} · ${item.step}`}
                      </p>
                      <h3 className="mt-2 text-base font-semibold">{item.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ============ COMPANY SELECTOR ============ */}
        <Section id="selector">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Not sure?</Eyebrow>
              <SectionTitle className="mt-3">Answer two questions.</SectionTitle>
            </Reveal>
            <div className="mt-12">
              <CompanySelector />
            </div>
          </Container>
        </Section>

        {/* ============ FROM THE ECOSYSTEM ============ */}
        <Section id="from-the-ecosystem">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <SectionTitle>From the ecosystem</SectionTitle>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mx-auto mt-12 grid max-w-4xl gap-5 lg:grid-cols-2">
                <a
                  href={`${SITES.label.url}/artists/duka`}
                  data-evt="ecosystem_company_selected"
                  data-evt-company="label"
                  data-evt-source="from_the_ecosystem"
                  className="group flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-colors hover:border-subtle"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/duka-placeholder.svg"
                    alt="Duka (placeholder artwork)"
                    className="aspect-[2/1] w-full rounded-[var(--radius-card)] object-cover"
                  />
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Duka — first artist on the Source Music Group roster
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gold-2">
                    Meet Duka
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      strokeWidth={2}
                    />
                  </span>
                </a>
                <StatusList className="h-full" />
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ============ PARTNER & CONTACT ============ */}
        <Section id="partner" className="border-t border-border bg-card-muted/50">
          <Container className="text-center">
            <Reveal>
              <SectionTitle>Partner with Source</SectionTitle>
              <Lead className="mx-auto mt-4 max-w-lg">
                Distribution, sync, catalog, or technology — if you work with music rights, we want
                to talk.
              </Lead>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink
                  href="/contact"
                  size="lg"
                  data-evt="primary_cta_clicked"
                  data-evt-cta="contact_team"
                  data-evt-location="partner"
                >
                  Contact the team
                </ButtonLink>
                <ButtonLink href="/about" variant="secondary" size="lg">
                  About Source
                </ButtonLink>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ============ FINAL CTA ============ */}
        <Section className="border-t border-border">
          <Container className="text-center">
            <Reveal>
              <SectionTitle>Find your starting point.</SectionTitle>
              <Lead className="mx-auto mt-4 max-w-lg">
                Three companies, one connected system — pick the one that fits where you are today.
              </Lead>
              <div data-evt="ecosystem_company_selected" data-evt-source="index_strip">
                <CompanyIndexStrip className="mx-auto mt-8 max-w-3xl" />
              </div>
            </Reveal>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
