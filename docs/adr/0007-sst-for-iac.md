# 0007 — Use SST v3 for infrastructure, GitHub Actions with OIDC for CI/CD

- **Status:** Accepted
- **Date:** 2026-07-21

## Context

Moving to AWS ([0002](0002-aws-over-managed-vercel-backend.md)) makes infrastructure-as-code
mandatory. The repo has none today — Vercel needed none, and the four marketing sites are still
deployed by hand via a `.vercel-links` directory swap.

There is also a related question that came up during planning and is worth recording, because it
is a common confusion: **GitHub is not an alternative to an IaC tool.** GitHub Actions is the CI/CD
runner that *executes* the IaC. Both are needed, and they do different jobs.

## Decision

**SST v3** defines the infrastructure (`sst.config.ts` + `infra/`): the VPC, Aurora, RDS Proxy, S3,
Cognito, Step Functions, and the console's own hosting via OpenNext.

**GitHub Actions** runs CI and deploys, authenticating to AWS via **OIDC federation** — no
long-lived AWS access keys are stored in GitHub.

```
.github/workflows/ci.yml       PR:  typecheck · lint · test · sst diff · docs checks
.github/workflows/deploy.yml   push ecosystem → staging;  manual/tag → production
```

Migrations are a **separate, gated step**, never automatic. Production deploys sit behind a GitHub
Environment protection rule requiring approval.

## Consequences

**Buys:**

- One tool and one language for the app and its infrastructure, sharing types. Resource
  references are typed rather than stringly-coupled.
- SST answers Next.js-on-AWS hosting directly. With CDK or Terraform that is work we would do
  ourselves before writing any product code.
- OIDC means a compromised repo does not yield durable AWS credentials — the run receives a
  short-lived token scoped to a role we define.
- `sst diff` on every PR makes infrastructure changes reviewable alongside code.
- Per-stage deploys give ephemeral environments without bespoke scripting.

**Costs:**

- SST is a smaller ecosystem than Terraform, with less community material for unusual problems.
- SST v3 is a young major version; expect churn and occasional escape hatches into raw Pulumi/AWS
  resources.
- Another abstraction over CloudFormation/Pulumi to understand when something fails obscurely.
- Team members with Terraform experience will not have SST experience.
- The repo root path contains a double space (`Source  Music Group`), which will bite unquoted
  shell steps in CI. Quote everything, or rename the directory.

## Alternatives considered

**AWS CDK.** First-party, TypeScript, broadest service coverage and the most control over
networking detail. Rejected because it has no built-in answer for hosting a Next.js app — that
would be assembled by hand (or by adopting OpenNext directly, which is what SST already does),
which is meaningful work before any product value.

**Terraform / OpenTofu.** The ops-industry default with the largest module ecosystem, and
cloud-agnostic. Rejected: HCL is a separate language from the app code with no shared types, and
its Next.js-on-AWS story is the weakest of the three. Cloud-agnosticism is not worth much here,
given the choice in ADR 0002 was made *because* of AWS-specific properties.

**Console-configured infrastructure ("click-ops").** Rejected. Not reviewable, not reproducible,
and unacceptable for infrastructure holding financial data.

**A different CI system (CodePipeline, CircleCI).** Rejected: the code already lives on GitHub,
Actions integrates with pull requests and Environments directly, and OIDC federation to AWS is
well supported.
