import type { Metadata } from "next";
import { Container, EcosystemNav, Footer, Lead, Section, SectionTitle, SkipLink } from "@source/ui";

/* NOTE FOR COUNSEL REVIEW: this is an interim, plain-language privacy policy
   written for an early-stage marketing site that collects minimal data. It
   must be reviewed and expanded by qualified counsel before any product
   launch that collects account, royalty, or catalog data. */

export const metadata: Metadata = {
  title: "Privacy Policy — Source",
  description: "How the Source websites handle your information.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    h: "What we collect",
    p: "The Source websites are informational. We do not require accounts, and we do not collect personal information unless you choose to send it to us — for example, by emailing us or submitting a form on one of our company sites. If you do, we receive what you send (such as your name, email address, and message).",
  },
  {
    h: "How we use it",
    p: "We use the information you send us only to respond to you and to evaluate the inquiry you made — a partnership question, a publishing or music submission, or an early-access request. We do not sell your information.",
  },
  {
    h: "Cookies and analytics",
    p: "These sites do not currently run advertising trackers. If we add privacy-respecting analytics to understand site usage, we will update this policy to say what is collected and why.",
  },
  {
    h: "How long we keep it",
    p: "We keep correspondence for as long as it is relevant to the inquiry, and delete it on request where we are able to.",
  },
  {
    h: "Your choices",
    p: "You can ask us what information we hold about you, ask us to correct it, or ask us to delete it by emailing hello@sourcemusicgrp.com.",
  },
];

export default function PrivacyPage() {
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
            <SectionTitle as="h1">Privacy Policy</SectionTitle>
            <p className="mt-3 font-mono text-sm text-subtle">Effective July 17, 2026</p>
            <Lead className="mt-6">
              This is a short, plain-language interim policy. As Source products launch — including
              anything that handles account, royalty, or catalog data — this policy will be expanded
              and reviewed by counsel before those features go live.
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
                  Questions about this policy or your information:{" "}
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
