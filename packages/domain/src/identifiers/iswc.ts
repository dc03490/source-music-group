/* ISWC — International Standard Musical Work Code. Identifies a COMPOSITION
   (the underlying song: lyrics, melody, structure), not a recording. Thirty
   recordings of the same song share one ISWC and have thirty different ISRCs.

   Structure (11 characters when normalised):
     T  NNNNNNNNN  C
     │  │          └── check digit (mod-10)
     │  └───────────── 9-digit work number
     └──────────────── literal prefix 'T'

   Unlike ISRC, an ISWC HAS a check digit, so a typo is usually detectable
   offline. That makes `isValidIswc` genuinely useful for catching bad data at
   ingest rather than discovering it at match time.

   Check digit algorithm: sum of (digit × weight) where weights run 1..9 across
   the nine work-number digits, plus 1 for the leading 'T'. The check digit is
   the value that makes the total ≡ 0 (mod 10). */

const ISWC_LENGTH = 11;

/** Strip separators (`T-123.456.789-0` → `T1234567890`) and upper-case. */
export function normalizeIswc(raw: string): string {
  return raw.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
}

/** Compute the expected mod-10 check digit for the 9-digit work number. */
function expectedCheckDigit(workNumber: string): number {
  // The leading 'T' contributes a weight of 1.
  let sum = 1;
  for (let i = 0; i < workNumber.length; i += 1) {
    const digit = Number(workNumber[i]);
    sum += digit * (i + 1);
  }
  return (10 - (sum % 10)) % 10;
}

/**
 * Validate an ISWC structurally AND by check digit.
 *
 * A `true` result means the code is internally consistent — a single-character
 * typo would almost always fail here. It still does not mean the work exists.
 */
export function isValidIswc(raw: string): boolean {
  const value = normalizeIswc(raw);
  if (value.length !== ISWC_LENGTH) return false;
  if (!/^T[0-9]{10}$/.test(value)) return false;

  const workNumber = value.slice(1, 10);
  const check = Number(value[10]);
  return expectedCheckDigit(workNumber) === check;
}

/** Normalise and validate. Returns null when not well-formed or check fails. */
export function parseIswc(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const value = normalizeIswc(raw);
  return isValidIswc(value) ? value : null;
}

/** Render for display: `T-123.456.789-0`, the conventional CISAC form. */
export function formatIswc(raw: string): string {
  const v = normalizeIswc(raw);
  if (!isValidIswc(v)) return raw;
  return `T-${v.slice(1, 4)}.${v.slice(4, 7)}.${v.slice(7, 10)}-${v.slice(10)}`;
}
