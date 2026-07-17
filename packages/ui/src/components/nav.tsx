"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "../lib/cn";
import { NAV_LINKS, SIGN_IN_HREF, SITES, type SiteKey } from "../content/ecosystem";
import { ButtonLink } from "./button";
import { Wordmark } from "./primitives";

/** Shared ecosystem navigation. Pass `active` to highlight the current site. */
export function EcosystemNav({
  active,
  sub,
  logoSrc,
}: {
  active?: SiteKey;
  sub?: string;
  logoSrc?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-[var(--container-page)] items-center justify-between px-6 lg:px-8">
        <a href={SITES.source.url} aria-label="Source home">
          <Wordmark sub={sub} logoSrc={logoSrc} />
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = link.siteKey && link.siteKey === active;
            return (
              <a
                key={link.key}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
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
          <a href={SIGN_IN_HREF} className="px-3 text-sm font-medium text-muted-foreground hover:text-foreground">
            Sign In
          </a>
          <ButtonLink href={SITES.royalty.url} size="sm">
            Start Free Audit
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
              <a href={SIGN_IN_HREF} className="px-3 py-2 text-sm font-medium text-muted-foreground">
                Sign In
              </a>
              <ButtonLink href={SITES.royalty.url} size="sm">
                Start Free Audit
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
