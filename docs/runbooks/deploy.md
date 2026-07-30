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

```text
.github/workflows/ci.yml       PR: typecheck · lint · test · docs checks · build · typecheck:infra
.github/workflows/deploy.yml   ecosystem → staging;  manual dispatch → production
```

Note `ci.yml` runs **`typecheck:infra`**, not `sst diff`. A diff requires AWS credentials and
would make the quality gates depend on infrastructure state; typechecking against the real SST and
Pulumi types catches wrong property names without needing an account. Add `sst diff` to the deploy
workflow later if a pre-apply preview turns out to be worth the coupling.

| Stage | Trigger | Approval |
| --- | --- | --- |
| staging | push to `ecosystem` | none |
| production | manual dispatch or tag | **required** — GitHub Environment protection rule |

Migrations are a **separate gated step**, never bundled into the app deploy. See
[migrations.md](migrations.md).

### One-time AWS setup (prerequisite — NOT yet done)

Nothing below has been run. This is the checklist that unblocks the first deploy.

#### 1. IAM OIDC identity provider

Register GitHub as an identity provider so Actions can assume a role without stored keys:

- Provider URL: `https://token.actions.githubusercontent.com`
- Audience: `sts.amazonaws.com`

#### 2. Two deploy roles

Create `source-royalty-deploy-staging` and `source-royalty-deploy-production`, each with a trust
policy scoped to this repository. Scope production to the protected environment, so a push to a
branch cannot assume it:

```json
{
  "Effect": "Allow",
  "Principal": { "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com" },
  "Action": "sts:AssumeRoleWithWebIdentity",
  "Condition": {
    "StringEquals": {
      "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
      "token.actions.githubusercontent.com:sub": "repo:dc03490/source-music-group:environment:production"
    }
  }
}
```

For staging use `...:sub": "repo:dc03490/source-music-group:ref:refs/heads/ecosystem"`.

Permissions: SST needs broad create/update rights over the resources it manages (VPC, RDS, S3,
Cognito, Lambda, CloudFront, IAM, Step Functions) plus its own state bucket. Start from
`PowerUserAccess` plus the IAM permissions SST requires, then tighten once the resource set is
stable — least-privilege from a blank slate tends to produce a long trial-and-error loop.

#### 3. GitHub configuration

| Kind | Name | Value |
| --- | --- | --- |
| Variable | `AWS_DEPLOY_ROLE_ARN` | The role ARN (set per environment, not repo-wide) |
| Secret | `DATABASE_URL` | Only if migrations run from CI; prefer IAM auth token generation in the job |
| Environment | `staging` | No protection rules |
| Environment | `production` | **Required reviewers** — this is what enforces the approval gate |

#### 4. First deploy

```bash
pnpm install
pnpm sst:install          # downloads the SST platform (~474MB, gitignored)
pnpm typecheck:infra      # validates infra/ against real SST + Pulumi types
pnpm dlx sst deploy --stage staging
```

SST creates its own state bucket on first run.

> **Expect the first deploy to fail somewhere.** `sst.config.ts` and `infra/` typecheck against real
> SST and Pulumi types, but have never been applied to an AWS account. Typechecking catches wrong
> property names — it does not catch a wrong subnet arrangement, an IAM permission gap, or an
> Aurora engine version that is unavailable in the region. Treat the first run as a debugging
> session.

#### 5. Immediately after the database exists

Apply migration `0000_init.sql` and confirm it runs. It is 700+ lines that have never touched a
database — see [migrations.md](migrations.md) and the "Known unverified" section of
[../domain/schema.md](../domain/schema.md).

Record real account IDs and ARNs in the team password manager, **not** in this file.

### Rollback

SST deploys are CloudFormation/Pulumi stack updates, so redeploying the previous commit is the
rollback path for application and infrastructure changes.

**A schema migration is not covered by that.** Rolling back code does not roll back a migration.
See [migrations.md](migrations.md) for why forward-only is the default and what to do instead.

## Git

- Work on local `main`; push with `git push origin main:ecosystem`.
- **Never push `origin/main`** — GitHub Pages serves the live legacy site from it until the domain
  cutover.
