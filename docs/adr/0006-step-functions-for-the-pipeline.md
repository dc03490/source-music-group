# 0006 — Use Step Functions + Lambda for the ingestion pipeline

- **Status:** Accepted
- **Date:** 2026-07-21

## Context

Ingestion is a multi-step process over files that can reach hundreds of thousands of rows:

```
detect format → parse → normalise → reconcile → (human commit) → match → detect issues
```

Requirements: individual steps fail and must retry without redoing the whole file; a run must be
inspectable after the fact ("why did this file produce these numbers?"); the whole thing must be
replayable when a parser is fixed; and the human commit gate means the pipeline **pauses
indefinitely** partway through.

A single Lambda cannot do it — the 15-minute ceiling is reachable on a large file, and a timeout
partway through a parse would leave partial state with no record of where it stopped.

## Decision

**AWS Step Functions (Standard workflows) orchestrating Lambda functions.** Parsing uses a
**Distributed Map** over chunks of ~1,000 rows.

The pipeline is split at the commit gate: one state machine ends at `parsed`/`reconcile_failed`,
and committing starts a second (match → detect issues). The pause is modelled as "the workflow
ended and a human action starts the next one", not as a long-running wait.

## Consequences

**Buys:**

- Per-step retry with backoff, configured declaratively rather than hand-rolled.
- **Execution history is the audit trail for a parse.** When a user asks why a figure is what it
  is, the run is inspectable months later without extra logging code.
- Distributed Map reads the S3 object directly and fans out chunks, so the 15-minute ceiling is
  never approached regardless of file size.
- Replay after a parser fix, which pairs with raw-immutability
  ([0008](0008-raw-immutable-normalized-derived.md)) to make reparsing routine.
- Per-org concurrency limits, so one label's 500k-row statement cannot starve everyone else.
- No infrastructure to operate.

**Costs:**

- State machine definitions are verbose, and expressing them in IaC is more work than calling a
  function.
- Local development is worse than plain functions; the pipeline is best exercised by integration
  tests against real fixtures rather than by running the state machine locally.
- Standard workflows are billed per state transition, so chunk size is a cost lever, not just a
  performance one.
- Debugging a Distributed Map failure means reading execution history rather than a stack trace.

## Alternatives considered

**A managed durable-workflow product (e.g. Inngest, Trigger.dev).** Designed into the earlier
Vercel-based plan and genuinely good — better local development, less ceremony. Rejected here for
consistency with [0002](0002-aws-over-managed-vercel-backend.md): it is another vendor holding
data about the pipeline, and Step Functions covers the same needs natively.

**A Fargate container running the whole pipeline as one process.** Attractive: no time limit, one
mental model, identical local and production code. Rejected for Phase 1 because it costs money at
idle, and because scaling and retry become our code. It remains the right answer for **PDF
extraction** in Phase 2, which is CPU-heavy and unsuited to Lambda — expect a hybrid then.

**SQS + Lambda, hand-rolled state.** Rejected: this is Step Functions with the orchestration,
retry semantics, and history written by us and less well.

**A `job` table polled by a cron Lambda.** Rejected: adequate for a queue, poor for a pipeline
with fan-out and no visibility into a partially-failed run.
