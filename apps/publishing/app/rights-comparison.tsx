import { Stagger, StaggerItem } from "@source/ui";
import { Disc3, PenLine } from "lucide-react";

/* Stateless server-rendered comparison of master vs. publishing rights —
   the core educational distinction Source Publishing is required to teach.
   Safe inside Stagger/StaggerItem because it holds no state. */

const masterBullets = [
  "Owned by whoever owns the recording, usually the artist or label",
  "Earns from streams, downloads, and licensing of that recording",
  "Paid through distributors and labels",
];

const publishingBullets = [
  "Owned by the songwriters and their publisher",
  "Earns performance, mechanical, sync, and print royalties",
  "Paid through PROs, The MLC, and licensees",
];

export function RightsComparison() {
  return (
    <Stagger className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
      <StaggerItem>
        <div className="relative h-full overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card p-7">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-gold to-magenta opacity-85"
          />
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-gold">
            <Disc3 className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <p className="mt-5 font-pixel text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">
            The Recording
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">Master Rights</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            The master is the specific recorded performance: the track people actually stream.
          </p>
          <ul className="mt-4 space-y-2.5">
            {masterBullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-subtle">
            Not what we administer. For Source artists, that&apos;s Source Music Group.
          </p>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="relative h-full overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card p-7">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-teal to-blue opacity-85"
          />
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-teal">
            <PenLine className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <p className="mt-5 font-pixel text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">
            The Composition
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">Publishing Rights</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            The composition is the song itself: the lyrics, melody, and structure underneath any
            recording of it.
          </p>
          <ul className="mt-4 space-y-2.5">
            {publishingBullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm font-medium text-teal">
            This is the side Source Publishing administers.
          </p>
        </div>
      </StaggerItem>
    </Stagger>
  );
}
