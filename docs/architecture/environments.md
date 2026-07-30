# Environments

## Local development

Prerequisites: Node ≥ 18.18, and pnpm via corepack (the repo pins `pnpm@9.15.9`).

```bash
corepack pnpm install

corepack pnpm typecheck     # tsc across every workspace project
corepack pnpm lint          # eslint over the whole monorepo (single root config)
corepack pnpm test          # vitest — includes the compliance scan
```

Marketing sites (unchanged, no backend required):

```bash
corepack pnpm --filter @source/web dev         # :3000
corepack pnpm --filter @source/royalty dev     # :3001
corepack pnpm --filter @source/publishing dev  # :3002
corepack pnpm --filter @source/label dev       # :3003
```

> **Note on the repo path.** The directory name contains a double space
> (`Source  Music Group`). Quote it in every script and CI step. If a tool misbehaves in a way
> that smells like path parsing, this is the first thing to check.

### A recurring local failure worth knowing

If `typecheck` reports errors in files named like `.next/types/routes.d 2.ts` — note the space and
the `2` — that is a **stale Next.js build artifact**, not a real type error. It happens when
several app builds run in parallel and duplicate generated files. Fix:

```bash
rm -rf apps/*/.next && corepack pnpm typecheck
```

Similarly, if a dev server starts returning 500s with `Cannot find module './xxx.js'` or a CSS
404, clear that app's `.next` and restart. Confirm only one process is bound to the port:

```bash
lsof -ti :3001 | xargs kill -9
rm -rf apps/royalty/.next
```

## Console and AWS environments

Status: **not yet provisioned.** The console app and its infrastructure are being built; this
section records the intended shape so it is not re-invented.

| Environment | Purpose | Database | Notes |
| --- | --- | --- | --- |
| `dev` | Local development against real AWS data services | Shared dev Aurora cluster, schema per developer/PR | Aurora has no per-branch cloning, so isolation is by schema — see [ADR 0002](../adr/0002-aws-over-managed-vercel-backend.md) |
| `staging` | Deployed on merge to `ecosystem` | Own cluster, refreshed from production via Aurora fast clone | Full pipeline, real formats, synthetic or consented data only |
| `production` | Real user data | Own cluster, PITR enabled | Deploys gated by a GitHub Environment approval |

**Aurora is never publicly reachable** in any environment. Local development connects through the
same private path (via a bastion or SSM port forwarding), not by exposing the database.

### Configuration

- All secrets live in **AWS Secrets Manager / SSM Parameter Store**, never in `.env` files.
- The database has **no password**: access is via IAM database authentication.
- Env access is centralised and Zod-validated so a missing variable fails at startup rather than
  at first use.
- Marketing sites keep their existing `NEXT_PUBLIC_*` variables. Note that everything currently in
  the repo is `NEXT_PUBLIC_` (i.e. browser-visible) — the console introduces the first server-only
  secrets, so that boundary must be respected from the first commit.

### Cross-linking

`packages/ui/src/content/ecosystem.ts` resolves ecosystem URLs per environment. The console is
added as `NEXT_PUBLIC_URL_CONSOLE` and is **not** added to `NAV_LINKS` — it is an authenticated
destination, not a public marketing page.

## Deploys

| What | How |
| --- | --- |
| Marketing sites | Manual, via the `.vercel-links/<app>` → `.vercel` swap, then `vercel deploy --prod --yes`. Unchanged. |
| Console + infrastructure | GitHub Actions running SST, authenticated by OIDC. See [runbooks/deploy.md](../runbooks/deploy.md). |

Migrations are always a **separate, gated step** — never automatic on a schema holding financial
data. See [runbooks/migrations.md](../runbooks/migrations.md).

## Git

- Work on local `main`.
- Push with `git push origin main:ecosystem`.
- **Never push `origin/main`.** GitHub Pages serves the live legacy site from it until the domain
  cutover.
