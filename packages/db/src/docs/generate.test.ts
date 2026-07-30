import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { renderSchemaDoc } from "./generate";

/* Staleness check for the generated schema reference.

   This is what makes "generated docs" a real guarantee rather than an
   aspiration: if someone adds a column and does not re-run the generator, CI
   fails. Without this the file drifts and becomes actively misleading, which is
   worse than having no schema doc at all. */

const COMMITTED = fileURLToPath(
  new URL("../../../../docs/domain/schema.generated.md", import.meta.url),
);

describe("generated schema reference", () => {
  const { markdown, uncategorized } = renderSchemaDoc();

  it("assigns every table to a documentation layer", () => {
    /* An uncategorized table appears in no diagram and no reference section —
       silently invisible in the docs. */
    expect(
      uncategorized,
      `add these to LAYERS in generate.ts: ${uncategorized.join(", ")}`,
    ).toEqual([]);
  });

  it("is deterministic across renders", () => {
    // Non-deterministic output would make the staleness check below flap.
    expect(renderSchemaDoc().markdown).toBe(markdown);
  });

  it("matches the committed file", () => {
    const committed = readFileSync(COMMITTED, "utf8");
    expect(
      committed === markdown,
      "docs/domain/schema.generated.md is stale. Run `pnpm docs:generate`.",
    ).toBe(true);
  });

  it("documents every table", () => {
    for (const name of ["work_share", "statement_line", "issue", "match_alias"]) {
      expect(markdown).toContain(`#### \`${name}\``);
    }
  });

  it("renders the compliance check constraints", () => {
    expect(markdown).toContain("issue_value_requires_basis");
    expect(markdown).toContain("issue_value_requires_currency");
  });

  it("produces one relationship diagram per layer", () => {
    const fences = markdown.match(/```mermaid/g) ?? [];
    expect(fences.length).toBe(5);
  });
});
