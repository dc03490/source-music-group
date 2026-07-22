import { ArrowRight } from "lucide-react";
import { cn, SITES } from "@source/ui";

/* Static accent class map so Tailwind sees every class. Routes follow the
   cross-company journeys: artists → label; songwriters/producers →
   publishing; managers/labels/catalog owners → royalty. */
const AUDIENCES = [
  {
    role: "Artist",
    line: `Start with ${SITES.label.name}: release and career support.`,
    href: SITES.label.url,
    dot: "bg-gold",
  },
  {
    role: "Songwriter",
    line: `Start with ${SITES.publishing.name}: registration and administration for your songs.`,
    href: SITES.publishing.url,
    dot: "bg-teal",
  },
  {
    role: "Producer",
    line: `Start with ${SITES.publishing.name}: your composition interests, organized.`,
    href: SITES.publishing.url,
    dot: "bg-teal",
  },
  {
    role: "Manager",
    line: `Start with ${SITES.royalty.name}: royalty visibility across your roster.`,
    href: SITES.royalty.url,
    dot: "bg-blue",
  },
  {
    role: "Label",
    line: `Start with ${SITES.royalty.name}: catalog-wide royalty data in one place.`,
    href: SITES.royalty.url,
    dot: "bg-blue",
  },
  {
    role: "Catalog owner",
    line: `Start with ${SITES.royalty.name}: understand what your catalog earns.`,
    href: SITES.royalty.url,
    dot: "bg-blue",
  },
] as const;

/** Role-based routing grid: pick who you are, get pointed at the right
    Source company. */
export function AudienceGrid() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {AUDIENCES.map((a) => (
        <li key={a.role}>
          <a
            href={a.href}
            className="group flex min-h-11 h-full items-start justify-between gap-3 rounded-[var(--radius-xl)] border border-border bg-card p-4 transition-colors hover:border-subtle"
          >
            <span className="flex min-w-0 flex-col">
              <span className="flex items-center gap-2">
                <span aria-hidden className={cn("h-2 w-2 shrink-0 rounded-full", a.dot)} />
                <span className="text-sm font-semibold text-foreground">{a.role}</span>
              </span>
              <span className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a.line}</span>
            </span>
            <ArrowRight
              className="mt-0.5 h-4 w-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
