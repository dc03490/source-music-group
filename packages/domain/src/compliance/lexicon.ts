/* Compliance lexicon — the language guardrail for everything user-facing.

   WHY THIS EXISTS
   Source Royalty analyses royalty data and surfaces observations. It does not
   locate money, guarantee recovery, or have privileged access to any society,
   PRO, or DSP database. A single sentence implying otherwise is a real legal
   exposure, and the most likely way it happens is not malice — it is someone
   writing "we found $4,000 you're owed" because it converts better.

   Copy discipline alone does not hold across a codebase over time. This module
   is the machine-checkable half: `findBannedPhrases` is run by a Vitest suite
   over rule copy, app source, and docs/, and CI fails on a hit. See
   docs/compliance/claims-lexicon.md for the reasoning behind each entry, and
   the project's CLAUDE.md "Prohibited or High-Risk Claims" section, which this
   encodes.

   This file is intentionally dependency-free so it can be imported anywhere,
   including from lint/test tooling. */

/** A phrase that must never reach a user-facing surface, with the reason. */
export interface BannedPhrase {
  /** Lowercase phrase to match. Matched case-insensitively on word boundaries. */
  readonly phrase: string;
  /** Why it is prohibited — surfaced in the failure message so the fix is obvious. */
  readonly reason: string;
  /** What to say instead. */
  readonly instead: string;
}

/* Grouped by the kind of false claim each one makes. Keep the reason text
   short and actionable: it is what a developer sees when CI fails. */
export const BANNED_PHRASES: readonly BannedPhrase[] = [
  // --- Guarantees of outcome -------------------------------------------------
  {
    phrase: "guaranteed recovery",
    reason: "Implies a promised outcome. No recovery can be guaranteed.",
    instead: "potential royalty gaps",
  },
  {
    phrase: "guarantee recovery",
    reason: "Implies a promised outcome. No recovery can be guaranteed.",
    instead: "identify areas requiring further review",
  },
  {
    phrase: "we will recover",
    reason: "Promises an outcome outside our control.",
    instead: "we help you investigate and pursue",
  },
  {
    phrase: "guaranteed payout",
    reason: "Promises an amount. Amounts are never guaranteed.",
    instead: "estimated value requiring review",
  },

  // --- Claims that money has been located ------------------------------------
  {
    phrase: "money you're owed",
    reason: "Asserts an entitlement we have not established.",
    instead: "possible unmatched royalties",
  },
  {
    phrase: "money you are owed",
    reason: "Asserts an entitlement we have not established.",
    instead: "possible unmatched royalties",
  },
  {
    phrase: "missing money",
    reason: "Asserts money exists and is missing. We observe data gaps, not money.",
    instead: "missing or incomplete registrations",
  },
  {
    phrase: "unpaid royalties",
    reason: "Asserts non-payment as fact. We can only observe absence in the data we hold.",
    instead: "royalties that may not have been associated with you",
  },
  {
    phrase: "we found your money",
    reason: "Asserts discovery of funds.",
    instead: "we identified data inconsistencies worth reviewing",
  },
  {
    phrase: "recovered for you",
    reason: "Claims completed recovery. Phase 1 has no recovery mechanism at all.",
    instead: "resolved data issues",
  },

  // --- Claims of privileged data access --------------------------------------
  {
    phrase: "we have access to",
    reason:
      "Implies privileged database access. We only read what the user authorises or uploads.",
    instead: "we analyse the statements and registrations you provide",
  },
  {
    phrase: "all royalty databases",
    reason: "Implies universal access, which does not exist for any third party.",
    instead: "the sources you connect or upload",
  },
  {
    phrase: "every royalty database",
    reason: "Implies universal access, which does not exist for any third party.",
    instead: "the sources you connect or upload",
  },
  {
    phrase: "direct access to pro",
    reason: "Implies a data relationship with performing rights organisations that we do not have.",
    instead: "statements you export from your PRO",
  },

  // --- Claims of affiliation or authority ------------------------------------
  {
    phrase: "in partnership with the mlc",
    reason: "Claims an affiliation. None exists.",
    instead: "supports data exported from The MLC",
  },
  {
    phrase: "official partner",
    reason: "Claims an affiliation that must be formally established before it can be stated.",
    instead: "supports data from",
  },
  {
    phrase: "authorized by",
    reason: "Implies societal or governmental authorisation.",
    instead: "authorised by you, the rights holder",
  },
  {
    phrase: "we audit",
    reason:
      "'Audit' implies authority over a third party's books. We analyse data the user gives us.",
    instead: "we review your catalog data",
  },

  // --- Legal / financial advice framing --------------------------------------
  /* NOTE: the bare phrase "legal advice" is deliberately NOT banned. Every
     correct terms-of-use disclaimer must contain it ("nothing here is legal
     advice"), so banning it fires on exactly the copy we want. Only assertive
     constructions are checkable; advice framing otherwise needs human review.
     See docs/compliance/claims-lexicon.md. */
  {
    phrase: "we provide legal advice",
    reason: "We are not a law firm and must not claim to provide legal advice.",
    instead: "we provide general information",
  },
  {
    phrase: "we represent you",
    reason: "Implies legal representation.",
    instead: "we support your own claim process",
  },
];

/** Phrasing that IS approved for describing findings. Documented here so the
    replacement vocabulary lives beside the prohibitions rather than in a wiki. */
export const APPROVED_PHRASES: readonly string[] = [
  "potential royalty gaps",
  "possible unmatched royalties",
  "areas requiring further review",
  "data inconsistencies",
  "missing or incomplete registrations",
  "royalties that may not have been properly associated with the rights holder",
  "estimated value",
  "requires further review",
];

/** A single banned-phrase hit inside a piece of text. */
export interface LexiconViolation {
  readonly phrase: string;
  readonly reason: string;
  readonly instead: string;
  /** Character offset of the match, for pointing at the right place in a file. */
  readonly index: number;
  /** The matched text as it actually appeared, preserving original casing. */
  readonly matched: string;
}

/* Apostrophes are the most common false-negative: source copy uses the
   typographic ' while the lexicon stores the ASCII '. Normalise both sides.
   Whitespace is collapsed so a phrase broken across a line wrap still matches —
   which matters because Prettier will wrap long JSX strings.

   The trailing trim() is load-bearing, not cosmetic. `scanSource` joins several
   normalised lines with a single space; without trimming, indented JSX lines
   keep a leading space and the join produces "missing  money" (two spaces),
   which the single-space patterns silently do not match. That failure mode is
   invisible — the scan reports green while being blind to precisely the wrapped
   phrases it exists to catch. Covered by a regression test. */
function normalizeForMatch(text: string): string {
  return text
    .replace(/[‘’ʼ]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Find every banned phrase in a piece of text.
 *
 * Matching is case-insensitive, apostrophe-insensitive, and tolerant of line
 * wrapping. Word boundaries are required at both ends so "we audit" does not
 * fire on "we auditioned".
 *
 * Note the returned `index` is an offset into the *normalized* text, so it is
 * approximate for the original when whitespace was collapsed. It is intended
 * for ordering and rough location, not for precise editor positioning.
 */
export function findBannedPhrases(text: string): LexiconViolation[] {
  const haystack = normalizeForMatch(text);
  const violations: LexiconViolation[] = [];

  for (const entry of BANNED_PHRASES) {
    const pattern = new RegExp(`\\b${escapeRegExp(entry.phrase)}\\b`, "gi");
    for (const match of haystack.matchAll(pattern)) {
      violations.push({
        phrase: entry.phrase,
        reason: entry.reason,
        instead: entry.instead,
        index: match.index,
        matched: match[0],
      });
    }
  }

  return violations.sort((a, b) => a.index - b.index);
}

/** Convenience predicate for call sites that only need pass/fail. */
export function containsBannedPhrase(text: string): boolean {
  return findBannedPhrases(text).length > 0;
}

/* ---------------------------------------------------------------------------
   Source-file scanning, with line numbers and a deliberate opt-out.

   WHY AN OPT-OUT EXISTS
   A disclaimer must state the thing it disclaims. "We don't promise missing
   money" is exactly the copy we want, yet it contains a banned phrase. The
   alternatives were both worse:

   - Negation detection ("don't", "nothing ... is", "no"). Fragile in both
     directions, and a heuristic that silently suppresses a REAL violation is
     more dangerous than no check at all.
   - Allowlisting whole files. Too coarse — apps/royalty/app/page.tsx is 580
     lines and carries both a legitimate disclaimer and real conversion copy.

   So suppression is explicit, narrow, and reviewable, modelled on
   eslint-disable-next-line. Put a comment directly above the copy containing:

     lexicon-allow: missing money — disclaimer, negated in the sentence

   Any comment syntax works (JSX, line, or block) since only the marker text is
   matched. The marker covers that phrase for the next few lines only, and shows
   up in code review as a conscious decision rather than an invisible exception.
--------------------------------------------------------------------------- */

/** How many lines after a `lexicon-allow` marker it covers. */
const SUPPRESSION_WINDOW = 4;

/** How many lines are joined when looking for a phrase, so wrapped JSX matches. */
const MATCH_WINDOW = 4;

/* Captures everything after the colon. The trailing reason text is harmless:
   suppression matches by containment, so extra words simply travel along. */
const SUPPRESSION_MARKER = /lexicon-allow:\s*(.+)/i;

/** A banned phrase found in a source file, located by line. */
export interface SourceViolation extends LexiconViolation {
  /** 1-based line number where the match begins. */
  readonly line: number;
}

interface Suppression {
  readonly phrase: string;
  readonly from: number;
  readonly to: number;
}

function collectSuppressions(lines: readonly string[]): Suppression[] {
  const suppressions: Suppression[] = [];
  lines.forEach((line, i) => {
    const match = line.match(SUPPRESSION_MARKER);
    if (!match?.[1]) return;
    const lineNo = i + 1;
    suppressions.push({
      phrase: normalizeForMatch(match[1].trim().toLowerCase()),
      // Covers its own line too, so the marker's own text does not self-report.
      from: lineNo,
      to: lineNo + SUPPRESSION_WINDOW,
    });
  });
  return suppressions;
}

/**
 * Scan a source file for banned phrases, reporting 1-based line numbers and
 * honouring `lexicon-allow` markers.
 *
 * Matching uses a rolling multi-line window so a phrase broken across a JSX
 * line wrap is still caught, but a match is only attributed to the line it
 * actually starts on, so it is reported exactly once.
 */
export function scanSource(text: string): SourceViolation[] {
  const lines = text.split(/\r?\n/);
  const normalized = lines.map((line) => normalizeForMatch(line));
  const suppressions = collectSuppressions(lines);
  const violations: SourceViolation[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const head = normalized[i] ?? "";
    // A match cannot begin on a line with no comparable content.
    if (head.length === 0) continue;

    const window = normalized
      .slice(i, i + MATCH_WINDOW)
      .filter((part) => part.length > 0)
      .join(" ");
    const lineNo = i + 1;

    for (const entry of BANNED_PHRASES) {
      const pattern = new RegExp(`\\b${escapeRegExp(entry.phrase)}\\b`, "gi");
      for (const match of window.matchAll(pattern)) {
        // Only report matches that START within this line, so the rolling
        // window does not report the same phrase once per overlapping window.
        if (match.index >= head.length) continue;

        const suppressed = suppressions.some(
          (s) => s.phrase.includes(entry.phrase) && lineNo >= s.from && lineNo <= s.to,
        );
        if (suppressed) continue;

        violations.push({
          phrase: entry.phrase,
          reason: entry.reason,
          instead: entry.instead,
          index: match.index,
          matched: match[0],
          line: lineNo,
        });
      }
    }
  }

  return violations.sort((a, b) => a.line - b.line);
}

/** Render violations as a human-readable report for a test or CI failure. */
export function formatViolations(source: string, violations: readonly LexiconViolation[]): string {
  if (violations.length === 0) return "";
  const lines = violations.map(
    (v) => `  "${v.matched}" — ${v.reason}\n    Use instead: "${v.instead}"`,
  );
  return `${source}: ${violations.length} prohibited phrase(s)\n${lines.join("\n")}`;
}
