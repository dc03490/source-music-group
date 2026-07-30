# 0001 — Build the product as a separate app, not an extension of the marketing site

- **Status:** Accepted
- **Date:** 2026-07-21

## Context

The repo contains four Next.js marketing sites (`apps/web`, `apps/royalty`, `apps/publishing`,
`apps/label`) sharing a design system (`packages/ui`). They are public, statically rendered,
search-indexed, analytics-instrumented, and deployed to Vercel.

`apps/royalty` already markets a "dashboard" — but it is static JSX with hardcoded demo figures
in `packages/ui/src/components/device.tsx`. There is no product behind it.

The obvious-looking move is to add authenticated routes to `apps/royalty`, since the marketing
and the product describe the same thing.

## Decision

The product is a **new app**, `apps/console`, alongside the marketing sites. It reuses
`packages/ui` for design tokens and primitives. `apps/royalty` stays marketing-only and gains a
"Sign in" link.

The console is `noindex`, carries no marketing analytics, and is deployed separately.

## Consequences

**Buys:**

- One Next app cannot have two security postures. The console needs deny-by-default middleware,
  a strict CSP, and a VPC attachment; the marketing site needs none of those and would pay for
  them in complexity and cold-start latency.
- A product incident cannot take down the marketing funnel, and vice versa.
- The marketing site keeps its current trivial deploy story (static, Vercel, no secrets).
- The console can never accidentally render a `DemoChip` figure, because it does not import the
  mockup components.

**Costs:**

- Two apps to keep visually consistent. Mitigated by both consuming `packages/ui`, but drift is
  possible and will need periodic attention.
- Cross-app navigation needs a URL (`NEXT_PUBLIC_URL_CONSOLE`) rather than a relative link.
- Slightly more build and deploy surface.

## Alternatives considered

**Add authenticated routes to `apps/royalty`.** Rejected: forces one middleware, one CSP, one
bundle, and one blast radius across a public static site and a system handling financial PII.
The marketing site would also need to move off its current static deploy to reach a database.

**Put the console in a separate repository.** Rejected: duplicates the design system, the
tooling, and the TypeScript config for no security benefit that a separate app and separate
deploy do not already provide. Also loses the ability to change a shared component and its
consumers in one reviewable commit.
