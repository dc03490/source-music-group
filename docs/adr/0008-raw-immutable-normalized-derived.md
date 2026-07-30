# 0008 — Raw statement rows are immutable; every normalised value is derived

- **Status:** Accepted
- **Date:** 2026-07-21

## Context

Statement files are messy in ways that cannot be fully anticipated: decimal commas, negatives in
parentheses, dates in five formats, currency in a column or only in the filename, columns that
appear one quarter and vanish the next.

This guarantees that **our parsers will be wrong sometimes**, and that we will discover it after
the data has been ingested and reported on. The question is what happens then.

If parsing overwrites the source row, a parser bug is unrecoverable: the original value is gone
and the only fix is asking the user to re-upload a file from two years ago.

## Decision

`statement_line.raw` stores the **source row verbatim as JSONB, forever**. Every normalised
column (`reported_isrc`, `net_amount`, `period_start`, …) is a **derived** value computed from
`raw` by the current parser version.

Fixing a parser means **reparsing** from `raw`. No user action, no data loss.

The one exception: columns marked `sensitive_fields` on the format (payee bank details, tax IDs,
addresses) are dropped **at parse time, before `raw` is written**. Minimising PII outranks
reparse fidelity, and those columns are never needed for analysis.

## Consequences

**Buys:**

- A parser bug is a bug, not an incident. Reparse and re-derive.
- The user's question "why does your number differ from my statement?" is answerable by showing
  the exact source row we read.
- Parser changes can be validated against real historical data before deploying.
- Pairs with Step Functions replay ([0006](0006-step-functions-for-the-pipeline.md)) to make
  reparsing routine rather than exceptional.
- Golden-fixture tests can be built from real rows, since the raw form is retained.

**Costs:**

- Storage roughly doubles: the raw row plus its normalised projection. Acceptable — text rows are
  cheap, and correctness is the product.
- JSONB is not free to query; all filtering and aggregation must use the normalised columns, never
  `raw`. This needs to stay a discipline.
- A reparse changes numbers a user may have already seen. That is a product surface, not just a
  data operation: reparsing a committed file must be visible and audited.
- Redacting sensitive columns before persisting means those columns cannot be recovered by
  reparse. Deliberate.

## Alternatives considered

**Parse on ingest, discard the source row.** Rejected. Makes parser bugs unrecoverable and
removes the ability to show a user what we actually read — in a product whose entire claim is
accuracy, that evidence trail *is* the product.

**Keep the original file in S3 and re-download it to reparse.** Partly adopted — the original file
*is* retained in S3. But re-deriving a single line requires locating and reparsing the whole file,
which is impractical for row-level operations like "recompute this one line's amount". Keeping
`raw` per line makes row-level fixes cheap. The two are complementary, not alternatives.

**A separate staging table that graduates into a clean table.** Rejected: two schemas that drift,
two sets of parsing code, and a copy step that can fail halfway. Trust is instead governed by
`statement_file.status`, so lines exist immediately after parse but nothing outside the statement
detail screen reads them until the file is committed
([0009](0009-human-commit-gate.md)).
