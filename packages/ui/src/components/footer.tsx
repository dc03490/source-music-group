import { ArrowRight } from "lucide-react";
import { Container, Wordmark } from "./primitives";
import { SITES } from "../content/ecosystem";

/** Cross-promotion band — every site nudges toward the others. */
export function CrossPromo({
  title,
  body,
  cta,
  href,
}: {
  title: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <Container>
      <a
        href={href}
        className="group flex flex-col items-start justify-between gap-4 rounded-[var(--radius-2xl)] border border-border bg-card-muted p-8 transition-colors hover:border-foreground/15 sm:flex-row sm:items-center"
      >
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{body}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground">
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </a>
    </Container>
  );
}

const productLinks = [
  { label: "Source Royalty", href: SITES.royalty.url },
  { label: "Source Publishing", href: SITES.publishing.url },
  { label: "Source Music Group", href: SITES.label.url },
];

const companyLinks = [
  { label: "About", href: `${SITES.source.url}/about` },
  { label: "Contact", href: `${SITES.source.url}/contact` },
  { label: "Privacy", href: `${SITES.source.url}/privacy` },
  { label: "Terms", href: `${SITES.source.url}/terms` },
];

export function Footer({
  contactEmail,
  extraLinks,
}: {
  /** Site-specific contact address shown under the brand blurb. */
  contactEmail?: string;
  /** Site-specific links appended to the Company column (e.g. Data Policy). */
  extraLinks?: { label: string; href: string }[];
} = {}) {
  return (
    <footer className="border-t border-border bg-background">
      <Container>
        <div className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Wordmark />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The modern operating system for music rights — helping creators own, understand, and
              maximize the value of their work.
            </p>
            {contactEmail ? (
              <p className="mt-4 text-sm">
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {contactEmail}
                </a>
              </p>
            ) : null}
          </div>

          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">Ecosystem</h2>
            <ul className="mt-4 space-y-3">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">Company</h2>
            <ul className="mt-4 space-y-3">
              {[...companyLinks, ...(extraLinks ?? [])].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-border py-8 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Source. All rights reserved.
            </p>
            <p className="font-pixel text-[0.62rem] uppercase tracking-[0.14em] text-subtle">
              A Source Company
            </p>
          </div>
          <p className="text-sm text-subtle">Own your music. Own your royalties.</p>
        </div>
      </Container>
    </footer>
  );
}
