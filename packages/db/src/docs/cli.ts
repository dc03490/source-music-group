import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderSchemaDoc } from "./generate";

/* `pnpm docs:generate` entry point.

   Writes docs/domain/schema.generated.md. The staleness check in
   generate.test.ts compares the committed file against a fresh render, so
   forgetting to run this fails CI rather than silently shipping stale docs. */

const OUTPUT = fileURLToPath(
  new URL("../../../../docs/domain/schema.generated.md", import.meta.url),
);

const { markdown, uncategorized } = renderSchemaDoc();

if (uncategorized.length > 0) {
  /* A new table with no layer assignment would land in no diagram and no
     reference section — silently invisible. Fail loudly instead. */
  console.error(
    `Uncategorized tables (add them to LAYERS in generate.ts):\n  ${uncategorized.join("\n  ")}`,
  );
  process.exit(1);
}

writeFileSync(OUTPUT, markdown, "utf8");
console.log(`Wrote ${OUTPUT} (${markdown.split("\n").length} lines)`);
