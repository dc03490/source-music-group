"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { track } from "@vercel/analytics";
import { ButtonLink, cn, SITES } from "@source/ui";

/* Two-question router: pure client state, native radios for full keyboard
   and screen-reader support. No data leaves the page. */

const MAKE_OPTIONS = [
  { value: "songwriter", label: "Songs I write", phrase: "a songwriter" },
  { value: "artist", label: "Music I record & release", phrase: "an artist" },
  { value: "producer", label: "Productions & beats", phrase: "a producer" },
  { value: "manager", label: "Artists or catalogs I manage", phrase: "a manager or catalog owner" },
] as const;

const NEED_OPTIONS = [
  { value: "release", label: "Release & career support" },
  { value: "admin", label: "Registration & administration" },
  { value: "royalty", label: "Royalty visibility & data" },
  { value: "partnership", label: "A partnership conversation" },
] as const;

type MakeValue = (typeof MAKE_OPTIONS)[number]["value"];
type NeedValue = (typeof NEED_OPTIONS)[number]["value"];

/* Static accent class map so Tailwind sees every class. */
const RESULTS: Record<
  NeedValue,
  {
    name: string;
    href: string;
    cta: string;
    bar: string;
    /** Analytics id for ecosystem_company_selected (source: selector). */
    company: string;
    phrase: (make: string) => string;
  }
> = {
  release: {
    name: SITES.label.name,
    href: SITES.label.url,
    company: "label",
    cta: "Go to Source Music Group",
    bar: "bg-gradient-to-r from-gold to-magenta",
    phrase: (make) => `As ${make} looking for release and career support, start with ${SITES.label.name}.`,
  },
  admin: {
    name: SITES.publishing.name,
    href: SITES.publishing.url,
    company: "publishing",
    cta: "Go to Source Publishing",
    bar: "bg-gradient-to-r from-teal to-blue",
    phrase: (make) => `As ${make} needing administration, start with ${SITES.publishing.name}.`,
  },
  royalty: {
    name: SITES.royalty.name,
    href: SITES.royalty.url,
    company: "royalty",
    cta: "Go to Source Royalty",
    bar: "bg-gradient-to-r from-blue to-purple",
    phrase: (make) => `As ${make} who wants royalty visibility, start with ${SITES.royalty.name}: early access is open.`,
  },
  partnership: {
    name: "the Source team",
    href: "/contact",
    company: "source",
    cta: "Contact the team",
    bar: "bg-gradient-to-r from-gold to-magenta",
    phrase: (make) => `As ${make} exploring a partnership, talk directly to the Source team.`,
  },
};

const chipClasses = cn(
  "inline-flex min-h-11 cursor-pointer select-none items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors",
  "hover:border-subtle hover:text-foreground",
  "peer-checked:border-gold peer-checked:bg-muted peer-checked:text-foreground",
  "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
);

function ChipGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly { value: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-foreground">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value}>
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="peer sr-only"
            />
            <span className={chipClasses}>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CompanySelector() {
  const [make, setMake] = useState<MakeValue | null>(null);
  const [need, setNeed] = useState<NeedValue | null>(null);

  const result = make && need ? RESULTS[need] : null;
  const makePhrase = make ? MAKE_OPTIONS.find((o) => o.value === make)!.phrase : "";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-8">
        <ChipGroup
          legend="What do you make or manage?"
          name="selector-make"
          options={MAKE_OPTIONS}
          value={make}
          onChange={setMake}
        />
        <ChipGroup
          legend="What do you need right now?"
          name="selector-need"
          options={NEED_OPTIONS}
          value={need}
          onChange={setNeed}
        />
      </div>

      {/* Result announced to assistive tech once both questions are answered. */}
      <div aria-live="polite" className="mt-10">
        {result ? (
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <span aria-hidden className={cn("absolute inset-x-0 top-0 h-[3px] opacity-90", result.bar)} />
            <p className="text-base leading-relaxed text-foreground">{result.phrase(makePhrase)}</p>
            <div className="mt-5">
              <ButtonLink
                href={result.href}
                size="md"
                onClick={() =>
                  track("ecosystem_company_selected", {
                    site: "web",
                    company: result.company,
                    source: "selector",
                    href: result.href,
                  })
                }
              >
                {result.cta}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </ButtonLink>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
