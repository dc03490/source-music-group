import type { Metadata } from "next";
import { Container, EcosystemNav, Footer, Lead, Section, SectionTitle, SkipLink } from "@source/ui";
import { LOCAL_LINKS } from "../local-links";

/* NOTE FOR COUNSEL REVIEW: this is an interim, plain-language, forward-looking
   data policy for a pre-launch marketing site that collects only early-access
   form submissions. It must be reviewed, expanded, and approved by qualified
   counsel before the platform handles any account, royalty, or catalog data. */

export const metadata: Metadata = {
  title: "Data Policy | Source Royalty",
  description: "How Source Royalty will handle your information and catalog data.",
  alternates: { canonical: "/data-policy" },
};

const sections = [
  {
    h: "What we collect",
    p: "Today, this site collects only what you submit through the early-access form: your name, email address, and the role you select. Catalog data (statements, registrations, splits) will only be collected at launch, and only what you explicitly authorize for your audit.",
  },
  {
    h: "How we'll use it",
    p: "Early-access details are used to confirm your spot and send launch updates. At launch, the catalog data you authorize will be used only to run your audit. We will not sell your information.",
  },
  {
    h: "How it will be protected",
    p: "Catalog data handled by the platform will be encrypted in transit and at rest. Protecting catalog data is a core design requirement, not an afterthought.",
  },
  {
    h: "Your control",
    p: "You can ask us what information we hold about you and request deletion at any time: of your early-access details now, and of your catalog data once the platform is live.",
  },
];

export default function DataPolicyPage() {
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
        <Section className="pt-20 sm:pt-24">
          <Container className="max-w-2xl">
            <SectionTitle as="h1">Data Policy</SectionTitle>
            <p className="mt-3 font-mono text-sm text-subtle">Effective July 18, 2026</p>
            <Lead className="mt-6">
              Early-access commitment: a full data policy will be published before the platform
              handles catalog data.
            </Lead>
            <div className="mt-10 space-y-8">
              {sections.map((s) => (
                <div key={s.h}>
                  <h2 className="text-lg font-semibold tracking-tight">{s.h}</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{s.p}</p>
                </div>
              ))}
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Questions</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Questions about this policy or your information:{" "}
                  <a
                    href="mailto:royalty@sourcemusicgrp.com"
                    className="text-gold-2 underline-offset-4 hover:underline"
                  >
                    royalty@sourcemusicgrp.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer
        contactEmail="royalty@sourcemusicgrp.com"
        extraLinks={[{ label: "Data Policy", href: "/data-policy" }]}
      />
    </>
  );
}
