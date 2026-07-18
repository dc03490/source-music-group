import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/* Original device mockups (pure CSS/SVG — no licensed assets).
   PhoneFrame/BrowserFrame wrap the same AppScreen content to tell the
   "works on any device" story. */

/** Phone bezel with notch + side buttons. Children render as the screen. */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative mx-auto w-[290px]", className)}>
      {/* side buttons */}
      <span aria-hidden className="absolute -left-[3px] top-24 h-10 w-[3px] rounded-l bg-muted" />
      <span aria-hidden className="absolute -left-[3px] top-40 h-14 w-[3px] rounded-l bg-muted" />
      <span aria-hidden className="absolute -right-[3px] top-32 h-16 w-[3px] rounded-r bg-muted" />
      <div className="relative rounded-[2.6rem] border border-border bg-card-muted p-2.5 shadow-[var(--shadow-card)]">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-background">
          {/* notch */}
          <div aria-hidden className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-card-muted" />
          {children}
        </div>
      </div>
    </div>
  );
}

/** Minimal desktop browser chrome around the same screen content. */
export function BrowserFrame({
  url = "source-royalty.com",
  children,
  className,
}: {
  url?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card-muted shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-magenta/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-teal/70" />
        </span>
        <span className="flex-1 rounded-md border border-border bg-background px-3 py-1 text-center font-mono text-[0.68rem] text-subtle">
          {url}
        </span>
      </div>
      <div className="bg-background">{children}</div>
    </div>
  );
}

/* ---------- Mock app-screen kit (demo data, drawn with divs/SVG) ---------- */

/** Small "Demo" pill so mock screens are always labeled as demo data. */
export function DemoChip({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full border border-gold/60 bg-background px-2 py-0.5 font-pixel text-[0.62rem] uppercase tracking-[0.12em] text-gold",
        className,
      )}
    >
      Demo
    </span>
  );
}

export function ScreenHeader({ title, chip = true }: { title: string; chip?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 pb-3 pt-9">
      <span className="font-pixel text-[0.5rem] uppercase tracking-[0.1em] text-gold">{title}</span>
      <span className="flex items-center gap-2">
        {chip ? <DemoChip /> : null}
        <span aria-hidden className="h-6 w-6 rounded-full bg-gradient-to-br from-magenta/50 to-teal/50" />
      </span>
    </div>
  );
}

export function StatRow({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "up" | "flag" }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
      <span className="text-[0.7rem] text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-mono text-[0.72rem] font-semibold",
          tone === "up" && "text-teal",
          tone === "flag" && "text-magenta-text",
          tone === "default" && "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}

/** Mini bar chart (inline SVG, demo values). */
export function MiniBars({ values = [34, 58, 41, 72, 55, 88, 64], accent = "#1dd3b0" }: { values?: number[]; accent?: string }) {
  const W = 240;
  const H = 64;
  const bw = W / values.length - 6;
  const max = Math.max(...values);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-4 my-3 h-16 w-[calc(100%-2rem)]" aria-hidden>
      {values.map((v, i) => {
        const h = (v / max) * (H - 8);
        return (
          <rect
            key={i}
            x={i * (bw + 6)}
            y={H - h}
            width={bw}
            height={h}
            rx={3}
            fill={i === values.length - 2 ? accent : "#2a2a33"}
          />
        );
      })}
    </svg>
  );
}

/** Catalog Health Score ring (SVG circle, demo score). */
export function ScoreRing({ score = 72, size = 96 }: { score?: number; size?: number }) {
  const r = 40;
  const c = 2 * Math.PI * r;
  const filled = (score / 100) * c;
  return (
    <div className="relative mx-auto my-3" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={r} fill="none" stroke="#2a2a33" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#e8a33d"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${c - filled}`}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-mono text-lg font-bold text-foreground">
        {score}
      </span>
    </div>
  );
}

/* ---------- Prebuilt demo screens ---------- */

export function ScreenDashboard() {
  return (
    <div className="pb-4">
      <ScreenHeader title="Source Royalty" />
      <p className="px-4 text-[0.62rem] uppercase tracking-wider text-subtle">Demo · Example estimate</p>
      <p className="px-4 pt-1 font-mono text-2xl font-bold text-teal">$4,218.66</p>
      <MiniBars />
      <StatRow label="Streaming royalties" value="$2,840.12" tone="up" />
      <StatRow label="Mechanical (MLC)" value="$918.40" tone="up" />
      <StatRow label="Unclaimed — action" value="$460.14" tone="flag" />
    </div>
  );
}

export function ScreenScan() {
  return (
    <div className="pb-4">
      <ScreenHeader title="Catalog Scan" />
      <p className="px-4 text-[0.62rem] uppercase tracking-wider text-subtle">Demo · Health score</p>
      <ScoreRing score={72} />
      <StatRow label="Tracks scanned" value="148" />
      <StatRow label="Metadata issues" value="23" tone="flag" />
      <StatRow label="Missing registrations" value="9" tone="flag" />
    </div>
  );
}

export function ScreenCollect() {
  return (
    <div className="pb-4">
      <ScreenHeader title="Claim Tracker" />
      <p className="px-4 text-[0.62rem] uppercase tracking-wider text-subtle">Example · Resolved claims</p>
      <p className="px-4 pt-1 font-mono text-2xl font-bold text-gold">+$1,371.09</p>
      <MiniBars values={[18, 26, 38, 47, 61, 78, 92]} accent="#e8a33d" />
      <StatRow label="MLC claim filed" value="Resolved" tone="up" />
      <StatRow label="PRO re-registration" value="Resolved" tone="up" />
      <StatRow label="DSP metadata fix" value="In review" />
    </div>
  );
}
