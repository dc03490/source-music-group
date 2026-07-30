# Architecture Decision Records

Each file records one decision: the context that forced it, what was decided, what it costs, and
what was rejected.

## Rules

- **Immutable once accepted.** Do not edit a decision to reflect a new one. Write a new ADR that
  supersedes it, and link both ways.
- **Record the rejected options.** This is the most valuable part. Without it, a future developer
  re-proposes a rejected option in good faith and nobody remembers why it was dropped.
- **State the cost honestly.** An ADR listing only benefits is marketing, not a record.

## Template

```markdown
# NNNN — Title in the imperative

- **Status:** Accepted | Superseded by NNNN | Deprecated
- **Date:** YYYY-MM-DD

## Context
What forced a decision. Constraints, not narrative.

## Decision
What we do.

## Consequences
What this buys, and what it costs. Both.

## Alternatives considered
Each option, and the specific reason it was rejected.
```

## Index

| ADR | Decision |
| --- | --- |
| [0001](0001-separate-console-app.md) | The product is a separate app, not an extension of the marketing site |
| [0002](0002-aws-over-managed-vercel-backend.md) | AWS for the product backend, over a managed Vercel-hosted stack |
| [0003](0003-postgres-not-dynamodb.md) | PostgreSQL, not DynamoDB |
| [0004](0004-cognito-with-owned-org-model.md) | Cognito for identity, with our own organisation model |
| [0005](0005-statement-files-not-connector-apis.md) | Ingest statement files; do not design around royalty APIs |
| [0006](0006-step-functions-for-the-pipeline.md) | Step Functions + Lambda for the ingestion pipeline |
| [0007](0007-sst-for-iac.md) | SST v3 for infrastructure, GitHub Actions with OIDC for CI/CD |
| [0008](0008-raw-immutable-normalized-derived.md) | Raw statement rows are immutable; normalised values are derived |
| [0009](0009-human-commit-gate.md) | No statement data is trusted without an explicit human commit |
| [0010](0010-deterministic-rules-not-ai.md) | Issues come from deterministic rules, never from a model |
