/* ISRC — International Standard Recording Code. Identifies a RECORDING
   (a specific recorded performance), not a composition. See ISWC for the
   composition side; conflating the two is the most common domain error.

   Structure (12 characters, no separators when normalised):
     CC  RRR  YY  NNNNN
     │   │    │   └── 5-digit designation code, unique within registrant+year
     │   │    └────── 2-digit year of reference
     │   └─────────── 3-char alphanumeric registrant code
     └─────────────── 2-letter country code

   Real-world messiness this handles:
   - Statements format it as "US-ABC-24-00001", "us abc 24 00001", or bare.
   - There is NO check digit, so validation is structural only. A structurally
     valid ISRC can still be wrong; we can never "verify" one offline.
   - The country code is not strictly ISO 3166-1: 'QM'/'QZ' etc. are legitimately
     issued to registrants without a national agency, and 'ZZ' is used for
     international. So we check shape, not membership of a country list. */

const ISRC_LENGTH = 12;

/** Strip separators and upper-case. Does not validate. */
export function normalizeIsrc(raw: string): string {
  return raw.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
}

/**
 * Structural validation of a normalised ISRC.
 *
 * Returns false for anything that cannot be an ISRC. Returning true means
 * "well-formed", NOT "exists" — there is no check digit and no offline registry.
 */
export function isValidIsrc(raw: string): boolean {
  const value = normalizeIsrc(raw);
  if (value.length !== ISRC_LENGTH) return false;
  // 2 letters (country), 3 alphanumerics (registrant), 7 digits (year + designation)
  return /^[A-Z]{2}[0-9A-Z]{3}[0-9]{7}$/.test(value);
}

/** Normalise and validate in one step. Returns null when not well-formed. */
export function parseIsrc(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const value = normalizeIsrc(raw);
  return isValidIsrc(value) ? value : null;
}

/** Render for display: `US-ABC-24-00001`. Input need not be normalised. */
export function formatIsrc(raw: string): string {
  const v = normalizeIsrc(raw);
  if (!isValidIsrc(v)) return raw;
  return `${v.slice(0, 2)}-${v.slice(2, 5)}-${v.slice(5, 7)}-${v.slice(7)}`;
}
