# 0003 — Use PostgreSQL, not DynamoDB

- **Status:** Accepted
- **Date:** 2026-07-21

## Context

Having chosen AWS ([0002](0002-aws-over-managed-vercel-backend.md)), DynamoDB is the default-feeling
database: serverless, scales to zero, no VPC, no connection pooling, no idle cost. On a Lambda-based
architecture it removes several of the costs that ADR 0002 accepted.

The question is whether the data model tolerates it.

## Decision

**Aurora Serverless v2 PostgreSQL.** Relational, in a VPC, accessed through RDS Proxy.

## Consequences

**Buys:**

- **`pg_trgm`.** Fuzzy title matching (tier T5 of the matching ladder) generates candidates with a
  GIN trigram index and `similarity()`. This is a hard requirement, not a preference — the
  alternative is pulling the catalog into application memory to score it, which does not scale
  past a trivial catalog and moves the hot path off the database entirely.
- Relational integrity for data that is genuinely relational: a work has many shares, a share has
  a party, a recording links to works many-to-many, a statement line references a recording.
- Ad-hoc analytical queries. "Which works earned on Spotify but have no MLC registration in the
  same period" is a join. In a key-value store it is either a precomputed access pattern decided
  up front or a full scan.
- **Row-level security** as defence in depth for tenant isolation, enforced by the database rather
  than only by application code.
- `CHECK` constraints, which is how the estimate-basis compliance control is enforced at the
  storage layer rather than by convention.
- `numeric(18,6)` for money, with exact decimal arithmetic.

**Costs:**

- VPC, subnets, security groups, and RDS Proxy — all of which DynamoDB would have avoided.
- Connection management under Lambda is a real concern and must be got right early.
- A floor cost unless scale-to-zero is configured.
- Trigram matching is comfortable to roughly 100k catalog rows; beyond that a dedicated search
  index will be needed. Not a Phase 1 concern, but a known ceiling.

## Alternatives considered

**DynamoDB.** Rejected primarily because of the matching engine. Fuzzy text similarity is not
something DynamoDB does; it would require a companion OpenSearch cluster, which reintroduces the
cost and operational surface that choosing DynamoDB was meant to avoid — while splitting the data
across two stores that can disagree. Secondary reasons: the access patterns are not known in
advance (the whole point of the product is answering questions nobody has asked yet), the data is
highly relational, and there are no `CHECK` constraints or RLS.

**DynamoDB for statement lines, Postgres for the catalog.** Rejected as the worst of both: two
stores, two consistency models, and the matching join spans them.

**RDS PostgreSQL (provisioned, not Aurora).** Reasonable, and would work. Aurora chosen for fast
clones (staging refresh), better failover, and scale-to-zero for non-production environments.
Revisit only if Aurora's cost model becomes a problem at low volume.
