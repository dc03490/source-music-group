import type { Metadata } from "next";
import {
  Container,
  EcosystemNav,
  Eyebrow,
  Footer,
  Lead,
  Section,
  SectionTitle,
  SkipLink,
} from "@source/ui";
import { EarlyAccessForm } from "../early-access-form";
import { LOCAL_LINKS } from "../local-links";

export const metadata: Metadata = {
  title: "Join Early Access — Source Royalty",
  description:
    "Join the Source Royalty early-access list and be first in line for a free catalog audit when the platform launches.",
  alternates: { canonical: "/early-access" },
};

export default function EarlyAccessPage() {
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
          <Container className="max-w-2xl text-center">
            <Eyebrow>Launching Soon</Eyebrow>
            <SectionTitle as="h1" className="mt-3">
              Be first in line for your free audit.
            </SectionTitle>
            <Lead className="mx-auto mt-4 max-w-lg">
              Source Royalty is in active development. Join the early-access list and we&apos;ll
              open your audit the moment it&apos;s ready — your first full catalog audit is free at
              launch.
            </Lead>
            {/* Form stays outside Reveal/Stagger — arming remounts children. */}
            <div className="mx-auto mt-10 max-w-md">
              <EarlyAccessForm />
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
