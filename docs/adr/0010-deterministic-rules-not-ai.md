# 0010 — Issues come from deterministic rules, never from a model

- **Status:** Accepted
- **Date:** 2026-07-21

## Context

The product is positioned as AI-powered, and the long-term vision includes an AI Workspace with
natural-language catalog questions. It would be quick to implement issue detection by handing a
catalog and its statements to a language model and asking what looks wrong.

Two things make that unacceptable for the finding layer specifically.

**Evidence.** Every issue must cite the exact rows and fields that triggered it, because the user
is going to act on it — contact a society, correct a split, file a claim. "The model thinks this
work may be unregistered" is not actionable, and if it is wrong the user has spent real effort on
nothing.

**Compliance.** A dollar figure attached to a finding must have a stated, reproducible basis; the
schema enforces this with a `CHECK` constraint requiring `estimate_basis`. A model's output has no
basis that can be written down and re-derived, and a hallucinated figure framed as a royalty
opportunity is precisely the prohibited claim the whole compliance layer exists to prevent.

## Decision

**Every issue and every dollar figure originates from a deterministic rule.** Rules are pure
functions in `packages/domain/src/rules/`, each exporting `{ key, version, severity, detect,
evidence, recommend }`, unit tested, with a ruleset version stamped on every issue produced.

When the AI layer arrives in Phase 3, the constraint is: **AI suggests, deterministic rules
decide.** Acceptable model uses are assistive — suggesting a column mapping for an unknown format
(which a human then confirms), proposing candidate entity matches (which enter the existing review
queue), or phrasing an explanation of a finding a rule already made. Not acceptable: creating an
issue, or producing a number.

## Consequences

**Buys:**

- Findings are reproducible. The same data yields the same issues, so a user can be told exactly
  why something was flagged, and a regression is a failing test rather than a vibe.
- Rules are unit testable as pure functions, with no model access, cost, or latency in the hot path.
- `issue.fingerprint` makes re-runs idempotent — an unchanged problem updates rather than
  duplicating.
- `ruleset_version` on every issue means findings stay explainable after the rules change.
- Documentation generates from the registry (`docs/domain/rules.generated.md`), so a rule cannot
  ship undocumented.
- No inference cost, and no per-row data sent to a third party — which matters given statements
  contain co-writers' PII.

**Costs:**

- Every finding must be explicitly designed. There is no "just ask the model what's wrong",
  so coverage grows linearly with effort.
- Rules cannot spot patterns nobody anticipated — the very thing a model is good at. This is a
  real capability gap, accepted for the finding layer and revisited for the *exploration* layer in
  Phase 3.
- Rule maintenance grows with the rule count, and rules interact (a work with no shares triggers
  several).
- Deterministic rules can be confidently wrong too. The mitigation is evidence: every issue shows
  its inputs, so a user can see the reasoning and disagree.

## Alternatives considered

**LLM-generated findings over the catalog.** Rejected for the finding layer, for the evidence and
compliance reasons above. The failure mode is not "occasionally imprecise" — it is a plausible,
well-worded, fabricated royalty claim, which is the single worst output this product could produce.

**Hybrid: model proposes, rules verify.** Rejected as the *primary* mechanism because if a rule can
verify a finding, the rule can find it — the model adds cost and nondeterminism without adding
capability. Retained in the narrower assistive forms described above.

**Rules now, replace with a model later once accuracy is proven.** Rejected as a framing: this is
not a stepping stone. The deterministic rule layer is permanent, because the evidence and audit
trail are the product's differentiator, not scaffolding.
