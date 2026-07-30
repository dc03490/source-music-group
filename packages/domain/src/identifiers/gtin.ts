/* GTIN / UPC / EAN — identifies a RELEASE (an album, EP, or single as a
   product), not a track. Matters here because a meaningful fraction of
   distributor statements key on UPC + track number and carry no ISRC at all,
   making UPC the only bridge from those lines to a recording.

   The same product appears as several widths depending on the source:
     UPC-A    12 digits  (US retail)
     EAN-13   13 digits  (international; a UPC-A is an EAN-13 with a leading 0)
     GTIN-14  14 digits  (adds a packaging-level indicator digit)

   All are normalised to GTIN-14 by left-padding with zeros, so `075678964524`
   and `0075678964524` and `00075678964524` become one comparable value. Without
   this, the same album from two distributors looks like two products.

   All GTINs carry a GS1 mod-10 check digit, so typos are usually detectable
   offline — worth validating at ingest. */

const GTIN_LENGTH = 14;

/** Left-pad to the 14-digit GTIN-14 form. Does not validate. */
export function normalizeGtin(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) return "";
  return digits.padStart(GTIN_LENGTH, "0");
}

/**
 * GS1 mod-10 check digit over the body (all digits except the final one).
 *
 * Weights alternate 3,1,3,1… working right-to-left from the digit immediately
 * left of the check digit, which makes this correct for any GTIN width.
 */
function gtinCheckDigit(body: string): number {
  let sum = 0;
  for (let i = 0; i < body.length; i += 1) {
    const digit = Number(body[body.length - 1 - i]);
    sum += digit * (i % 2 === 0 ? 3 : 1);
  }
  return (10 - (sum % 10)) % 10;
}

/**
 * Validate a GTIN by width and check digit.
 *
 * Accepts anything that normalises to 14 digits and whose check digit is
 * consistent. Rejects all-zero, which appears as a placeholder in real files.
 */
export function isValidGtin(raw: string): boolean {
  const value = normalizeGtin(raw);
  if (value.length !== GTIN_LENGTH) return false;
  if (!/^[0-9]{14}$/.test(value)) return false;
  if (/^0+$/.test(value)) return false;

  const body = value.slice(0, 13);
  const check = Number(value[13]);
  return gtinCheckDigit(body) === check;
}

/** Normalise and validate. Returns null when not a usable GTIN. */
export function parseGtin(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const value = normalizeGtin(raw);
  return isValidGtin(value) ? value : null;
}
