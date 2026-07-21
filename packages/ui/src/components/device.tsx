import type { ComponentType, ReactNode } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  Disc3,
  FileCheck,
  FileSearch,
  Film,
  Gauge,
  HandCoins,
  Home,
  LayoutDashboard,
  MoreHorizontal,
  Radar,
  Radio,
  RefreshCw,
  ShieldCheck,
  User,
  type LucideProps,
} from "lucide-react";
import { cn } from "../lib/cn";

/* Original device mockups (pure CSS/SVG — no licensed assets).
   PhoneFrame/BrowserFrame wrap the same AppScreen content to tell the
   "works on any device" story. Structural language borrowed from two
   reference layouts (a fitness-app phone UI and a crypto-dashboard desktop
   UI) — shapes and density only, no copied assets, copy, or branding. */

type Tone = "blue" | "purple" | "teal" | "gold" | "magenta";

const TONE_BG: Record<Tone, string> = {
  blue: "bg-blue/15 text-blue",
  purple: "bg-purple/15 text-violet",
  teal: "bg-teal/15 text-teal",
  gold: "bg-gold/15 text-gold",
  magenta: "bg-magenta/15 text-magenta-text",
};

/** Phone bezel with notch + side buttons. Children render as the screen.
    Pass `tabBar` to render a bottom tab bar under the screen content. */
export function PhoneFrame({
  children,
  className,
  tabBar,
}: {
  children: ReactNode;
  className?: string;
  tabBar?: ReactNode;
}) {
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
          {tabBar}
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
      <span className="font-pixel text-[0.62rem] uppercase tracking-[0.1em] text-gold">{title}</span>
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

/** Mini line/sparkline chart (inline SVG, demo values). */
export function MiniLine({
  values = [22, 34, 28, 46, 40, 58, 52, 68],
  stroke = "#1dd3b0",
  className,
}: {
  values?: number[];
  stroke?: string;
  className?: string;
}) {
  const W = 220;
  const H = 56;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = W / (values.length - 1);
  const points = values.map((v, i) => `${i * step},${H - ((v - min) / range) * (H - 8) - 4}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("h-14 w-full", className)} aria-hidden>
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Catalog Health Score ring (SVG circle, demo score). Pass `gradient` for a
    tri-color stroke (used by the review "detail" screen). */
export function ScoreRing({ score = 72, size = 96, gradient = false }: { score?: number; size?: number; gradient?: boolean }) {
  const r = 40;
  const c = 2 * Math.PI * r;
  const filled = (score / 100) * c;
  return (
    <div className="relative mx-auto my-3" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
        {gradient ? (
          <defs>
            <linearGradient id="royaltyScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2e6bff" />
              <stop offset="50%" stopColor="#7b2ff7" />
              <stop offset="100%" stopColor="#e0218a" />
            </linearGradient>
          </defs>
        ) : null}
        <circle cx="50" cy="50" r={r} fill="none" stroke="#2a2a33" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={gradient ? "url(#royaltyScoreGradient)" : "#e8a33d"}
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

/** Icon-avatar stat tile — 2x2 grid item for the fitness-app-style home screen. */
export function StatTile({
  icon: Icon,
  value,
  label,
  tone = "blue",
}: {
  icon: ComponentType<LucideProps>;
  value: string;
  label: string;
  tone?: Tone;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card-muted p-3">
      <span className={cn("mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl", TONE_BG[tone])}>
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <p className="font-mono text-base font-bold text-foreground">{value}</p>
      <p className="text-[0.62rem] text-muted-foreground">{label}</p>
    </div>
  );
}

/** Small colored icon + label, for a row of quick actions. */
export function QuickAction({
  icon: Icon,
  label,
  tone = "blue",
}: {
  icon: ComponentType<LucideProps>;
  label: string;
  tone?: Tone;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-xl", TONE_BG[tone])}>
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <span className="text-[0.58rem] text-muted-foreground">{label}</span>
    </div>
  );
}

/** Icon-in-circle + title/subtitle + trailing chevron — a single feed/list row. */
export function ActivityRow({
  icon: Icon,
  title,
  subtitle,
  tone = "teal",
}: {
  icon: ComponentType<LucideProps>;
  title: string;
  subtitle: string;
  tone?: Tone;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border/60 px-4 py-2.5 last:border-b-0">
      <span className={cn("inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full", TONE_BG[tone])}>
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.72rem] font-medium text-foreground">{title}</span>
        <span className="block truncate text-[0.62rem] text-muted-foreground">{subtitle}</span>
      </span>
      <ChevronRight aria-hidden className="h-3.5 w-3.5 shrink-0 text-subtle" />
    </div>
  );
}

/** Card wrapper around a chart (title + badge header, day-label ticks below). */
export function ChartCard({ title, badge, children }: { title: string; badge?: string; children: ReactNode }) {
  return (
    <div className="mx-4 mb-3 rounded-2xl border border-border bg-card-muted p-3">
      <div className="flex items-center justify-between">
        <span className="text-[0.68rem] font-medium text-foreground">{title}</span>
        {badge ? (
          <span className="rounded-full bg-background px-2 py-0.5 font-mono text-[0.58rem] text-subtle">{badge}</span>
        ) : null}
      </div>
      <div className="mt-1">{children}</div>
      <div className="mt-1 flex justify-between px-0.5">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="font-mono text-[0.5rem] text-subtle">
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Full-screen gradient-ring "detail" view — score + next action + a pill CTA. */
export function RingDetailScreen({
  score = 72,
  subtitle = "Catalog Health",
  nextTitle = "Fix missing ISRC",
  nextSubtitle = "3 tracks affected",
  cta = "Review now",
}: {
  score?: number;
  subtitle?: string;
  nextTitle?: string;
  nextSubtitle?: string;
  cta?: string;
}) {
  return (
    <div className="px-4 pb-4">
      <ScoreRing score={score} size={148} gradient />
      <p className="-mt-2 mb-4 text-center text-[0.68rem] text-muted-foreground">{subtitle}</p>
      <div className="overflow-hidden rounded-2xl border border-border bg-card-muted">
        <ActivityRow icon={AlertTriangle} title={nextTitle} subtitle={nextSubtitle} tone="magenta" />
      </div>
      <div className="mt-4 flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-blue via-purple to-magenta text-sm font-medium text-white">
        {cta}
      </div>
    </div>
  );
}

const PHONE_TABS = [
  { key: "home", label: "Home", icon: Home },
  { key: "audit", label: "Audit", icon: Radar },
  { key: "claims", label: "Claims", icon: HandCoins },
  { key: "account", label: "Account", icon: User },
] as const;

type PhoneTabKey = (typeof PHONE_TABS)[number]["key"];

/** 4-item bottom tab bar for `PhoneFrame`. */
export function PhoneTabBar({ active = "home" }: { active?: PhoneTabKey }) {
  return (
    <div className="flex items-center justify-around border-t border-border/60 bg-card-muted px-2 py-2.5">
      {PHONE_TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <span key={tab.key} className="flex flex-col items-center gap-0.5">
            <tab.icon className={cn("h-4 w-4", isActive ? "text-gold" : "text-subtle")} strokeWidth={2} />
            <span className={cn("text-[0.52rem]", isActive ? "text-gold" : "text-subtle")}>{tab.label}</span>
          </span>
        );
      })}
    </div>
  );
}

/* ---------- Prebuilt demo screens (phone) ---------- */

export function ScreenHome() {
  return (
    <div className="pb-2">
      <ScreenHeader title="Source Royalty" />
      <div className="mx-4 mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-blue to-purple p-4">
        <p className="text-[0.62rem] uppercase tracking-wider text-white/70">Demo · This month</p>
        <p className="mt-1 font-mono text-2xl font-bold text-white">$4,218.66</p>
        <div className="mt-3 inline-flex items-center rounded-full bg-white/15 px-3 py-1.5 text-[0.68rem] font-medium text-white">
          View report
        </div>
      </div>
      <div className="mx-4 mb-4 flex items-center justify-between">
        <QuickAction icon={Radar} label="Scan" tone="blue" />
        <QuickAction icon={HandCoins} label="Claims" tone="gold" />
        <QuickAction icon={FileSearch} label="Statements" tone="teal" />
        <QuickAction icon={MoreHorizontal} label="More" tone="purple" />
      </div>
      <div className="mx-4 grid grid-cols-2 gap-2">
        <StatTile icon={Radio} value="$2,840" label="Streaming" tone="blue" />
        <StatTile icon={RefreshCw} value="$918" label="Mechanical" tone="teal" />
        <StatTile icon={AlertTriangle} value="$460" label="Unclaimed" tone="magenta" />
        <StatTile icon={Gauge} value="72" label="Health score" tone="gold" />
      </div>
    </div>
  );
}

export function ScreenActivity() {
  return (
    <div className="pb-2">
      <ScreenHeader title="Activity" />
      <ChartCard title="This week" badge="+18%">
        <MiniLine className="mx-0 w-full" />
      </ChartCard>
      <div className="mx-4 overflow-hidden rounded-2xl border border-border bg-card-muted">
        <ActivityRow icon={CheckCircle2} title="New match found" subtitle="Toxic — streaming royalty" tone="teal" />
        <ActivityRow icon={FileCheck} title="Statement processed" subtitle="Q2 distributor report" tone="blue" />
        <ActivityRow icon={ShieldCheck} title="Registration confirmed" subtitle="Min Type — MLC" tone="gold" />
      </div>
    </div>
  );
}

export function ScreenReview() {
  return (
    <div className="pb-2">
      <ScreenHeader title="Catalog Review" />
      <RingDetailScreen
        score={72}
        subtitle="Catalog Health"
        nextTitle="Fix missing ISRC"
        nextSubtitle="3 tracks affected"
        cta="Review now"
      />
    </div>
  );
}

export function ScreenCollect() {
  return (
    <div className="pb-2">
      <ScreenHeader title="Claim Tracker" />
      <ChartCard title="Resolved this quarter" badge="+$1,371">
        <MiniLine values={[18, 26, 38, 47, 61, 78, 92]} stroke="#e8a33d" className="mx-0 w-full" />
      </ChartCard>
      <div className="mx-4 overflow-hidden rounded-2xl border border-border bg-card-muted">
        <ActivityRow icon={CheckCircle2} title="MLC claim filed" subtitle="Resolved" tone="teal" />
        <ActivityRow icon={CheckCircle2} title="PRO re-registration" subtitle="Resolved" tone="teal" />
        <ActivityRow icon={Clock} title="DSP metadata fix" subtitle="In review" tone="gold" />
      </div>
    </div>
  );
}

/* ---------- Prebuilt demo screen (desktop) ---------- */

const SIDEBAR_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Catalog", icon: Disc3 },
  { label: "Claims", icon: HandCoins },
  { label: "Registrations", icon: FileCheck },
  { label: "Data sources", icon: Database },
  { label: "Reports", icon: BarChart3, beta: true },
] as const;

const SOURCE_CARDS = [
  { name: "Streaming", icon: Radio, value: "$2,840", delta: "+6.2%", stroke: "#2e6bff" },
  { name: "Mechanical", icon: RefreshCw, value: "$918", delta: "+2.4%", stroke: "#1dd3b0" },
  { name: "Sync", icon: Film, value: "$214", delta: "-1.1%", stroke: "#e0218a" },
] as const;

const CLAIM_METRICS = [
  { label: "Streaming", delta: "+6.2%" },
  { label: "Mechanical", delta: "+2.4%" },
  { label: "Sync", delta: "-1.1%" },
  { label: "Print", delta: "+0.8%" },
] as const;

/** Sidebar + top bar + source cards + claims panel — the crypto-dashboard-style
    desktop screen, rendered full width inside `BrowserFrame`. */
export function DesktopDashboard() {
  return (
    <div className="flex">
      <div className="hidden w-36 shrink-0 flex-col border-r border-border bg-card-muted/60 p-3 sm:flex">
        <div className="mb-4 flex items-center gap-2 px-1">
          <span aria-hidden className="h-2 w-2 rounded-full bg-gold" />
          <span className="font-pixel text-[0.5rem] uppercase tracking-[0.1em] text-gold">Royalty</span>
        </div>
        <nav className="flex-1 space-y-0.5">
          {SIDEBAR_ITEMS.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 text-[0.68rem]",
                "active" in item && item.active ? "bg-background text-foreground" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
              <span className="truncate">{item.label}</span>
              {"beta" in item && item.beta ? (
                <span className="ml-auto shrink-0 rounded-full bg-teal/20 px-1.5 py-0.5 text-[0.5rem] text-teal">Beta</span>
              ) : null}
            </div>
          ))}
        </nav>
        <div className="mt-3 rounded-xl border border-border bg-background p-2.5">
          <p className="text-[0.62rem] font-semibold text-foreground">Unlock Pro</p>
          <p className="mt-0.5 text-[0.58rem] text-muted-foreground">Roster-wide health scores</p>
          <div className="mt-2 rounded-full bg-gold px-2 py-1 text-center text-[0.6rem] font-medium text-[#1a1206]">
            Upgrade
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span aria-hidden className="h-6 w-6 rounded-full bg-gradient-to-br from-magenta/50 to-teal/50" />
            <span className="text-[0.7rem] font-medium text-foreground">Demo Account</span>
            <DemoChip />
          </div>
          <div className="rounded-full bg-brand px-3 py-1.5 text-[0.68rem] font-medium text-brand-foreground">
            Run Audit
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
          {SOURCE_CARDS.map((s) => (
            <div key={s.name} className="min-w-0 rounded-xl border border-border bg-card-muted p-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-background">
                  <s.icon className="h-3 w-3 text-muted-foreground" strokeWidth={2} aria-hidden />
                </span>
                <span className="truncate text-[0.62rem] text-muted-foreground">{s.name}</span>
              </div>
              <p className="mt-2 font-mono text-lg font-bold text-foreground">{s.value}</p>
              <MiniLine stroke={s.stroke} className="mt-1 h-8" />
              <span className={cn("mt-1 inline-block text-[0.6rem]", s.delta.startsWith("+") ? "text-teal" : "text-magenta-text")}>
                {s.delta}
              </span>
            </div>
          ))}
          <div className="min-w-0 rounded-xl border border-gold/40 bg-gradient-to-br from-gold/10 to-magenta/10 p-3">
            <p className="text-[0.68rem] font-semibold text-foreground">Metadata Health</p>
            <p className="mt-1 text-[0.6rem] text-muted-foreground">3 issues need review</p>
            <div className="mt-2 space-y-1">
              <div className="rounded-full bg-brand px-2 py-1 text-center text-[0.6rem] font-medium text-brand-foreground">
                View Report
              </div>
              <div className="rounded-full border border-border px-2 py-1 text-center text-[0.6rem] font-medium text-foreground">
                Connect a Source
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-border bg-card-muted p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.62rem] text-muted-foreground">Active Claims · Demo</p>
              <p className="font-mono text-xl font-bold text-foreground">$1,371.09</p>
            </div>
            <div className="flex gap-1.5">
              <span className="rounded-full border border-border px-2.5 py-1 text-[0.62rem] text-muted-foreground">Details</span>
              <span className="rounded-full bg-brand px-2.5 py-1 text-[0.62rem] font-medium text-brand-foreground">Dispute</span>
            </div>
            <div className="flex gap-1 rounded-full border border-border p-0.5">
              {["30d", "90d", "365d"].map((p, i) => (
                <span
                  key={p}
                  className={cn("rounded-full px-2 py-1 text-[0.58rem]", i === 1 ? "bg-background text-foreground" : "text-subtle")}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(90px,1fr))] gap-2">
            {CLAIM_METRICS.map((m) => (
              <div key={m.label} className="min-w-0">
                <p className="truncate text-[0.58rem] text-muted-foreground">{m.label}</p>
                <p className={cn("font-mono text-[0.72rem] font-semibold", m.delta.startsWith("+") ? "text-teal" : "text-magenta-text")}>
                  {m.delta}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
