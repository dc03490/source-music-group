import { describe, expect, it } from "vitest";
import {
  artistSimilarity,
  artistTokens,
  jaccardSimilarity,
  normalizeArtist,
  normalizeText,
  normalizeTitle,
  parseTitle,
  splitArtistNames,
} from "./text";

describe("normalizeText", () => {
  it("lowercases and collapses punctuation and whitespace", () => {
    expect(normalizeText("Hello,   World!")).toBe("hello world");
    expect(normalizeText("  Toxic  ")).toBe("toxic");
  });

  it("strips diacritics so accented and unaccented sources match", () => {
    expect(normalizeText("Beyoncé")).toBe("beyonce");
    expect(normalizeText("Sigur Rós")).toBe("sigur ros");
    expect(normalizeText("Beyoncé")).toBe(normalizeText("Beyonce"));
  });

  it("treats apostrophes and hyphens as separators consistently", () => {
    expect(normalizeText("Don't Stop")).toBe("don t stop");
    expect(normalizeText("Hip-Hop")).toBe("hip hop");
  });

  it("keeps digits, which carry meaning in titles", () => {
    expect(normalizeText("No Love In Atlanta Pt. II")).toBe("no love in atlanta pt ii");
    expect(normalizeText("24K Magic")).toBe("24k magic");
  });

  it("returns empty string for punctuation-only input", () => {
    expect(normalizeText("!!!")).toBe("");
    expect(normalizeText("")).toBe("");
  });
});

describe("parseTitle", () => {
  it("extracts a parenthesised version qualifier instead of deleting it", () => {
    const parsed = parseTitle("Toxic (Live)");
    expect(parsed.base).toBe("toxic");
    expect(parsed.version).toBe("live");
  });

  it("handles bracketed and dash-suffixed versions", () => {
    expect(parseTitle("Toxic [Remix]").version).toBe("remix");
    expect(parseTitle("Toxic - Radio Edit").version).toBe("radio edit");
  });

  it("keeps the base title stable across version variants", () => {
    const variants = ["Toxic", "Toxic (Live)", "Toxic [Sped Up]", "Toxic - Remastered"];
    const bases = new Set(variants.map((t) => parseTitle(t).base));
    expect(bases).toEqual(new Set(["toxic"]));
  });

  it("does NOT conflate different versions — the version is preserved", () => {
    // This is the guard against attributing a live version's revenue to the
    // studio recording. Same base, different version.
    const studio = parseTitle("Toxic");
    const live = parseTitle("Toxic (Live)");
    expect(studio.base).toBe(live.base);
    expect(studio.version).toBeNull();
    expect(live.version).toBe("live");
  });

  it("lifts featured artists out of the title", () => {
    const parsed = parseTitle("Lifetime (feat. Rose the Healer)");
    expect(parsed.base).toBe("lifetime");
    expect(parsed.featured).toEqual(["rose the healer"]);
    expect(parsed.version).toBeNull();
  });

  it("handles several feature spellings", () => {
    expect(parseTitle("Min Type (ft. Johnson)").featured).toEqual(["johnson"]);
    expect(parseTitle("Min Type (featuring Johnson)").featured).toEqual(["johnson"]);
    expect(parseTitle("Min Type (with Johnson)").featured).toEqual(["johnson"]);
  });

  it("keeps an unrecognised parenthetical, since it may be part of the title", () => {
    // "(Don't Fear) The Reaper" — the parenthetical is the song, not a version.
    const parsed = parseTitle("(Don't Fear) The Reaper");
    expect(parsed.base).toContain("reaper");
    expect(parsed.base).toContain("don t fear");
    expect(parsed.version).toBeNull();
  });

  it("normalizeTitle is the base form", () => {
    expect(normalizeTitle("Toxic (Live)")).toBe("toxic");
    expect(normalizeTitle("Lifetime (feat. Rose the Healer)")).toBe("lifetime");
  });
});

describe("splitArtistNames", () => {
  it("splits on feature and collaboration separators", () => {
    expect(splitArtistNames("Duka feat. Johnson")).toEqual(["duka", "johnson"]);
    expect(splitArtistNames("Duka & Rose the Healer")).toEqual(["duka", "rose the healer"]);
    expect(splitArtistNames("Duka, Johnson, Rose")).toEqual(["duka", "johnson", "rose"]);
    expect(splitArtistNames("Duka x Johnson")).toEqual(["duka", "johnson"]);
  });

  it("returns a single name unchanged", () => {
    expect(splitArtistNames("Duka")).toEqual(["duka"]);
  });

  it("normalizeArtist takes the primary artist", () => {
    expect(normalizeArtist("Duka feat. Johnson")).toBe("duka");
    expect(normalizeArtist("")).toBe("");
  });
});

describe("artistTokens and similarity", () => {
  it("is order-independent, which is why tokens beat string equality", () => {
    const a = artistTokens("Duka & Rose the Healer");
    const b = artistTokens("Rose The Healer, Duka");
    expect(jaccardSimilarity(a, b)).toBe(1);
  });

  it("scores partial collaborator overlap between 0 and 1", () => {
    const score = artistSimilarity("Duka feat. Johnson", "Duka");
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(1);
  });

  it("scores unrelated artists at 0", () => {
    expect(artistSimilarity("Duka", "Metallica")).toBe(0);
  });

  it("treats two empty sets as 0, never a perfect match", () => {
    // Critical: if both sides have no artist data, that must not auto-match.
    expect(jaccardSimilarity(new Set(), new Set())).toBe(0);
    expect(artistSimilarity("", "")).toBe(0);
  });

  it("treats one empty side as 0", () => {
    expect(artistSimilarity("Duka", "")).toBe(0);
  });

  it("matches across accent differences", () => {
    expect(artistSimilarity("Beyoncé", "Beyonce")).toBe(1);
  });
});
