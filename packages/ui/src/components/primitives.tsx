import type { ElementType, ReactNode } from "react";
import { cn } from "../lib/cn";

/** Page container — consistent max width + gutters everywhere. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[var(--container-page)] px-6 lg:px-8", className)}>{children}</div>;
}

/** Vertical rhythm for page sections. */
export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", className)}>
      {children}
    </section>
  );
}

/** Small pixel-font label above section titles — legacy .eyebrow. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "font-pixel text-[0.62rem] uppercase leading-relaxed tracking-[0.18em] text-magenta-text",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-card-muted px-3.5 py-1.5 font-pixel text-[0.55rem] uppercase tracking-[0.12em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Section heading with strong hierarchy. */
export function SectionTitle({
  as: Tag = "h2",
  children,
  className,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Tag className={cn("text-balance text-3xl font-semibold tracking-tight sm:text-4xl", className)}>{children}</Tag>
  );
}

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-pretty text-lg leading-relaxed text-muted-foreground", className)}>{children}</p>;
}

/** The SOURCE wordmark — pixel-font, legacy .nav__brand-text. Optional sub-label + logo. */
export function Wordmark({
  sub,
  logoSrc,
  className,
}: {
  sub?: string;
  logoSrc?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap", className)}>
      {logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoSrc} alt="" className="h-14 w-14 shrink-0 object-contain" width={56} height={56} />
      ) : null}
      <span className="inline-flex flex-col leading-none">
        <span className="font-pixel text-[0.8rem] uppercase tracking-[0.08em] text-gold">Source</span>
        {sub ? (
          <span className="mt-1 whitespace-nowrap font-pixel text-[0.45rem] uppercase tracking-[0.14em] text-magenta-text">{sub}</span>
        ) : null}
      </span>
    </span>
  );
}
