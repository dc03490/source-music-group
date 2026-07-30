import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  APPROVED_PHRASES,
  BANNED_PHRASES,
  containsBannedPhrase,
  findBannedPhrases,
  scanSource,
} from "./lexicon";

/* This file is both the unit test for the matcher AND the repo-wide guardrail.

   The scan below is the thing that actually protects the product: it walks every
   app, package, and doc and fails the build on a prohibited claim. It is
   deliberately in the test suite rather than a bespoke script so it runs on
   every PR through the same gate as everything else. */

const REPO_ROOT = fileURLToPath(new URL("../../../../", import.meta.url));

/** Directories to scan, with the file extensions that count as user-facing. */
const SCAN_TARGETS: ReadonlyArray<{ dir: string; exts: readonly string[] }> = [
  { dir: "apps", exts: [".ts", ".tsx"] },
  { dir: "packages", exts: [".ts", ".tsx"] },
  { dir: "docs", exts: [".md"] },
];

const IGNORED_SEGMENTS = [
  "node_modules",
  ".next",
  ".turbo",
  ".sst",
  "dist",
  "coverage",
  "fixtures",
];

/* Files whose whole purpose is to enumerate or explain the prohibited phrases.
   Paths are repo-relative and compared with forward slashes. */
const ALLOWLIST = new Set([
  "packages/domain/src/compliance/lexicon.ts",
  "packages/domain/src/compliance/lexicon.test.ts",
  "docs/compliance/claims-lexicon.md",
]);

function walk(absDir: string, exts: readonly string[]): string[] {
  let entries;
  try {
    entries = readdirSync(absDir, { withFileTypes: true });
  } catch {
    // A scan target that does not exist yet is not a failure; it starts being
    // covered the moment it is created.
    return [];
  }

  const found: string[] = [];
  for (const entry of entries) {
    if (IGNORED_SEGMENTS.includes(entry.name)) continue;
    const abs = join(absDir, entry.name);
    if (entry.isDirectory()) {
      found.push(...walk(abs, exts));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      found.push(abs);
    }
  }
  return found;
}

function scannableFiles(): string[] {
  const files: string[] = [];
  for (const target of SCAN_TARGETS) {
    files.push(...walk(join(REPO_ROOT, target.dir), target.exts));
  }
  return files.filter((abs) => !ALLOWLIST.has(relative(REPO_ROOT, abs).split("\\").join("/")));
}

describe("lexicon integrity", () => {
  it("has no duplicate phrases", () => {
    const seen = BANNED_PHRASES.map((p) => p.phrase);
    expect(new Set(seen).size).toBe(seen.length);
  });

  it("stores every phrase lowercase so matching is predictable", () => {
    for (const entry of BANNED_PHRASES) {
      expect(entry.phrase).toBe(entry.phrase.toLowerCase());
    }
  });

  it("gives every phrase a reason and a replacement", () => {
    for (const entry of BANNED_PHRASES) {
      expect(entry.reason.length, `reason for "${entry.phrase}"`).toBeGreaterThan(10);
      expect(entry.instead.length, `replacement for "${entry.phrase}"`).toBeGreaterThan(3);
    }
  });

  it("does not ban any phrase it also approves", () => {
    for (const approved of APPROVED_PHRASES) {
      expect(containsBannedPhrase(approved), `approved phrase is banned: "${approved}"`).toBe(false);
    }
  });
});

describe("findBannedPhrases", () => {
  it("detects a plain violation", () => {
    const hits = findBannedPhrases("We offer guaranteed recovery of your royalties.");
    expect(hits).toHaveLength(1);
    expect(hits[0]?.phrase).toBe("guaranteed recovery");
  });

  it("is case-insensitive", () => {
    expect(containsBannedPhrase("GUARANTEED RECOVERY")).toBe(true);
    expect(containsBannedPhrase("Guaranteed Recovery")).toBe(true);
  });

  it("matches typographic apostrophes, which is how real copy is written", () => {
    expect(containsBannedPhrase("Find the money you\u2019re owed")).toBe(true);
    expect(containsBannedPhrase("Find the money you're owed")).toBe(true);
  });

  it("matches across a line wrap, since formatters break long strings", () => {
    expect(containsBannedPhrase("...the money\n          you're owed today")).toBe(true);
  });

  it("requires word boundaries so it does not fire on longer words", () => {
    expect(containsBannedPhrase("we auditioned three singers")).toBe(false);
  });

  it("reports every occurrence, in order", () => {
    const hits = findBannedPhrases("missing money now, and missing money later");
    expect(hits).toHaveLength(2);
    expect(hits[0]!.index).toBeLessThan(hits[1]!.index);
  });

  it("passes approved replacement language", () => {
    expect(containsBannedPhrase("We surface potential royalty gaps for further review.")).toBe(
      false,
    );
    expect(containsBannedPhrase("Possible unmatched royalties: 412 lines")).toBe(false);
  });

  it("accepts clean text", () => {
    expect(findBannedPhrases("Your catalog has 3 areas requiring further review.")).toEqual([]);
  });
});

describe("scanSource", () => {
  it("reports the 1-based line a phrase starts on", () => {
    const hits = scanSource("clean line\nwe offer guaranteed recovery\nclean again");
    expect(hits).toHaveLength(1);
    expect(hits[0]?.line).toBe(2);
  });

  it("catches a phrase broken across a JSX line wrap", () => {
    const source = ["<p>", "  We don't hide the", "  missing money problem", "</p>"].join("\n");
    const hits = scanSource(source);
    expect(hits).toHaveLength(1);
    expect(hits[0]?.phrase).toBe("missing money");
  });

  it("reports a wrapped phrase exactly once, not once per rolling window", () => {
    const source = ["a", "the missing", "money is here", "b", "c"].join("\n");
    expect(scanSource(source)).toHaveLength(1);
  });

  it("catches a phrase spanning INDENTED lines (regression)", () => {
    /* This is the real-world shape: JSX indented ~20 spaces with the phrase
       straddling the wrap. An earlier version joined normalised-but-untrimmed
       lines, producing "missing  money" and matching nothing — the scan looked
       green while missing every wrapped phrase. */
    const source = [
      "                  <p>",
      "                    We do promise missing",
      "                    money, recovery amounts, and outcomes.",
      "                  </p>",
    ].join("\n");
    const hits = scanSource(source);
    expect(hits).toHaveLength(1);
    expect(hits[0]?.phrase).toBe("missing money");
    expect(hits[0]?.line).toBe(2);
  });

  it("honours a lexicon-allow marker on the preceding line", () => {
    const source = [
      "/* lexicon-allow: missing money — disclaimer */",
      "We do not promise missing money.",
    ].join("\n");
    expect(scanSource(source)).toEqual([]);
  });

  it("does not let a marker suppress a different phrase", () => {
    const source = [
      "/* lexicon-allow: missing money — disclaimer */",
      "We offer guaranteed recovery.",
    ].join("\n");
    const hits = scanSource(source);
    expect(hits).toHaveLength(1);
    expect(hits[0]?.phrase).toBe("guaranteed recovery");
  });

  it("stops suppressing beyond its window, so a marker cannot silence a file", () => {
    const source = [
      "/* lexicon-allow: missing money — disclaimer */",
      "",
      "",
      "",
      "",
      "",
      "Real claim about missing money here.",
    ].join("\n");
    expect(scanSource(source)).toHaveLength(1);
  });
});

describe("repo-wide prohibited claims scan", () => {
  const files = scannableFiles();

  it("finds files to scan (a broken glob must not report a false pass)", () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it("contains no prohibited claims in any app, package, or doc", () => {
    const reports: string[] = [];

    for (const abs of files) {
      const violations = scanSource(readFileSync(abs, "utf8"));
      for (const v of violations) {
        reports.push(
          `${relative(REPO_ROOT, abs)}:${v.line}  "${v.matched}"\n` +
            `    ${v.reason}\n    Use instead: "${v.instead}"\n` +
            `    If this is a disclaimer, add above it: lexicon-allow: ${v.phrase} — reason`,
        );
      }
    }

    expect(
      reports.join("\n\n"),
      `Prohibited claims found. See docs/compliance/claims-lexicon.md.\n\n${reports.join("\n\n")}`,
    ).toBe("");
  });
});
