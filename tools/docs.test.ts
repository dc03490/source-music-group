import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, normalize, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/* Documentation integrity checks.

   Docs rot the moment they are optional, so the structural properties that can
   be machine-checked are checked here and run in the same CI gate as everything
   else. This covers link resolution and Mermaid fence balance.

   What it deliberately does NOT check: whether the prose is accurate. That is
   what shipping docs in the same PR as their code is for.

   The prohibited-claims scan over docs/ lives with the lexicon, in
   packages/domain/src/compliance/lexicon.test.ts. */

const REPO_ROOT = fileURLToPath(new URL("../", import.meta.url));
const DOCS_ROOT = join(REPO_ROOT, "docs");

function markdownFiles(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...markdownFiles(abs));
    else if (entry.name.endsWith(".md")) found.push(abs);
  }
  return found;
}

const files = markdownFiles(DOCS_ROOT);

/* Inline links: [text](target). Reference-style and bare URLs are not used. */
const LINK_PATTERN = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

describe("docs", () => {
  it("has files to check", () => {
    expect(files.length).toBeGreaterThan(5);
  });

  it("has no broken internal links", () => {
    const broken: string[] = [];

    for (const abs of files) {
      const text = readFileSync(abs, "utf8");
      for (const match of text.matchAll(LINK_PATTERN)) {
        const raw = match[1];
        if (!raw) continue;

        // External and anchor-only links are out of scope.
        if (/^(https?:|mailto:|#)/.test(raw)) continue;

        const target = raw.split("#")[0];
        if (!target) continue;

        const resolved = normalize(join(dirname(abs), target));
        if (!existsSync(resolved)) {
          broken.push(`${relative(REPO_ROOT, abs)} → ${raw}`);
        }
      }
    }

    expect(
      broken.join("\n"),
      `Broken internal doc links:\n${broken.join("\n")}\n\n` +
        `If the target is a later-milestone doc, reference it as plain text with the ` +
        `milestone noted rather than as a link.`,
    ).toBe("");
  });

  it("has balanced Mermaid fences", () => {
    /* An unclosed ```mermaid fence renders as raw text on GitHub, which is a
       silent failure — the diagram simply does not appear. */
    const unbalanced: string[] = [];

    for (const abs of files) {
      const lines = readFileSync(abs, "utf8").split(/\r?\n/);
      let open = false;
      let openedAt = 0;

      lines.forEach((line, i) => {
        if (!line.startsWith("```")) return;
        if (open) {
          open = false;
        } else {
          open = true;
          openedAt = i + 1;
        }
      });

      if (open) {
        unbalanced.push(`${relative(REPO_ROOT, abs)}: unclosed fence opened at line ${openedAt}`);
      }
    }

    expect(unbalanced.join("\n")).toBe("");
  });

  it("gives every ADR a status and a date", () => {
    const adrs = files.filter((f) => f.includes(`${"adr"}/`) && !f.endsWith("README.md"));
    expect(adrs.length).toBeGreaterThan(0);

    for (const abs of adrs) {
      const text = readFileSync(abs, "utf8");
      const name = relative(REPO_ROOT, abs);
      expect(text, `${name} is missing a Status line`).toMatch(/\*\*Status:\*\*/);
      expect(text, `${name} is missing a Date line`).toMatch(/\*\*Date:\*\*\s*\d{4}-\d{2}-\d{2}/);
      expect(text, `${name} is missing an Alternatives section`).toMatch(/##\s*Alternatives/i);
    }
  });
});
