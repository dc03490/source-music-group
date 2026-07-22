import type { Metadata } from "next";
import { Container, EcosystemNav, Footer, Lead, Section, SectionTitle, SkipLink } from "@source/ui";

/* NOTE FOR COUNSEL REVIEW: this is an interim, plain-language terms-of-use
   page for informational marketing sites. It must be reviewed and replaced
   with full terms by qualified counsel before any product, account, or
   payment functionality launches. */

export const metadata: Metadata = {
  title: "Terms of Use | Source",
  description: "The terms that apply to using the Source websites.",
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    h: "What these sites are",
    p: "The Source websites describe Source and its companies: Source Music Group, Source Publishing, and Source Royalty. They are informational. Nothing on these sites is a contract offer, legal advice, financial advice, or a guarantee of any service outcome, including royalty recovery.",
  },
  {
    h: "Early-stage services",
    p: "Some Source products, including Source Royalty, are in development. Descriptions of in-development products explain what we are building, not what is available today. Joining an early-access list does not create an account or a service relationship.",
  },
  {
    h: "Your submissions",
    p: "If you contact us or submit music, catalog details, or business information, you confirm you have the right to share it. Submitting material does not obligate Source to respond, enter an agreement, or provide services, and does not transfer any rights in your work to Source.",
  },
  {
    h: "Our content",
    p: "The Source names, wordmarks, and site content belong to Source or its licensors. Please do not copy or reuse them without permission.",
  },
  {
    h: "Changes",
    p: "We may update these terms as the sites and products evolve. The effective date above reflects the latest version, and material changes will be visible on this page.",
  },
];

export default function TermsPage() {
  return (
    <>
      <SkipLink />
      <EcosystemNav
        logoSrc="/assets/logo.png"
        cta={{ label: "Explore the companies", href: "/#companies" }}
      />
      <main id="main">
        <Section className="pt-20 sm:pt-24">
          <Container className="max-w-2xl">
            <SectionTitle as="h1">Terms of Use</SectionTitle>
            <p className="mt-3 font-mono text-sm text-subtle">Effective July 17, 2026</p>
            <Lead className="mt-6">
              Short, plain-language interim terms for the Source websites. They will be expanded
              and reviewed by counsel as products launch.
            </Lead>
            <div className="mt-10 space-y-8">
              {sections.map((s) => (
                <div key={s.h}>
                  <h2 className="text-lg font-semibold tracking-tight">{s.h}</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{s.p}</p>
                </div>
              ))}
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Contact</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Questions about these terms:{" "}
                  <a
                    href="mailto:hello@sourcemusicgrp.com"
                    className="text-gold-2 underline-offset-4 hover:underline"
                  >
                    hello@sourcemusicgrp.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
