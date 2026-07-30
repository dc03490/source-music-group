# 0009 — No statement data is trusted without an explicit human commit

- **Status:** Accepted
- **Date:** 2026-07-21

## Context

The tempting flow is: user uploads a file, the pipeline parses it, numbers appear on the dashboard.
One step, no friction.

The problem is that format detection and parsing are both **inferential**. We guess which format a
file is from a header fingerprint, and we guess how to read its numbers from a column mapping. Both
guesses are usually right and occasionally wrong — and a wrong guess about a decimal separator or a
negative-number style produces a **confidently wrong dollar figure** in a product whose only claim
is accuracy.

A user who sees a wrong number once has no reason to believe the next one.

## Decision

Parsed statement lines exist in the database immediately, but **nothing reads them** until the user
presses **"Commit to catalog."**

Before that, the statement detail screen shows: the detected format and confidence, the period,
row count, totals broken down by platform and currency, the reconciliation result, the top 20 rows
as we parsed them, and anything that failed.

Trust is governed by `statement_file.status`. Only `committed` files feed revenue rollups, matching,
and issue detection. The commit writes an `audit_event`. An uncommit path reverts and re-runs.

**Reconciliation can block the commit outright:** if our parsed total disagrees with the total the
file declares (beyond `max(0.5%, $1.00)`), the file enters `reconcile_failed` and cannot be
committed until the mapping is corrected.

## Consequences

**Buys:**

- **We catch our own parser bugs before the user sees a wrong number**, which is the highest-value
  check in the whole system. Reconciliation compares our arithmetic against the source's own.
- The user's mental model is "I confirmed this", which is the correct basis for trusting a figure
  they will act on.
- A clean provenance story: every committed figure traces to a file, a format version, and a
  human decision, recorded in the audit log.
- Unknown formats become a normal path (map it once, then commit) rather than a rejection.

**Costs:**

- **Friction on the primary flow.** Upload is no longer one step, and this is the main product
  risk of the decision. It must be mitigated by making the review screen genuinely informative
  rather than a nag — if it reads as a speed bump rather than proof, users will click through it
  blindly and the control becomes theatre.
- More state to model (`uploaded → detecting → awaiting_mapping → parsing → parsed →
  reconcile_failed → committed → failed → quarantined`) and more UI.
- Bulk onboarding of many historical files means many commits. A batch-commit path will likely be
  wanted, and must preserve per-file reconciliation rather than bypassing it.
- Reconciliation tolerance is a tuning parameter; too tight blocks legitimate files (rounding
  across thousands of rows), too loose lets real bugs through.

## Alternatives considered

**Auto-commit, correct later.** Rejected. It inverts the risk onto the user and spends the one
thing the product cannot re-earn cheaply. A wrong figure is not just a bug here — it is a
credibility event, and potentially a prohibited claim if the user acts on it.

**Auto-commit only when format confidence is 1.0 (an exact fingerprint match).** Genuinely
tempting, and may be revisited. Rejected for Phase 1 because an exact header match does not
guarantee correct *values* — the same headers with a changed decimal separator or currency would
sail through. Reconciliation catches that, but reconciliation only has teeth if something is gated
on it. Worth reconsidering once there is real evidence about how often reconciliation fires on
known formats.

**Show a warning banner instead of gating.** Rejected: warnings are ignored, and the numbers would
already be in the rollups by then.
