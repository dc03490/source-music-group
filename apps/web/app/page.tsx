import {
  Badge,
  ButtonLink,
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
  AudioLines,
  BarChart3,
  Disc3,
  Radar,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <SkipLink />
      <EcosystemNav cta={{ label: "Explore the companies", href: "#companies" }} />

      <main id="main">
        {/* ============ HERO ============ */}
        <Section className="relative overflow-hidden pb-16 pt-24 sm:pb-24 sm:pt-32">
          {/* Legacy switcher globe as the hero backdrop */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Globe stroke="#e0218a" dot="#1dd3b0" strokeAlpha={0.5} dotAlpha={0.45} speed={0.18} density={24} />
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
                The modern operating system for music rights
              </Badge>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mx-auto mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Own Your Music.
                <br />
                <span className="grad-text">Own Your Royalties.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <Lead className="mx-auto mt-6 max-w-xl">
                The Source ecosystem helps creators release music, collect royalties, and build
                lasting careers.
              </Lead>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink href="#companies" size="lg">
                  Explore the ecosystem
                </ButtonLink>
                <ButtonLink href={SITES.royalty.url} variant="secondary" size="lg">
                  Learn about Source Royalty
                </ButtonLink>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ============ THREE ECOSYSTEM CARDS ============ */}
        <Section id="companies" className="pt-4 sm:pt-8">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>The Companies</Eyebrow>
              <SectionTitle className="mt-3">Three companies. One system.</SectionTitle>
            </Reveal>
            <Stagger className="mt-12 grid gap-5 lg:grid-cols-3">
              <StaggerItem>
                <EcosystemCard
                  eyebrow="Source Royalty"
                  title="Understand your royalties."
                  lines={["AI-powered royalty intelligence for your entire catalog."]}
                  cta="Join the early access list"
                  href={SITES.royalty.url}
                  icon={Radar}
                  accent="blue"
                />
              </StaggerItem>
              <StaggerItem>
                <EcosystemCard
                  eyebrow="Source Publishing"
                  title="Protect your songs."
                  lines={["Registration, administration, and royalty-collection support for your compositions."]}
                  cta="Learn More"
                  href={SITES.publishing.url}
                  icon={ShieldCheck}
                  accent="teal"
                />
              </StaggerItem>
              <StaggerItem>
                <EcosystemCard
                  eyebrow="Source Music Group"
                  title="Build a lasting career."
                  lines={["Artist development. Label services.", "Creative partnerships."]}
                  cta="Explore Label"
                  href={SITES.label.url}
                  icon={Disc3}
                  accent="gold"
                />
              </StaggerItem>
            </Stagger>
          </Container>
        </Section>

        {/* ============ WHY SOURCE ============ */}
        <Section id="why" className="border-t border-border bg-card-muted/50">
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

            <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
              <StaggerItem>
                <FeatureCard title="One ecosystem" icon={Workflow}>
                  Release through the label, administer through publishing, audit through Royalty —
                  everything connects.
                </FeatureCard>
              </StaggerItem>
            </Stagger>
          </Container>
        </Section>

        {/* ============ THE ECOSYSTEM ============ */}
        <Section id="how-it-connects">
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

        {/* ============ FINAL CTA ============ */}
        <Section className="border-t border-border">
          <Container className="text-center">
            <Reveal>
              <SectionTitle>Ready to see what your catalog is worth?</SectionTitle>
              <Lead className="mx-auto mt-4 max-w-lg">
                Join the Source Royalty early access list — or explore the company that fits where
                you are today.
              </Lead>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink href={SITES.royalty.url} size="lg">
                  Join the Royalty early access list
                </ButtonLink>
                <ButtonLink href={SITES.publishing.url} variant="secondary" size="lg">
                  Explore Publishing
                </ButtonLink>
              </div>
            </Reveal>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
