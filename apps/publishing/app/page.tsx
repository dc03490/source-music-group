import {
  Badge,
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
  Reveal,
  Section,
  SectionTitle,
  Stagger,
  StaggerItem,
  SITES,
} from "@source/ui";
import {
  BookMarked,
  BookOpen,
  Briefcase,
  CircleDollarSign,
  Clapperboard,
  FileStack,
  Film,
  Library,
  MicVocal,
  Music4,
  PenLine,
  Radio,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { ConsultationForm } from "./consultation-form";
import { FlowDiagram } from "./flow-diagram";
import { LOCAL_LINKS } from "./local-links";
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

const audiences = [
  {
    title: "Songwriters",
    icon: PenLine,
    text: "Writing for yourself or for other artists — we register your share, keep your splits documented, and collect the writer royalties your songs generate.",
  },
  {
    title: "Producers",
    icon: SlidersHorizontal,
    text: "Producer splits are publishing too. If you hold writer shares on records you produce, we document, register, and administer them like any other composition interest.",
  },
  {
    title: "Composers",
    icon: Music4,
    text: "Scores, cues, and instrumentals earn publishing royalties. We keep registrations and metadata in order so your work is identifiable wherever it's used.",
  },
  {
    title: "Artists who write",
    icon: MicVocal,
    text: "Record your own songs and you're on both sides — master and publishing. We administer the composition side while your label or distributor handles the recording.",
  },
  {
    title: "Catalog owners & estates",
    icon: Library,
    text: "Inherited or acquired a catalog? We help organize what's there — registrations, splits, paperwork — and administer it going forward.",
  },
  {
    title: "Managers",
    icon: Briefcase,
    text: "Managing a writer or a roster? We take on the publishing administration and give you clean statements to plan around.",
  },
];

const royaltyCategories = [
  {
    title: "Performance",
    icon: Radio,
    text: "Earned when your song is performed publicly — radio, venues, live shows, and the performance share of streams. Collected by PROs like ASCAP, BMI, and SESAC.",
  },
  {
    title: "Mechanical",
    icon: RefreshCw,
    text: "Earned when your song is reproduced — the mechanical share of streams, downloads, and physical. In the US, largely collected by The MLC.",
  },
  {
    title: "Sync",
    icon: Film,
    text: "Earned when your song is licensed into film, TV, ads, or games. Negotiated per placement — the reason we keep your catalog sync-ready.",
  },
  {
    title: "Print",
    icon: BookOpen,
    text: "Earned from sheet music and licensed lyric reprints. Smaller for most catalogs — but it's still your money when it happens.",
  },
];

/* NOTE FOR COUNSEL REVIEW: the role, fee, and agreement answers below must
   match the actual administration agreement before any agreement is signed. */
const faqItems = [
  {
    q: "Are you a publisher or an administrator?",
    a: "We act as your administrator. You keep ownership of your songs — we register your works, manage splits and metadata, and collect publishing royalties on your behalf. We don't take your copyrights.",
  },
  {
    q: "What does it cost?",
    a: "Administration is commission-based: we earn a percentage of the publishing royalties we collect for you. The exact rate, term, territory, and termination rights are published in your agreement before you sign.",
  },
  {
    q: "Is the agreement exclusive? How long does it run?",
    a: "Term, territory, exclusivity, and post-term collection are all set out in the agreement you review before signing. We'd rather you read the terms than take our word for it — and we'll walk through anything that's unclear.",
  },
  {
    q: "Do I need to join a PRO first?",
    a: "It helps, but it isn't a blocker. If you're already with a PRO like ASCAP or BMI, we work with your existing memberships. If not, we'll walk you through which memberships make sense and how to set them up.",
  },
  {
    q: "What happens after I request a consultation?",
    a: "A real person reads your note and replies from publishing@sourcemusicgrp.com, typically within a few business days. We'll look at your catalog together and tell you honestly whether administration makes sense for where you are.",
  },
  {
    q: "What's the difference between master and publishing royalties?",
    a: "The master is the recording; the composition is the song itself — the lyrics and melody. Master royalties pay whoever owns the recording. Publishing royalties pay the songwriters through performance, mechanical, sync, and print income. Source Publishing works on the publishing side.",
  },
];

/* NOTE FOR COUNSEL REVIEW: role/fee framing below must match the actual
   administration agreement before any agreement is signed. */
const termsItems = [
  {
    title: "Administrator, not owner",
    text: "We act as your administrator — you keep ownership of your songs. We register, collect, and account; the copyrights stay yours.",
  },
  {
    title: "Commission-based",
    text: "We earn a percentage of the publishing royalties we collect on your behalf. The exact rate is published in your agreement — not discovered after.",
  },
  {
    title: "Terms before you sign",
    text: "Commission rate, term length, territory, exclusivity, and termination rights are all set out in your agreement before you sign. Read it, question it, then decide.",
  },
  {
    title: "Ask us anything",
    text: "Source Publishing is early-stage, and we'd rather earn trust than assume it. If something matters to you — collection periods, post-term collection, how you'd leave — ask, and we'll answer in plain language.",
  },
];

const afterSteps = [
  {
    title: "A real reply",
    text: "A person — not an autoresponder — reads your note and replies from publishing@sourcemusicgrp.com, typically within a few business days.",
  },
  {
    title: "A catalog conversation",
    text: "We go through your catalog together: what's registered, what isn't, and whether administration makes sense for where you are. Bring questions.",
  },
  {
    title: "Your decision, on paper",
    text: "If it's a fit, you get the full agreement — commission, term, territory, termination — to read before you sign. If it's not, you'll still leave knowing more about your catalog than when you came.",
  },
];

const helpfulItems = [
  "Split sheets or writer-share agreements",
  "Society memberships — your PRO and, in the US, The MLC",
  "A list of released songs — titles, writers, release dates",
];

export default function Home() {
  return (
    <>
      <SkipLink />
      <EcosystemNav
        active="publishing"
        sub="Publishing Co."
        localLinks={LOCAL_LINKS}
        cta={{ label: "Request a consultation", href: "/#consult" }}
      />
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
                Music publishing administration
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
                <ButtonLink href="#consult" size="lg">
                  Request a consultation
                </ButtonLink>
                <ButtonLink href="#services" variant="secondary" size="lg">
                  What we do
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

        {/* ============ WHO WE SERVE ============ */}
        <Section id="who">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Who We Serve</Eyebrow>
              <SectionTitle className="mt-3">Built for the people who write the songs.</SectionTitle>
              <Lead className="mt-4">
                If you hold a share of a composition, publishing royalties are part of your income —
                whether writing is your whole job or one of several hats.
              </Lead>
            </Reveal>

            <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {audiences.map((item) => (
                <StaggerItem key={item.title}>
                  <FeatureCard title={item.title} icon={item.icon} accent="teal">
                    {item.text}
                  </FeatureCard>
                </StaggerItem>
              ))}
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

        {/* ============ ROYALTY CATEGORIES ============ */}
        <Section id="royalties" className="border-t border-border bg-card-muted/50">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Royalty Categories</Eyebrow>
              <SectionTitle className="mt-3">Where publishing money comes from.</SectionTitle>
              <Lead className="mt-4">
                Four royalty streams attach to every composition. Different uses, different
                collectors — one reason publishing income is easy to lose track of.
              </Lead>
            </Reveal>

            <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {royaltyCategories.map((item) => (
                <StaggerItem key={item.title}>
                  <FeatureCard title={item.title} icon={item.icon} accent="teal">
                    {item.text}
                  </FeatureCard>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal className="mt-14">
              <FlowDiagram />
            </Reveal>
          </Container>
        </Section>

        {/* ============ TERMS TRANSPARENCY ============ */}
        <Section id="terms">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>How We Work</Eyebrow>
              <SectionTitle className="mt-3">Straight terms, in writing.</SectionTitle>
              <Lead className="mt-4">
                Publishing deals have a reputation. Ours is simple to explain — and everything below
                is spelled out in the agreement you read before you sign.
              </Lead>
            </Reveal>

            <Stagger className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
              {termsItems.map((item) => (
                <StaggerItem key={item.title}>
                  <Card className="h-full">
                    <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </Section>

        {/* ============ FAQ ============ */}
        <Section id="faq" className="border-t border-border bg-card-muted/50">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>FAQ</Eyebrow>
              <SectionTitle className="mt-3">Common questions, straight answers.</SectionTitle>
            </Reveal>
            {/* FAQ is stateful — keep it outside Reveal/Stagger so arming can't remount it. */}
            <div className="mx-auto mt-14 max-w-2xl">
              <FAQ items={faqItems} />
            </div>
          </Container>
        </Section>

        {/* ============ WHAT HAPPENS AFTER ============ */}
        <Section id="after">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>What To Expect</Eyebrow>
              <SectionTitle className="mt-3">What happens after you reach out.</SectionTitle>
            </Reveal>

            <Reveal>
              <ol className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
                {afterSteps.map((item, i) => (
                  <li
                    key={item.title}
                    className="h-full rounded-[var(--radius-xl)] border border-border bg-card p-6"
                  >
                    <span
                      aria-hidden
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-teal/40 bg-muted font-mono text-sm text-teal"
                    >
                      {i + 1}
                    </span>
                    <h3 className="mt-4 text-base font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal>
              <Card className="mx-auto mt-10 max-w-2xl">
                <h3 className="text-base font-semibold tracking-tight">Helpful to have ready</h3>
                <ul className="mt-4 space-y-2.5">
                  {helpfulItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-subtle">
                  None of this is required to start the conversation.
                </p>
              </Card>
            </Reveal>
          </Container>
        </Section>

        {/* ============ CONSULTATION ============ */}
        <Section id="consult" className="border-t border-border bg-card-muted/50">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Get Started</Eyebrow>
              <SectionTitle className="mt-3">Request a publishing consultation</SectionTitle>
              <Lead className="mx-auto mt-4 max-w-lg">
                Tell us about your songs and where they&apos;re released. We&apos;ll review your
                catalog together and walk you through what administration could look like — no
                pressure, no obligation.
              </Lead>
            </Reveal>
            {/* Form stays outside Reveal/Stagger — arming remounts children. */}
            <div className="mx-auto mt-10 max-w-lg">
              <ConsultationForm />
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Or reach us directly at{" "}
              <a href="mailto:publishing@sourcemusicgrp.com" className="text-teal hover:underline">
                publishing@sourcemusicgrp.com
              </a>
            </p>
          </Container>
        </Section>

        {/* ============ SYNC & LICENSING ============ */}
        <Section id="sync" className="scroll-mt-20">
          <Container>
            <Reveal className="mx-auto max-w-2xl">
              <Card className="text-center">
                <Eyebrow>For Music Supervisors</Eyebrow>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Sync &amp; licensing inquiries
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Clearing a song for film, TV, ads, or games? Email us and we&apos;ll come back
                  with ownership, splits, and delivery details.
                </p>
                <p className="mt-4">
                  <a
                    href="mailto:publishing@sourcemusicgrp.com?subject=Sync%20inquiry%20—%20Source%20Publishing"
                    className="text-teal hover:underline"
                  >
                    publishing@sourcemusicgrp.com
                  </a>
                </p>
              </Card>
            </Reveal>
            {/* FUTURE writers/works surface (do not build yet): a /writers or /works page
                listing administered writers and sync-ready works once a real administered
                catalog exists. Shape when built: writer name, role, selected works, per-work
                clearance contact. Requires owner-verified catalog data. */}
          </Container>
        </Section>

        <Section className="pt-0">
          <CrossPromo
            title="Want to audit what your catalog earned?"
            body="Source Royalty is the intelligence layer of the ecosystem — it audits statements and metadata to flag potential royalty gaps worth investigating."
            cta="Explore Source Royalty"
            href={SITES.royalty.url}
          />
        </Section>
      </main>
      <Footer contactEmail="publishing@sourcemusicgrp.com" />
    </>
  );
}
