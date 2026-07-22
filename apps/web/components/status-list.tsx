import { Card, cn } from "@source/ui";

/* Honest, current-state status board — no invented traction. REVIEW CADENCE:
   re-verify every row monthly and on any launch, signing, or pause — a stale
   status line is an unsupported claim. Last reviewed: July 19, 2026 — all
   three rows confirmed accurate (label operating with Duka on the roster;
   publishing accepting administration inquiries; royalty in development with
   early access open). */
const STATUS = [
  { label: "Source Music Group: operating · artist roster: Duka", dot: "bg-gold" },
  { label: "Source Publishing: accepting administration inquiries", dot: "bg-teal" },
  { label: "Source Royalty: in development · early access open", dot: "bg-blue" },
] as const;

/** Plain-facts ecosystem status list, styled like a terminal readout. */
export function StatusList({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <h3 className="font-pixel text-[0.55rem] uppercase tracking-[0.14em] text-subtle">
        Ecosystem status
      </h3>
      <ul className="mt-4 space-y-3">
        {STATUS.map((s) => (
          <li key={s.label} className="flex items-start gap-2.5 font-mono text-sm text-muted-foreground">
            <span aria-hidden className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", s.dot)} />
            {s.label}
          </li>
        ))}
      </ul>
    </Card>
  );
}
