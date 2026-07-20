"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "../lib/cn";
import { NAV_LINKS, SITES, type SiteKey } from "../content/ecosystem";
import { ButtonLink } from "./button";
import { Wordmark } from "./primitives";

/** Shared ecosystem navigation. Pass `active` to highlight the current site.
    `cta` overrides the header call-to-action per site. `localLinks` are
    site-local anchors rendered before the ecosystem links. */
export function EcosystemNav({
  active,
  sub,
  logoSrc,
  localLinks,
  cta = { label: "Explore the companies", href: `${SITES.source.url}#companies` },
}: {
  active?: SiteKey;
  sub?: string;
  logoSrc?: string;
  localLinks?: { label: string; href: string }[];
  cta?: { label: string; href: string };
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-[var(--container-page)] items-center justify-between px-6 lg:px-8">
        <a href={SITES.source.url} aria-label="Source home">
          <Wordmark sub={sub} logoSrc={logoSrc} />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {localLinks?.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-2 text-sm font-medium tracking-tight text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          {localLinks && localLinks.length > 0 ? (
            <span aria-hidden className="h-4 w-px bg-border" />
          ) : null}
          {NAV_LINKS.map((link) => {
            const isActive = link.siteKey && link.siteKey === active;
            return (
              <a
                key={link.key}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "py-2 text-sm font-medium tracking-tight transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                {isActive ? <span className="ml-1.5 inline-block h-1 w-1 rounded-full bg-brand align-middle" /> : null}
              </a>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink href={cta.href} size="sm">
            {cta.label}
          </ButtonLink>
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-1 px-6 py-4">
            {localLinks && localLinks.length > 0 ? (
              <div className="mb-2 border-b border-border pb-2">
                {localLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
            {NAV_LINKS.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-3">
              <ButtonLink href={cta.href} size="sm" onClick={() => setOpen(false)}>
                {cta.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
