import type { Metadata } from "next";
import { Container, EcosystemNav, Footer, Lead, Section, SectionTitle, SkipLink } from "@source/ui";
import { LOCAL_LINKS } from "../local-links";

/* NOTE FOR COUNSEL REVIEW: plain-language, interim submission terms for an
   early-stage label site. These are not a contract. Must be reviewed and
   approved by qualified counsel before being relied on — especially the
   unsolicited-materials / coincidental-similarity language. */

export const metadata: Metadata = {
  title: "Submission Terms | Source Music Group",
  description: "Plain-language ground rules for submitting music to Source Music Group.",
  alternates: { canonical: "/submission-terms" },
};

const sections = [
  {
    h: "What submitting means",
    p: "Sending us music (through the form or by email) is an invitation for us to listen, nothing more. It doesn't create a contract, a partnership, or any business relationship between us.",
  },
  {
    h: "No obligation to respond",
    p: "We're a small team and we review submissions in batches. We can't promise a reply, feedback, or a deal. If you don't hear from us, it only means we didn't find a fit right now.",
  },
  {
    h: "You keep your rights",
    p: "Submitting transfers nothing. Your recordings, your compositions, and everything else you send remain entirely yours.",
  },
  {
    h: "We don't use submissions without an agreement",
    p: "We will not release, license, sample, or otherwise commercially use anything you submit unless we've signed a written agreement with you first.",
  },
  {
    h: "Only submit what's yours",
    p: "Please only send music you have the right to share. If collaborators, producers, or co-writers are involved, make sure they're on board before you submit.",
  },
  {
    h: "Similar music exists",
    p: "We hear a lot of music, and independent creators land on similar ideas all the time. If something we release later resembles your submission by coincidence, that similarity alone doesn't mean your work was used.",
  },
];

export default function SubmissionTermsPage() {
  return (
    <>
      <SkipLink />
      <EcosystemNav
        active="label"
        sub="Music Group"
        logoSrc="/assets/logo.png"
        localLinks={LOCAL_LINKS}
        cta={{ label: "Submit Your Music", href: "/#submit" }}
      />
      <main id="main">
        <Section className="pt-20 sm:pt-24">
          <Container className="max-w-2xl">
            <SectionTitle as="h1">Submission Terms</SectionTitle>
            <p className="mt-3 font-mono text-sm text-subtle">Effective July 18, 2026</p>
            <Lead className="mt-6">
              Plain-language ground rules for sending us your music. No legalese, just what
              submitting does and doesn&apos;t mean.
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
                  Questions about these terms or a past submission:{" "}
                  <a
                    href="mailto:hello@sourcemusicgrp.com"
                    className="text-gold-2 underline-offset-4 hover:underline"
                  >
                    hello@sourcemusicgrp.com
                  </a>
                  .
                </p>
              </div>
              <p className="text-sm text-subtle">
                This page is a plain-language summary and may be updated as the label grows.
              </p>
            </div>
          </Container>
        </Section>
      </main>
      <Footer
        contactEmail="hello@sourcemusicgrp.com"
        extraLinks={[{ label: "Submission Terms", href: "/submission-terms" }]}
      />
    </>
  );
}
