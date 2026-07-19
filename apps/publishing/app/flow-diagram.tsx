import { ArrowDown, ArrowRight } from "lucide-react";

/* Stateless editorial diagram of how publishing royalties flow — original
   layout in the Source brand. The figure carries a full text alternative via
   aria-label; role="img" marks the internals as presentational. Safe inside
   Reveal because it holds no state.

   Documented decision: the example-statement motif from the concept round was
   skipped — the three-column flow reads faster and avoids implying real data. */

const collectors = [
  { label: "PROs", sub: "performance" },
  { label: "The MLC", sub: "mechanical" },
  { label: "Sync licensees", sub: "placements" },
];

function EndNode({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex min-w-40 flex-col items-center justify-center rounded-[var(--radius-xl)] border border-teal/40 bg-card px-6 py-5 text-center">
      <span className="font-mono text-xs uppercase tracking-wide text-foreground">{label}</span>
      <span className="mt-1.5 text-xs text-subtle">{sub}</span>
    </div>
  );
}

export function FlowDiagram() {
  return (
    <figure
      role="img"
      aria-label="How publishing royalties flow: your song is registered with performance societies, mechanical collectors, and sync licensees; the royalties they pay are collected, accounted, and passed through to you."
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
        <EndNode label="Your Song" sub="composition + splits" />

        <ArrowRight aria-hidden className="hidden h-5 w-5 shrink-0 text-subtle sm:block" />
        <ArrowDown aria-hidden className="h-5 w-5 shrink-0 text-subtle sm:hidden" />

        <div className="flex w-full max-w-56 flex-col gap-2 sm:w-auto">
          {collectors.map((item) => (
            <div
              key={item.label}
              className="flex items-baseline justify-between gap-3 rounded-[var(--radius-card)] border border-border bg-card px-4 py-3"
            >
              <span className="font-mono text-xs uppercase tracking-wide text-foreground">
                {item.label}
              </span>
              <span className="text-xs text-subtle">{item.sub}</span>
            </div>
          ))}
        </div>

        <ArrowRight aria-hidden className="hidden h-5 w-5 shrink-0 text-subtle sm:block" />
        <ArrowDown aria-hidden className="h-5 w-5 shrink-0 text-subtle sm:hidden" />

        <EndNode label="You" sub="statements + payment" />
      </div>
      <figcaption className="mt-4 text-center text-sm text-subtle">
        Simplified — each stream has its own societies, timelines, and paperwork. That&apos;s the
        part we handle.
      </figcaption>
    </figure>
  );
}
