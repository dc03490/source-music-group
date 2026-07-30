# Schema design

Structure lives in **[schema.generated.md](schema.generated.md)** (generated from the Drizzle
schema, CI-checked for staleness). This file covers the reasoning — specifically the decisions
that look like mistakes until you know the domain.

Prerequisite reading: **[glossary.md](glossary.md)**. Several fields below are meaningless without
it.

Source of truth: `packages/db/src/schema/`. The `COMMENT ON` statements in
`packages/db/migrations/0000_init.sql` carry the same reasoning into the database itself, so it
shows up in `psql \d+` and any introspection tool.

## Five principles

1. **Raw is immutable; normalised values are derived.** `statement_line.raw` keeps the source row
   verbatim forever, and every normalised column is recomputable from it. A parser bug becomes a
   reparse, not an incident. ([ADR 0008](../adr/0008-raw-immutable-normalized-derived.md))
2. **Identifiers are side tables, not columns.** A work has an ISWC *and* an MLC ID *and* a
   publisher's proprietary ID, each from a different source with a different trust level.
3. **Constraints never block ingesting true-but-ugly data.** Splits that don't sum to 100,
   overlapping terms, duplicate ISRCs — all occur in real catalogs. They are *findings*, produced
   by rules. A database error on a real statement is a product failure.
4. **Money is `numeric(18, 6)` with an explicit currency**, handed to `decimal.js` at boundaries.
   Six decimals because per-stream rates are fractions of a cent and rounding at two loses real
   money across millions of rows. Drizzle returns `numeric` as a **string** — that is correct, and
   it must never be passed to `Number()`.
5. **Every row carries `org_id`**, including join tables, so tenant scoping and row-level security
   can constrain everything.

## Decisions that look wrong

### `recording` has no `work_id`

Not an oversight. Recordings routinely arrive from a distributor statement *before* anyone knows
which composition they embody, and a medley embodies several. A nullable FK would model "unknown"
but not "several".

The relationship lives in `work_recording`, many-to-many, carrying `link_type` (primary, sample,
medley_segment, interpolation), `confidence`, and `confirmed_by_user_id`. **A link with
`confirmed_at IS NULL` is a hypothesis, not a fact**, and must render differently in the UI.

### `work_share` has both `ownership_pct` and `collection_pct`

A publisher can own 50% of a work while collecting 100% of it in a territory under an
administration agreement. One column cannot express both, and collapsing them produces confidently
wrong "you are under-collecting" findings — worse than no finding.

### `work_share.share_basis` exists at all

Performing rights are conventionally expressed as **writer-side totalling 100% *and*
publisher-side totalling 100%** — two separate universes. Mechanical is usually a single 100%.

Without this discriminator, a "shares must sum to 100" rule fires a false positive on **every
correctly-entered work**. The split-sum rule groups by
`(right_type, share_basis, territory, overlapping term)` before summing anything.

### `territory` plus `territory_excludes[]`

"World except US" is the single most common real-world expression of territory. A normalised
country list is technically tidier, but nobody's paperwork reads that way and round-tripping loses
the intent. So the common case is stored as it is written.

### No exclusion constraint on overlapping share terms

Postgres could enforce non-overlapping `[term_start, term_end)` per party and right. It
deliberately does not. Real catalogs contain overlaps, often because the paperwork itself is
ambiguous, and blocking the insert would prevent recording the truth. Overlaps surface through the
`split_overlap_conflict` rule instead — see principle 3.

### `work.share_completeness`

Three values: `unknown`, `partial_by_design`, `asserted_complete`. The split-sum rule only fires on
`asserted_complete` works.

Without this, every half-entered work generates a "your splits don't add up" issue, users learn the
rules cry wolf, and they stop reading findings altogether. This field is the difference between a
rule engine people trust and one they mute.

### No staging table for statement lines

Lines are written to `statement_line` immediately after parsing, and trust is governed by
`statement_file.status` — nothing outside the statement detail screen reads lines whose file is not
`committed`.

A parallel staging schema would mean two schemas that drift, two sets of parsing code, and a copy
step that can fail halfway. One table plus a status gate is simpler and audits better.
([ADR 0009](../adr/0009-human-commit-gate.md))

### `statement_line` uses `bigint`, everything else uses `uuid`

`statement_line` is the hot table: one small catalog produces tens of thousands of rows a month,
written in bulk and read in period order. A time-sortable integer gives index locality that a
random UUID destroys.

Entity tables are low-volume, so they use `gen_random_uuid()` with a database-side default. UUIDv7
was considered for locality, but Aurora PostgreSQL 16 has no native `uuidv7()`, and generating in
the application means any insert outside Drizzle silently loses the default. The locality argument
only really applies to the hot table, and that one already uses `bigint`.

## Compliance controls in the schema

Two `CHECK` constraints on `issue` are compliance controls, not data hygiene:

```sql
CONSTRAINT issue_value_requires_basis
  CHECK (estimated_value IS NULL
         OR (estimate_basis IS NOT NULL AND estimate_confidence IS NOT NULL))

CONSTRAINT issue_value_requires_currency
  CHECK (estimated_value IS NULL OR estimated_currency IS NOT NULL)
```

**A monetary figure cannot be persisted without recording how it was derived.** Enforcing this at
the storage layer means no code path — including one nobody has written yet — can produce an
unexplained number in front of a user. `value_is_estimate` is `NOT NULL` and drives which UI
component renders the figure.

Do not relax these without reading [../compliance/claims-lexicon.md](../compliance/claims-lexicon.md).

`recommendation` carries an `impact_band` rather than a dollar figure, deliberately: it allows
ranking "do this first" without minting a number that would need a basis and a caveat.

## Row-level security notes

RLS is planned as defence in depth on top of the tenant-scoped client. Two tables **cannot** be
covered by a naive `org_id = current_setting('app.org_id')` policy:

| Table | Why `org_id` is nullable | RLS implication |
| --- | --- | --- |
| `audit_event` | So an organisation can be hard-deleted without destroying its audit history | Orphaned rows must remain readable by an admin path only |
| `statement_format` | A `global` format is shared across all orgs and belongs to none | Policy must allow reading `scope = 'global'` while restricting `scope = 'org'` |

A test in `packages/db/src/schema/schema.test.ts` asserts these are the **only** two exceptions —
a new nullable `org_id` fails CI, because it needs an RLS decision rather than a quiet test update.

`audit_event` is additionally append-only, enforced by `GRANT`: the application role holds `INSERT`
and `SELECT`, with `UPDATE` and `DELETE` revoked. That is a schema-level guarantee rather than a
convention.

## What the schema does *not* enforce

By design, because these are findings rather than errors:

| Real-world situation | Detected by |
| --- | --- |
| Shares don't sum to 100 in a complete group | `split_sum_mismatch` |
| Overlapping share terms for the same party and right | `split_overlap_conflict` |
| The same ISWC or ISRC arriving from two sources | `duplicate_work`, `duplicate_recording` |
| A recording earning mechanical revenue with no linked work | `recording_without_work` |
| No `is_self` party on a work in an owned catalog | `self_party_absent` |
| Our parsed total disagreeing with the file's own total | `statement_total_mismatch` (blocks commit) |

## Changing the schema

`packages/db/src/schema/` is a **Protected Area** in `CLAUDE.md` — changes need explicit approval.

1. Edit the schema, then `pnpm --filter @source/db db:generate`.
2. **Read the generated SQL.** Drizzle occasionally emits a destructive drop-and-recreate where an
   in-place alter was intended.
3. Add `COMMENT ON` for any non-obvious column.
4. `pnpm docs:generate`, and commit the regenerated reference — CI fails if it is stale.
5. Run `pnpm test`; the schema invariant tests cover `org_id` coverage, money precision, the
   compliance checks, extension ordering, and partial unique indexes.

Full procedure and rollback policy: [../runbooks/migrations.md](../runbooks/migrations.md).

## Known unverified

**Migration `0000_init.sql` has never been executed.** It is 700+ lines validated by typecheck and
introspection only — no Postgres was available when it was written. The highest-risk hand-written
part (39 `COMMENT ON` statements, any of which could name a nonexistent column and abort the
migration mid-run) is cross-referenced against the schema by a test. That is not the same as
applying it.

**Applying this migration to a throwaway Postgres is the first task once one is available.**
