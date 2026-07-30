# 0002 — Use AWS for the product backend, over a managed Vercel-hosted stack

- **Status:** Accepted
- **Date:** 2026-07-21

## Context

The product needs a database, authentication, object storage, and durable background processing.
The existing four marketing sites are on Vercel and work well there.

Two coherent stacks were designed in full. **A managed stack was designed first and rejected** —
that history is the point of this ADR.

## Decision

The product backend runs on **AWS**: Aurora Serverless v2 PostgreSQL, Cognito, S3, Step Functions
+ Lambda, in a VPC. The console is hosted on AWS too (Lambda + CloudFront via OpenNext), so it
sits inside the VPC.

**The four marketing sites stay on Vercel.** They are static, deployed, and have no reason to move.

## Consequences

**Buys:**

- **Aurora has no public endpoint.** It is reachable only from private subnets via RDS Proxy.
  This is the decisive advantage and the main reason the console moved to AWS as well.
- Truthful encryption claims. With SSE-KMS on S3 and KMS-encrypted Aurora storage, the data
  policy can honestly say "encrypted at rest using AWS KMS and in transit using TLS".
- Aurora automated backups and PITR are built in rather than a paid add-on.
- One cloud account holds all financial data, with IAM as a single authorization model, which
  makes the security story explainable to a counterparty.
- IAM database authentication removes the database password entirely — there is no credential to
  store, rotate, or leak.

**Costs:**

- **No per-PR database branching.** This is a genuine regression from the managed alternative,
  where a database branch per preview deploy is a first-class feature. Mitigation: Aurora fast
  clones to refresh staging, and a shared dev cluster with schema-per-PR for previews.
- Infrastructure-as-code becomes mandatory (see [0007](0007-sst-for-iac.md)). The repo previously
  needed none.
- Lambda cold starts against a VPC, and RDS Proxy as an extra required component.
- NAT gateway is a standing monthly charge unless VPC endpoints are used deliberately.
- Aurora Serverless v2 has a floor cost unless scale-to-zero is configured.
- Two hosting platforms to operate.

## Alternatives considered

**Managed stack on Vercel: Neon Postgres + Clerk + Cloudflare R2 + Inngest.** Designed in full,
then rejected. It was genuinely attractive — Neon's branch-per-preview is excellent, Clerk
Organizations removes weeks of auth work, and Inngest's durable steps map neatly onto the
pipeline. It was rejected on a networking and data-custody argument: Vercel functions cannot
reach a private VPC, so a VPC-isolated database is not available in that architecture. Reaching a
managed Postgres from Vercel means either a publicly-resolvable endpoint (Vercel egress IPs are
not static outside Enterprise, so IP allowlisting is weak) or an HTTP data API. For earnings data
plus third parties' PII, a database with no public endpoint was judged worth its costs. Secondary
factor: five vendors to hold DPAs with, versus one.

**AWS data services with the console left on Vercel.** Rejected for the same reason: it
reintroduces exactly the public-endpoint or data-API problem that motivated the move, while
adding cross-cloud latency to every query.

**Migrate the marketing sites to AWS as well.** Rejected as churn with no product benefit. They
are static sites that deploy in 30 seconds today.

**DynamoDB instead of a relational database.** See [0003](0003-postgres-not-dynamodb.md).
