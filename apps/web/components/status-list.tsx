import { Card, cn } from "@source/ui";

/* Honest, current-state status board — no invented traction. Update rows as
   the companies evolve. */
const STATUS = [
  { label: "Source Music Group — operating · artist roster: Duka", dot: "bg-gold" },
  { label: "Source Publishing — accepting administration inquiries", dot: "bg-teal" },
  { label: "Source Royalty — in development · early access open", dot: "bg-blue" },
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
