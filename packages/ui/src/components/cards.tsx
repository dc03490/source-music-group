import type { ComponentType, ReactNode } from "react";
import { ArrowRight, type LucideProps } from "lucide-react";
import { cn } from "../lib/cn";

/** Base surface card. */
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Large routing card for the parent landing (Royalty / Publishing / Music Group). */
/* Accent bars echo the legacy .switch-card::before gradients:
   gold→magenta (label), teal→blue (publishing), blue→purple (royalty). */
const ACCENTS = {
  gold: { bar: "bg-gradient-to-r from-gold to-magenta", icon: "text-gold" },
  teal: { bar: "bg-gradient-to-r from-teal to-blue", icon: "text-teal" },
  blue: { bar: "bg-gradient-to-r from-blue to-purple", icon: "text-blue" },
} as const;

export type CardAccent = keyof typeof ACCENTS;

export function EcosystemCard({
  eyebrow,
  title,
  lines,
  cta,
  href,
  icon: Icon,
  accent = "gold",
}: {
  eyebrow: string;
  title: string;
  lines: string[];
  cta: string;
  href: string;
  icon: ComponentType<LucideProps>;
  accent?: CardAccent;
}) {
  return (
    <a
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card p-8 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-subtle hover:shadow-[var(--shadow-card)]"
    >
      <span aria-hidden className={cn("absolute inset-x-0 top-0 h-[3px] opacity-90", ACCENTS[accent].bar)} />
      <span
        className={cn(
          "mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card-muted",
          ACCENTS[accent].icon,
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>

      <span className="font-pixel text-[0.55rem] uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</span>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">{title}</h3>

      <div className="mt-3 space-y-1">
        {lines.map((l) => (
          <p key={l} className="text-[15px] leading-relaxed text-muted-foreground">
            {l}
          </p>
        ))}
      </div>

      <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-gold-2">
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
      </span>
    </a>
  );
}

/** Compact feature card with an icon (Why Source / features grids). */
export function FeatureCard({
  title,
  children,
  icon: Icon,
  accent = "gold",
}: {
  title: string;
  children: ReactNode;
  icon: ComponentType<LucideProps>;
  accent?: CardAccent;
}) {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
      <span aria-hidden className={cn("absolute inset-x-0 top-0 h-[3px] opacity-85", ACCENTS[accent].bar)} />
      <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted", ACCENTS[accent].icon)}>
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <h3 className="mt-4 text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

export function PricingCard({
  name,
  tag,
  price,
  period,
  blurb,
  features,
  cta,
  href,
  highlighted = false,
}: {
  name: string;
  /** Small honesty pill beside the plan name (e.g. "At launch" for planned pricing). */
  tag?: string;
  price: string;
  period?: string;
  blurb: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-[var(--radius-xl)] border bg-card p-7",
        highlighted ? "border-gold shadow-[0_0_40px_-12px_rgba(232,163,61,0.45)]" : "border-border",
      )}
    >
      {highlighted ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-gold bg-background px-3 py-1 font-pixel text-[0.5rem] uppercase tracking-[0.12em] text-gold">
          Popular
        </span>
      ) : null}
      <span className="flex items-center gap-2">
        <span className="font-pixel text-[0.55rem] uppercase tracking-[0.14em] text-muted-foreground">{name}</span>
        {tag ? (
          <span className="rounded-full border border-border px-2 py-0.5 font-pixel text-[0.62rem] uppercase tracking-[0.12em] text-subtle">
            {tag}
          </span>
        ) : null}
      </span>
      <p className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-semibold tracking-tight">{price}</span>
        {period ? <span className="text-sm text-muted-foreground">{period}</span> : null}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{blurb}</p>
      <ul className="mt-6 flex-1 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
            {f}
          </li>
        ))}
      </ul>
      <a
        href={href}
        className={cn(
          "mt-7 inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition-all",
          highlighted
            ? "bg-brand text-brand-foreground hover:bg-gold-2"
            : "border border-border bg-card text-foreground hover:bg-muted",
        )}
      >
        {cta}
      </a>
    </div>
  );
}

export function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <figure className="flex h-full flex-col rounded-[var(--radius-xl)] border border-border bg-card p-6">
      <blockquote className="flex-1 text-[15px] leading-relaxed text-foreground/90">“{quote}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="h-9 w-9 rounded-full bg-gradient-to-br from-magenta/40 to-teal/40" aria-hidden />
        <span className="text-sm">
          <span className="block font-medium text-foreground">{name}</span>
          <span className="block text-muted-foreground">{role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
