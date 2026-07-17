import type { Metadata } from "next";
import {
  ButtonLink,
  Container,
  EcosystemNav,
  Eyebrow,
  Footer,
  Lead,
  Section,
  SectionTitle,
  SkipLink,
  SITES,
} from "@source/ui";
import { StatusList } from "../../components/status-list";

export const metadata: Metadata = {
  title: "About — Source",
  description:
    "Source is an early-stage music rights & music technology company: a record label, a publishing administrator, and a royalty-intelligence platform, built as one system.",
  alternates: { canonical: "/about" },
};

/* Vision-only page by design: no invented leadership bios, partners, or
   testimonials. Add real people and milestones as they become public. */

const beliefs = [
  {
    h: "A song outlives its release cycle.",
    p: "Most of the industry is organized around the moment a song comes out. The rights, registrations, and royalties live on for decades — and that long tail is where creators lose the most value. Source is built around the whole life of the song.",
  },
  {
    h: "Three problems, three companies, one system.",
    p: "Releasing music, administering compositions, and understanding royalty data are different disciplines, so each gets its own company — Source Music Group, Source Publishing, and Source Royalty. They share one design system, one data philosophy, and one owner, so nothing falls between them.",
  },
  {
    h: "Trust is earned with plain language.",
    p: "We don't promise recovered money before data has been analyzed, and we don't dress up placeholders as traction. What we publish is what is true today — and the sites grow as the companies do.",
  },
];

export default function AboutPage() {
  return (
    <>
      <SkipLink />
      <EcosystemNav cta={{ label: "Explore the companies", href: "/#companies" }} />
      <main id="main">
        <Section className="pt-20 sm:pt-24">
          <Container className="max-w-2xl">
            <Eyebrow>About Source</Eyebrow>
            <SectionTitle as="h1" className="mt-3">
              Built for the life of a song.
            </SectionTitle>
            <Lead className="mt-6">
              Source is an early-stage, founder-led music rights and music technology company. We
              are building three connected companies — a record label, a publishing administrator,
              and a royalty-intelligence platform — so that the people who make music can own,
              understand, and collect on their work at every stage.
            </Lead>
          </Container>
        </Section>

        <Section className="border-t border-border bg-card-muted/50">
          <Container className="max-w-2xl">
            <h2 className="sr-only">What we believe</h2>
            <div className="space-y-10">
              {beliefs.map((b) => (
                <div key={b.h}>
                  <h3 className="text-xl font-semibold tracking-tight">{b.h}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{b.p}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        <Section>
          <Container className="max-w-2xl">
            <h2 className="text-xl font-semibold tracking-tight">Where things stand</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              We are building in the open. This is the honest, current state of the ecosystem —
              updated as it changes:
            </p>
            <StatusList className="mt-6" />
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Contact the team</ButtonLink>
              <ButtonLink href={`${SITES.source.url}/#companies`} variant="secondary">
                Explore the companies
              </ButtonLink>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
