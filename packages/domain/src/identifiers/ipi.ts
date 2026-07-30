/* IPI Name Number — identifies a PARTY (a writer, publisher, or other
   interested party) in the CISAC system. This is how you tell two writers
   called "John Smith" apart, which is why it matters far more than it looks.

   Also encountered as "CAE number", the legacy 9-digit form. CAE and IPI Name
   Numbers are the same namespace: a 9-digit CAE left-padded to 11 digits is the
   IPI Name Number. Statements use both interchangeably and inconsistently, so
   everything is normalised to the 11-digit form on the way in.

   Note there is also an "IPI Base Number" (form `I-000000000-0`) which
   identifies a *work-level interested party role* rather than a name. It is a
   different thing and is not handled here; if one appears in a statement it
   should be stored as a `proprietary` identifier rather than coerced.

   Validation is SHAPE ONLY. IPI Name Numbers do carry a check digit in the
   CISAC specification, but it is not consistently reproduced on statements and
   validating it would reject real data. We deliberately accept any 11 digits. */

const IPI_LENGTH = 11;

/**
 * Normalise to the 11-digit zero-padded form.
 *
 * `"257110991"` (CAE) → `"00257110991"`
 * `"00257110991"`     → `"00257110991"`
 * `"257.110.991"`     → `"00257110991"`
 */
export function normalizeIpi(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) return "";
  return digits.padStart(IPI_LENGTH, "0");
}

/**
 * Validate shape: exactly 11 digits once normalised, and not all zeroes.
 *
 * An all-zero value appears in real statements as a placeholder for "unknown
 * party" and must not be stored as though it identified someone.
 */
export function isValidIpi(raw: string): boolean {
  const value = normalizeIpi(raw);
  if (value.length !== IPI_LENGTH) return false;
  if (!/^[0-9]{11}$/.test(value)) return false;
  return !/^0+$/.test(value);
}

/** Normalise and validate. Returns null when not usable as a party identifier. */
export function parseIpi(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const value = normalizeIpi(raw);
  return isValidIpi(value) ? value : null;
}
