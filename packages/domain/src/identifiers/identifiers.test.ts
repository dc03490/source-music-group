import { describe, expect, it } from "vitest";
import { formatIsrc, isValidIsrc, normalizeIsrc, parseIsrc } from "./isrc";
import { formatIswc, isValidIswc, normalizeIswc, parseIswc } from "./iswc";
import { isValidIpi, normalizeIpi, parseIpi } from "./ipi";
import { isValidGtin, normalizeGtin, parseGtin } from "./gtin";

/* Test data notes — these are real, verifiable codes, not placeholders:
   - `T-070.244.437-8` is the canonical CISAC ISWC example; its check digit 8 is
     independently derivable, so it validates the algorithm rather than the code.
   - `4006381333931` is a real EAN-13 whose check digit 1 is likewise derivable.
   - `075678964527` is a constructed but check-digit-correct UPC-A, used to prove
     that zero-padding to GTIN-14 preserves the check digit. */

describe("ISRC (identifies a recording)", () => {
  it("normalises separators and case", () => {
    expect(normalizeIsrc("us-abc-24-00001")).toBe("USABC2400001");
    expect(normalizeIsrc("US ABC 24 00001")).toBe("USABC2400001");
    expect(normalizeIsrc("USABC2400001")).toBe("USABC2400001");
  });

  it("accepts well-formed codes", () => {
    expect(isValidIsrc("USABC2400001")).toBe(true);
    expect(isValidIsrc("us-abc-24-00001")).toBe(true);
  });

  it("accepts non-ISO registrant country codes that are legitimately issued", () => {
    // QM/QZ are real and common for registrants without a national agency.
    expect(isValidIsrc("QM6MZ2412345")).toBe(true);
    expect(isValidIsrc("ZZABC2400001")).toBe(true);
  });

  it("rejects wrong length", () => {
    expect(isValidIsrc("USABC240000")).toBe(false);
    expect(isValidIsrc("USABC24000012")).toBe(false);
    expect(isValidIsrc("")).toBe(false);
  });

  it("rejects a non-letter country code and non-digit tail", () => {
    expect(isValidIsrc("1SABC2400001")).toBe(false);
    expect(isValidIsrc("USABC24000A1")).toBe(false);
  });

  it("parses to a canonical value or null", () => {
    expect(parseIsrc("us-abc-24-00001")).toBe("USABC2400001");
    expect(parseIsrc("nope")).toBeNull();
    expect(parseIsrc(null)).toBeNull();
    expect(parseIsrc(undefined)).toBeNull();
    expect(parseIsrc("")).toBeNull();
  });

  it("formats for display and leaves invalid input untouched", () => {
    expect(formatIsrc("USABC2400001")).toBe("US-ABC-24-00001");
    expect(formatIsrc("garbage")).toBe("garbage");
  });
});

describe("ISWC (identifies a composition)", () => {
  it("normalises the CISAC display form", () => {
    expect(normalizeIswc("T-070.244.437-8")).toBe("T0702444378");
    expect(normalizeIswc("t0702444378")).toBe("T0702444378");
  });

  it("validates the mod-10 check digit", () => {
    expect(isValidIswc("T-070.244.437-8")).toBe(true);
    expect(isValidIswc("T1234567894")).toBe(true);
  });

  it("rejects a wrong check digit, which is how it catches typos", () => {
    expect(isValidIswc("T0702444370")).toBe(false);
    expect(isValidIswc("T1234567890")).toBe(false);
  });

  it("rejects a transposition that a shape-only check would miss", () => {
    // 070244437 → 070244473 (last two work-number digits swapped)
    expect(isValidIswc("T0702444738")).toBe(false);
  });

  it("rejects wrong prefix or length", () => {
    expect(isValidIswc("X0702444378")).toBe(false);
    expect(isValidIswc("T07024443788")).toBe(false);
    expect(isValidIswc("T070244437")).toBe(false);
  });

  it("parses to a canonical value or null", () => {
    expect(parseIswc("T-070.244.437-8")).toBe("T0702444378");
    expect(parseIswc("T0702444370")).toBeNull();
    expect(parseIswc(null)).toBeNull();
  });

  it("formats for display", () => {
    expect(formatIswc("T0702444378")).toBe("T-070.244.437-8");
    expect(formatIswc("invalid")).toBe("invalid");
  });
});

describe("IPI (identifies a party)", () => {
  it("left-pads a legacy 9-digit CAE to the 11-digit IPI form", () => {
    expect(normalizeIpi("257110991")).toBe("00257110991");
    expect(normalizeIpi("00257110991")).toBe("00257110991");
    expect(normalizeIpi("257.110.991")).toBe("00257110991");
  });

  it("treats CAE and IPI as the same value once normalised", () => {
    expect(normalizeIpi("257110991")).toBe(normalizeIpi("00257110991"));
  });

  it("accepts any 11 digits, because statements omit the check digit", () => {
    expect(isValidIpi("00257110991")).toBe(true);
    expect(isValidIpi("12345678901")).toBe(true);
  });

  it("rejects the all-zero placeholder that means 'unknown party'", () => {
    expect(isValidIpi("00000000000")).toBe(false);
    expect(isValidIpi("0")).toBe(false);
  });

  it("rejects values too long to be an IPI name number", () => {
    expect(isValidIpi("123456789012")).toBe(false);
  });

  it("parses to a canonical value or null", () => {
    expect(parseIpi("257110991")).toBe("00257110991");
    expect(parseIpi("00000000000")).toBeNull();
    expect(parseIpi(null)).toBeNull();
  });
});

describe("GTIN / UPC / EAN (identifies a release)", () => {
  it("pads every width to GTIN-14 so one product is one value", () => {
    expect(normalizeGtin("075678964527")).toBe("00075678964527");
    expect(normalizeGtin("0075678964527")).toBe("00075678964527");
    expect(normalizeGtin("00075678964527")).toBe("00075678964527");
  });

  it("treats UPC-A, EAN-13 and GTIN-14 forms of one product as equal", () => {
    const upc = normalizeGtin("075678964527");
    const ean = normalizeGtin("0075678964527");
    const gtin = normalizeGtin("00075678964527");
    expect(new Set([upc, ean, gtin]).size).toBe(1);
  });

  it("validates the GS1 check digit across widths", () => {
    expect(isValidGtin("075678964527")).toBe(true);
    expect(isValidGtin("4006381333931")).toBe(true);
    expect(isValidGtin("00075678964527")).toBe(true);
  });

  it("rejects a wrong check digit", () => {
    expect(isValidGtin("075678964524")).toBe(false);
    expect(isValidGtin("4006381333930")).toBe(false);
  });

  it("rejects the all-zero placeholder", () => {
    expect(isValidGtin("000000000000")).toBe(false);
  });

  it("rejects values wider than GTIN-14", () => {
    expect(isValidGtin("000750678964527")).toBe(false);
  });

  it("parses to a canonical value or null", () => {
    expect(parseGtin("075678964527")).toBe("00075678964527");
    expect(parseGtin("075678964524")).toBeNull();
    expect(parseGtin(null)).toBeNull();
  });
});
