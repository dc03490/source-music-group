# Runbook: deploying

## Marketing sites (current, live)

The four marketing sites deploy **manually** from a local machine. There is no CI for them today.

Vercel project links are kept out of the way in `.vercel-links/<app>/`, because a repo cannot hold
four `.vercel` directories at once. Deploying means swapping the one you want into place:

```bash
cd "/path/to/Source  Music Group"

rm -rf .vercel
cp -r .vercel-links/<app> .vercel     # app = web | royalty | publishing | label
vercel deploy --prod --yes
rm -rf .vercel                        # always clean up
```

| `<app>` | Vercel project | Live URL |
| --- | --- | --- |
| `web` | `source-ecosystem` | `source-ecosystem.vercel.app` |
| `royalty` | `source-royalty-app` | `source-royalty-app.vercel.app` |
| `publishing` | `source-publishing-app` | `source-publishing-app.vercel.app` |
| `label` | `source-music-group-app` | `source-music-group-app.vercel.app` |

**Before deploying:**

```bash
corepack pnpm typecheck && corepack pnpm lint && corepack pnpm test
corepack pnpm --filter @source/<app> build
```

**Gotchas:**

- **Always `rm -rf .vercel` afterwards.** Leaving it behind means the next deploy silently targets
  the wrong project.
- Deploy only what changed. A change in `packages/ui` affects **all four** — deploy all four.
- The build runs from the repo root via Turbo, so a broken shared package breaks every app.

## Console + infrastructure (AWS)

> **Status: not yet provisioned.** This section records the intended flow. It will be verified and
> corrected the first time it is actually run — do not treat it as tested.

Deploys run through **GitHub Actions**, authenticating to AWS by **OIDC federation**. There are no
long-lived AWS access keys in GitHub secrets, by design.

```
.github/workflows/ci.yml       PR:      typecheck · lint · test · sst diff · docs checks
.github/workflows/deploy.yml   ecosystem → staging;  manual/tag → production
```

| Stage | Trigger | Approval |
| --- | --- | --- |
| staging | push to `ecosystem` | none |
| production | manual dispatch or tag | **required** — GitHub Environment protection rule |

Migrations are a **separate gated step**, never bundled into the app deploy. See
[migrations.md](migrations.md).

### One-time AWS setup (prerequisite, not yet done)

1. Register `token.actions.githubusercontent.com` as an IAM OIDC identity provider.
2. Create two IAM roles (staging, production), each least-privilege, with trust policies scoped to
   this repository — and for production, to the protected environment specifically.
3. Store the role ARNs as GitHub repository variables.
4. Create the SST state bucket, then `sst deploy --stage staging`.

Record the actual values in the team password manager, **not** in this file.

### Rollback

SST deploys are CloudFormation/Pulumi stack updates, so redeploying the previous commit is the
rollback path for application and infrastructure changes.

**A schema migration is not covered by that.** Rolling back code does not roll back a migration.
See [migrations.md](migrations.md) for why forward-only is the default and what to do instead.

## Git

- Work on local `main`; push with `git push origin main:ecosystem`.
- **Never push `origin/main`** — GitHub Pages serves the live legacy site from it until the domain
  cutover.
