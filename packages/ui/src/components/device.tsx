import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/* Original device mockups (pure CSS/SVG — no licensed assets).
   PhoneFrame/BrowserFrame wrap the same AppScreen content to tell the
   "works on any device" story. */

/** Current-gen iPhone-style frame: Dynamic Island, flat titanium edges,
    Action button + volume (left), power + Camera Control (right).
    Children render as the screen. */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative mx-auto w-[290px]", className)}>
      {/* left side: Action button, volume up/down */}
      <span aria-hidden className="absolute -left-[3px] top-[88px] h-6 w-[3px] rounded-l-md bg-[#3a3a41]" />
      <span aria-hidden className="absolute -left-[3px] top-[128px] h-10 w-[3px] rounded-l-md bg-[#3a3a41]" />
      <span aria-hidden className="absolute -left-[3px] top-[176px] h-10 w-[3px] rounded-l-md bg-[#3a3a41]" />
      {/* right side: power, Camera Control */}
      <span aria-hidden className="absolute -right-[3px] top-[140px] h-16 w-[3px] rounded-r-md bg-[#3a3a41]" />
      <span aria-hidden className="absolute -right-[2px] top-[248px] h-9 w-[2px] rounded-r-md bg-[#2f2f36]" />
      {/* flat titanium band */}
      <div className="relative rounded-[3rem] bg-gradient-to-b from-[#4a4a52] via-[#2c2c33] to-[#3d3d45] p-[3px] shadow-[var(--shadow-card)]">
        {/* near-invisible inner bezel — edge-to-edge display */}
        <div className="rounded-[calc(3rem-3px)] bg-black p-[7px]">
          <div className="relative overflow-hidden rounded-[2.45rem] bg-background">
            {/* Dynamic Island */}
            <div
              aria-hidden
              className="absolute left-1/2 top-[10px] z-10 flex h-[26px] w-[92px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-2"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[#101014] ring-1 ring-[#1d1d24]" />
            </div>
            {children}
            {/* home indicator */}
            <div aria-hidden className="pointer-events-none absolute bottom-1.5 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-foreground/25" />
          </div>
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

export function ScreenHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between px-4 pb-3 pt-12">
      <span className="font-pixel text-[0.5rem] uppercase tracking-[0.1em] text-gold">{title}</span>
      <span aria-hidden className="h-6 w-6 rounded-full bg-gradient-to-br from-magenta/50 to-teal/50" />
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
          tone === "flag" && "text-magenta",
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

/** Smooth line chart (inline SVG, demo values) — trading-app style. */
export function MiniLine({
  values = [22, 28, 24, 34, 30, 42, 38, 52, 47, 61, 58, 72],
  stroke = "#1dd3b0",
  className,
}: {
  values?: number[];
  stroke?: string;
  className?: string;
}) {
  const W = 240;
  const H = 72;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * W},${H - 6 - ((v - min) / (max - min)) * (H - 14)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("h-[72px] w-full", className)} aria-hidden>
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={W} cy={H - 6 - ((values[values.length - 1]! - min) / (max - min)) * (H - 14)} r="3.5" fill={stroke} />
    </svg>
  );
}

/** Floating stat chip (Trade-style callout beside the phone). */
export function StatChip({ value, caption, className }: { value: string; caption: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-black/20 bg-[#0d0d11] px-4 py-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.55)]",
        className,
      )}
    >
      <div>
        <p className="font-mono text-lg font-bold leading-none text-foreground">{value}</p>
        <p className="mt-1.5 text-[0.65rem] text-muted-foreground">{caption}</p>
      </div>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-purple font-mono text-xs font-bold text-white">
        %
      </span>
    </div>
  );
}

/** Floating mini-chart chip (Trade-style ticker callout). */
export function SparkChip({
  label,
  delta,
  className,
}: {
  label: string;
  delta: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-black/20 bg-[#0d0d11] px-4 py-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.55)]",
        className,
      )}
    >
      <p className="font-mono text-[0.68rem] font-semibold text-foreground">{label}</p>
      <p className="mt-0.5 text-[0.62rem] text-teal">▲ {delta}</p>
      <MiniLine values={[30, 26, 34, 31, 40, 37, 48]} className="mt-1 h-8 w-24" />
    </div>
  );
}

/* ---------- Prebuilt demo screens ---------- */

/** Trading-style earnings screen: big figure, line chart, timeframe pills. */
export function ScreenEarnings() {
  return (
    <div className="pb-7">
      <ScreenHeader title="Source Royalty" />
      <p className="px-4 text-[0.62rem] uppercase tracking-wider text-subtle">Demo · Catalog earnings</p>
      <p className="px-4 pt-1 font-mono text-3xl font-bold text-foreground">$4,218</p>
      <p className="px-4 pt-0.5 text-[0.65rem] text-teal">▲ $460.14 unclaimed · past 5 years</p>
      <div className="px-4 pt-2">
        <MiniLine />
      </div>
      <div className="flex items-center gap-1.5 px-4 pt-3">
        {["1D", "1W", "1M", "6M", "1Y", "All"].map((t) => (
          <span
            key={t}
            className={cn(
              "rounded-full px-2.5 py-1 font-mono text-[0.58rem]",
              t === "1Y" ? "bg-purple text-white" : "text-subtle",
            )}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ScreenDashboard() {
  return (
    <div className="pb-7">
      <ScreenHeader title="Source Royalty" />
      <p className="px-4 text-[0.62rem] uppercase tracking-wider text-subtle">Demo · Owed to you</p>
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
    <div className="pb-7">
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
    <div className="pb-7">
      <ScreenHeader title="Recovered" />
      <p className="px-4 text-[0.62rem] uppercase tracking-wider text-subtle">Demo · This quarter</p>
      <p className="px-4 pt-1 font-mono text-2xl font-bold text-gold">+$1,371.09</p>
      <MiniBars values={[18, 26, 38, 47, 61, 78, 92]} accent="#e8a33d" />
      <StatRow label="MLC claim filed" value="Paid" tone="up" />
      <StatRow label="PRO re-registration" value="Paid" tone="up" />
      <StatRow label="DSP metadata fix" value="In review" />
    </div>
  );
}
