import {
  Badge,
  ButtonLink,
  Container,
  CrossPromo,
  EcosystemNav,
  Footer,
  Lead,
  Reveal,
  Section,
  SITES,
} from "@source/ui";
import { Radar } from "lucide-react";

export default function Home() {
  return (
    <>
      <EcosystemNav active="royalty" />
      <main>
        <Section className="relative overflow-hidden pb-20 pt-24 sm:pt-32">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[420px] max-w-3xl rounded-full bg-gradient-to-r from-brand/10 to-violet/10 blur-3xl"
          />
          <Container className="relative text-center">
            <Reveal>
              <Badge>
                <Radar className="h-3.5 w-3.5 text-brand" />
                Platform launching soon
              </Badge>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mx-auto mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                Know Where Every Dollar Comes From.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <Lead className="mx-auto mt-6 max-w-xl">
                Source Royalty uses AI to identify metadata issues, missing registrations, and
                potential royalty opportunities across your music catalog.
              </Lead>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink href="#" size="lg">
                  Start Free Audit
                </ButtonLink>
                <ButtonLink href="#" variant="secondary" size="lg">
                  See Demo
                </ButtonLink>
              </div>
            </Reveal>
          </Container>
        </Section>

        <Section className="pt-0">
          <CrossPromo
            title="Need publishing administration?"
            body="Source Publishing registers your works and collects every royalty, worldwide."
            cta="Visit Source Publishing"
            href={SITES.publishing.url}
          />
        </Section>
      </main>
      <Footer />
    </>
  );
}
