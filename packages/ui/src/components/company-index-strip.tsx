import { ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";
import { SITES } from "../content/ecosystem";

/* Static accent class map so Tailwind can see every class. */
const COMPANIES = [
  {
    site: SITES.royalty,
    descriptor: "Royalty intelligence — early access open",
    dot: "bg-blue",
  },
  {
    site: SITES.publishing,
    descriptor: "Publishing administration",
    dot: "bg-teal",
  },
  {
    site: SITES.label,
    descriptor: "Label & artist development",
    dot: "bg-gold",
  },
] as const;

/** Compact index of the three Source companies — the parent site's core
    routing element. Links go straight to each company's site. */
export function CompanyIndexStrip({ className }: { className?: string }) {
  return (
    <nav aria-label="Source companies" className={className}>
      <ul className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        {COMPANIES.map((c) => (
          <li key={c.site.key} className="sm:flex-1">
            <a
              href={c.site.url}
              className="group flex min-h-11 w-full items-center justify-between gap-3 rounded-[var(--radius-xl)] border border-border bg-card-muted/60 px-4 py-2.5 text-left transition-colors hover:border-subtle"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span aria-hidden className={cn("h-2 w-2 shrink-0 rounded-full", c.dot)} />
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-semibold text-foreground">{c.site.name}</span>
                  <span className="text-xs text-muted-foreground">{c.descriptor}</span>
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
