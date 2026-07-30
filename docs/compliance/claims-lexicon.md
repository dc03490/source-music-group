# Claims lexicon

**Read this before writing any user-facing copy.** CI fails on prohibited claims, including in
these docs.

## Why this exists

Source Royalty analyses royalty data a user gives us and surfaces observations. It does **not**
locate money, guarantee recovery, or have privileged access to any society, PRO, or DSP database.

The risk is not malice. It is that "we found $4,000 you're owed" converts better than "3 areas
require further review", and someone reasonable will write the former. One screenshot of that
sentence circulating on social media is a concrete, foreseeable problem — and it would be our
own copy, not a misquote.

So the constraint is enforced in four layers, because copy discipline alone does not survive
contact with a growing codebase:

1. **Schema** — `issue.estimated_value` cannot be persisted without `estimate_basis` and
   `estimate_confidence` (a `CHECK` constraint). You cannot store a number without storing how
   you got it.
2. **Components** — `<VerifiedValue>` and `<EstimatedValue>` render differently and an
   `EstimatedValue` requires a `basis` prop. Raw issue values are never rendered directly.
3. **Lexicon + CI** — this document plus `packages/domain/src/compliance/lexicon.ts`, enforced
   by a test that scans every app, package, and doc.
4. **Aggregates** — no "recovered" total, no "you are owed" total, no lifetime counter.

This document is layer 3's reasoning. The machine-readable list is
[`packages/domain/src/compliance/lexicon.ts`](../../packages/domain/src/compliance/lexicon.ts).

Source of truth for the underlying policy: the **Prohibited or High-Risk Claims** section of
`CLAUDE.md` at the repo root.

## The three value categories

Every figure shown to a user is exactly one of these. If you cannot place a number in category 1
or 2, it does not get shown.

| Category | Meaning | Rendering | Example |
| --- | --- | --- | --- |
| **Reported** | Copied verbatim from a statement. We are quoting the source. | `<VerifiedValue>` — solid | "Unmatched revenue: $412.09" (the file said so) |
| **Estimated** | Computed from the user's own data, with a stated basis. | `<EstimatedValue>` — dashed, `~` prefix, basis in a tooltip, confidence chip | "~$120, based on your own median across the prior 6 periods" |
| **None** | No defensible number exists. | No figure at all | "3 works have US streaming activity and no registration on file" |

**Most rules are category 3, and that is correct.** The temptation to attach a number to every
finding is exactly the failure mode this system guards against.

### The flagship case: `source_coverage_gap`

The rule that detects "this recording earned DSP revenue in a period but no performance or
mechanical revenue appears from any source for the same period" is the most valuable *and* most
legally sensitive rule in the product. It is the one that a careless implementation turns into
"you're owed $4,000".

**It ships with no dollar figure at all**, framed strictly as an area requiring further review.
This is a deliberate product concession. Do not "improve" it by adding an estimate.

## Prohibited claims

Grouped by the kind of false claim each makes. The machine list is authoritative; this explains
the reasoning.

### Guarantees of outcome

Nothing about collection is within our control. We do not decide what a society pays.

`guaranteed recovery` · `guarantee recovery` · `we will recover` · `guaranteed payout`

### Claims that money has been located

We observe **data**. We can say a registration is absent or a line is unmatched. We cannot say
money exists, is owed, or is missing — those are legal conclusions about third parties.

`money you're owed` · `money you are owed` · `missing money` · `unpaid royalties` ·
`we found your money` · `recovered for you`

### Claims of privileged data access

We read what the user uploads or authorises. No third party has blanket access to PRO, society,
or DSP internal databases, and claiming it is both false and checkable.

`we have access to` · `all royalty databases` · `every royalty database` · `direct access to PRO`

### Claims of affiliation or authority

Naming a society as a **data source** is fine ("supports statements exported from The MLC").
Implying a relationship is not, unless it has been formally established in writing.

`in partnership with the MLC` · `official partner` · `authorized by` · `we audit`

On **"audit"** specifically: the word implies authority over another party's books. Internally
"catalog audit" is our shorthand; in user-facing copy prefer "review". Note the existing
marketing site does use "audit" in this sense — that is a known inconsistency to reconcile at
M4, tracked in the plan.

### Legal or financial advice framing

`we provide legal advice` · `we represent you`

**Note:** the bare phrase "legal advice" is deliberately **not** banned. Every correct
terms-of-use disclaimer must contain it ("nothing on these sites is legal advice"), so banning it
would fire on precisely the copy we want. Only assertive constructions are machine-checkable;
advice framing otherwise needs human review.

## Approved replacement language

Use these:

- potential royalty gaps
- possible unmatched royalties
- areas requiring further review
- data inconsistencies
- missing or incomplete registrations
- royalties that may not have been properly associated with the rights holder
- estimated value
- requires further review

## The disclaimer exception

A disclaimer must name the thing it disclaims. *"We don't promise missing money, recovery
amounts, or outcomes"* is exactly the copy we want, and it contains a banned phrase.

A substring matcher cannot distinguish a claim from its denial, and negation detection was
rejected deliberately: a heuristic that *sometimes* suppresses a real violation is more dangerous
than no check at all. Allowlisting whole files was also rejected as too coarse —
`apps/royalty/app/page.tsx` is ~580 lines and holds both a legitimate disclaimer and real
conversion copy.

So the escape hatch is explicit, narrow, and visible in review. Put a comment directly above the
copy containing:

```
lexicon-allow: missing money — negated disclaimer, states what we do NOT promise
```

Rules:

- It covers **only that phrase**, for **only the next few lines**.
- It cannot silence a file — beyond its window the scan resumes.
- It must carry a reason. A marker without justification should fail review.

There is currently **one** such marker in the codebase, on the "What we don't guarantee" card in
`apps/royalty/app/page.tsx`. If that count grows quickly, the lexicon is probably too blunt and
should be made more precise instead.

## When the check fires

The failure names the file, line, matched text, reason, and the approved replacement. Options, in
order of preference:

1. **Rewrite the copy** using approved language. Almost always the right answer.
2. **Add a `lexicon-allow` marker** if it is genuinely a negated disclaimer.
3. **Make the lexicon entry more precise** if it is firing on correct copy in general — as was
   done for "legal advice". Removing a check because it is inconvenient is not on this list.

## Verifying the guardrail

A check nobody has seen fail is not known to work. To confirm it still bites, temporarily add
`guaranteed recovery` to any scanned file and run `pnpm test` — it must fail, naming the file and
line. This was verified when the check was built: it caught a real prohibited phrase in shipped
production copy on its first run, and a whitespace bug that had made it silently blind to
phrases wrapped across JSX lines.
