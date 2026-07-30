/* Title and artist normalisation — the substrate the matching engine scores on.

   These functions decide what "the same title" means, so they are load-bearing
   for every fuzzy match. Two principles:

   1. Normalise aggressively for COMPARISON, never for STORAGE. The original
      reported values are always kept verbatim on `statement_line.raw`; these
      derived forms exist to be indexed (Postgres pg_trgm) and compared.

   2. Do not discard information that distinguishes real entities. It is
      tempting to strip "(Live)" or "feat. X" to make more things match — that
      is exactly how a live version's revenue gets attributed to the studio
      recording. Version information is EXTRACTED so the caller can use it,
      not deleted. */

/** Lowercase, strip diacritics, reduce punctuation to spaces, collapse spaces. */
export function normalizeText(raw: string): string {
  return raw
    .normalize("NFD")
    // Strip combining marks: "Beyoncé" → "Beyonce", so sources that drop
    // accents still match those that keep them.
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    // Keep alphanumerics and spaces; everything else becomes a separator.
    .replace(/[^0-9a-z]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/* Parenthetical/bracketed/dash-suffixed segments that denote a distinct version
   rather than a different song. Matched case-insensitively. */
const VERSION_KEYWORDS = [
  "live",
  "remix",
  "acoustic",
  "instrumental",
  "radio edit",
  "edit",
  "extended",
  "remaster",
  "remastered",
  "demo",
  "sped up",
  "slowed",
  "reverb",
  "clean",
  "explicit",
  "mono",
  "stereo",
  "reprise",
  "interlude",
  "version",
  "mix",
  "cover",
  "karaoke",
];

/** A title split into its comparable base and any version qualifier found. */
export interface TitleParts {
  /** Normalised title with version qualifiers removed — use this to compare. */
  readonly base: string;
  /** The version qualifier as normalised text, or null. e.g. `"live"`. */
  readonly version: string | null;
  /** Featured-artist names lifted out of the title, normalised. */
  readonly featured: readonly string[];
}

/* Captures "(...)", "[...]", and a trailing " - ..." segment. */
const SEGMENT_PATTERN = /\(([^)]*)\)|\[([^\]]*)\]|\s-\s([^-]*)$/g;
const FEATURE_PREFIX = /^(?:feat|ft|featuring|with)\b\.?\s*/i;

/**
 * Split a raw title into a comparable base, a version qualifier, and any
 * featured artists that were embedded in the title.
 *
 * Statements are wildly inconsistent about whether features live in the title
 * or the artist column, so pulling them out of both and comparing the union is
 * what makes titles like `"Lifetime (feat. Rose the Healer)"` match a catalog
 * entry titled just `"Lifetime"`.
 */
export function parseTitle(raw: string): TitleParts {
  const featured: string[] = [];
  let version: string | null = null;

  const stripped = raw.replace(SEGMENT_PATTERN, (_match, paren, bracket, dash) => {
    const inner = String(paren ?? bracket ?? dash ?? "").trim();
    if (inner.length === 0) return " ";

    if (FEATURE_PREFIX.test(inner)) {
      const names = inner.replace(FEATURE_PREFIX, "");
      featured.push(...splitArtistNames(names));
      return " ";
    }

    const normalizedInner = normalizeText(inner);
    if (VERSION_KEYWORDS.some((kw) => normalizedInner.includes(kw))) {
      version = normalizedInner;
      return " ";
    }

    // An unrecognised segment is kept — it may genuinely be part of the title.
    return ` ${inner} `;
  });

  return { base: normalizeText(stripped), version, featured };
}

/** Normalised title with version qualifiers and features removed. */
export function normalizeTitle(raw: string): string {
  return parseTitle(raw).base;
}

/* Separators that join multiple artist names in one field. Order matters:
   longer textual separators are replaced before bare punctuation. */
const ARTIST_SEPARATORS =
  /\s*(?:\bfeat\b\.?|\bft\b\.?|\bfeaturing\b|\bwith\b|\bvs\b\.?|\band\b|&|\bx\b|,|\/|\+)\s*/gi;

/** Split a raw artist field into individual normalised names, in order. */
export function splitArtistNames(raw: string): string[] {
  return raw
    .replace(ARTIST_SEPARATORS, "|")
    .split("|")
    .map((name) => normalizeText(name))
    .filter((name) => name.length > 0);
}

/** Normalised primary artist: the first name in the field. */
export function normalizeArtist(raw: string): string {
  return splitArtistNames(raw)[0] ?? "";
}

/**
 * The set of word tokens across every artist name in a field.
 *
 * Tokens rather than whole names because sources disagree about word order and
 * about which collaborators they list, so token overlap is far more robust than
 * string equality. `"Duka & Rose the Healer"` and `"Rose The Healer, Duka"`
 * produce the same set.
 */
export function artistTokens(raw: string): Set<string> {
  const tokens = new Set<string>();
  for (const name of splitArtistNames(raw)) {
    for (const token of name.split(" ")) {
      if (token.length > 0) tokens.add(token);
    }
  }
  return tokens;
}

/**
 * Jaccard similarity: |intersection| / |union|, in [0, 1].
 *
 * Two empty sets are defined as 0, not 1 — "we know nothing about either side"
 * must never score as a perfect match, or missing artist data would auto-match
 * everything.
 */
export function jaccardSimilarity<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const value of a) {
    if (b.has(value)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/** Convenience: token-level Jaccard between two raw artist fields. */
export function artistSimilarity(a: string, b: string): number {
  return jaccardSimilarity(artistTokens(a), artistTokens(b));
}
