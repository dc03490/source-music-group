"use client";

import { useState } from "react";
import { cn, PhoneFrame, PhoneTabBar, ScreenActivity, ScreenCollect, ScreenReview } from "@source/ui";
import { ScanSearch, AlertTriangle, HandCoins } from "lucide-react";

const STEPS = [
  {
    title: "Scan your catalog",
    text: "Connect your releases and let the AI read every registration, split, and statement, in minutes, from your phone.",
    icon: ScanSearch,
    screen: <ScreenReview />,
    tab: "audit",
  },
  {
    title: "Spot potential gaps",
    text: "Metadata issues, unregistered works, unclaimed mechanicals: flagged and ranked by how much they're worth to you.",
    icon: AlertTriangle,
    screen: <ScreenActivity />,
    tab: "home",
  },
  {
    title: "Collect with confidence",
    text: "Guided fixes and claim tracking through resolution. Check the status from anywhere.",
    icon: HandCoins,
    screen: <ScreenCollect />,
    tab: "claims",
  },
] as const;

export function FeaturesWalkthrough() {
  const [active, setActive] = useState(0);
  const step = STEPS[active] ?? STEPS[0];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
      <div className="space-y-3">
        {STEPS.map((s, i) => {
          const selected = i === active;
          return (
            <button
              key={s.title}
              onClick={() => setActive(i)}
              aria-pressed={selected}
              className={cn(
                "block w-full rounded-[var(--radius-xl)] border p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "border-gold bg-card shadow-[0_0_30px_-12px_rgba(232,163,61,0.5)]"
                  : "border-border bg-card-muted hover:border-subtle",
              )}
            >
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-lg",
                    selected ? "bg-brand text-brand-foreground" : "bg-muted text-teal",
                  )}
                >
                  <s.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
                <span className="font-pixel text-[0.62rem] uppercase tracking-[0.1em] text-subtle">
                  Step {i + 1}
                </span>
              </span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </button>
          );
        })}
      </div>

      {/* Phone first on mobile so the screen being described is visible above the step list. */}
      <div className="order-first mx-auto lg:order-none">
        <PhoneFrame tabBar={<PhoneTabBar active={step.tab} />}>{step.screen}</PhoneFrame>
      </div>

      <p aria-live="polite" className="sr-only">
        Showing step {active + 1}: {step.title}
      </p>
    </div>
  );
}
