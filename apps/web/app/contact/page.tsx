import type { Metadata } from "next";
import { ArrowRight, Disc3, Mail, Radar, ShieldCheck } from "lucide-react";
import {
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

export const metadata: Metadata = {
  title: "Contact — Source",
  description:
    "Reach the Source team: general questions and partnerships, publishing inquiries, music submissions, and Source Royalty early access.",
  alternates: { canonical: "/contact" },
};

const routes = [
  {
    icon: Mail,
    accent: "text-gold",
    title: "General & partnerships",
    body: "Business questions, press, distribution, sync, catalog, or technology partnerships.",
    cta: "hello@sourcemusicgrp.com",
    href: "mailto:hello@sourcemusicgrp.com",
  },
  {
    icon: ShieldCheck,
    accent: "text-teal",
    title: "Publishing inquiries",
    body: "Registration, administration, and royalty-collection support for your compositions.",
    cta: "Go to Source Publishing",
    href: SITES.publishing.url,
  },
  {
    icon: Disc3,
    accent: "text-gold",
    title: "Music submissions",
    body: "Artists and managers: submit music or start a conversation with the label.",
    cta: "Go to Source Music Group",
    href: SITES.label.url,
  },
  {
    icon: Radar,
    accent: "text-blue",
    title: "Royalty early access",
    body: "Join the early access list for the Source Royalty platform, now in development.",
    cta: "Go to Source Royalty",
    href: SITES.royalty.url,
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <SkipLink />
      <EcosystemNav
        logoSrc="/assets/logo.png"
        cta={{ label: "Explore the companies", href: "/#companies" }}
      />
      <main id="main">
        <Section className="pt-20 sm:pt-24">
          <Container className="max-w-3xl">
            <div className="max-w-2xl">
              <Eyebrow>Contact</Eyebrow>
              <SectionTitle as="h1" className="mt-3">
                Talk to the Source team.
              </SectionTitle>
              <Lead className="mt-6">
                Pick the route that fits — each company handles its own inquiries, so you reach the
                right people first.
              </Lead>
            </div>
            <ul className="mt-12 grid gap-5 sm:grid-cols-2">
              {routes.map((r) => (
                <li key={r.title}>
                  <a
                    href={r.href}
                    className="group flex h-full flex-col rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-colors hover:border-subtle"
                  >
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${r.accent}`}
                    >
                      <r.icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <h2 className="mt-4 text-base font-semibold tracking-tight">{r.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 break-all text-sm font-medium text-gold-2">
                      {r.cta}
                      <ArrowRight
                        className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                        strokeWidth={2}
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
