import { is } from "drizzle-orm";
import { getTableConfig, PgTable } from "drizzle-orm/pg-core";
import * as schema from "../schema/index";

/* Generates docs/domain/schema.generated.md from the Drizzle schema.

   Generated rather than hand-written because a hand-maintained schema reference
   is guaranteed to drift, and a wrong schema doc is worse than none — someone
   will trust it. The staleness check in generate.test.ts fails CI if this output
   and the committed file disagree.

   Deliberately one giant ER diagram is NOT produced: 27 tables with every
   column is unreadable. Instead each layer gets its own relationship diagram,
   and full column detail goes in reference tables below.

   This file emits structure only. The "why" behind non-obvious columns lives in
   docs/domain/schema.md (hand-written) and in COMMENT ON in the migration. */

/** Which architectural layer each table belongs to, for grouping diagrams. */
const LAYERS: Record<string, string> = {
  organization: "Tenancy",
  membership: "Tenancy",
  invitation: "Tenancy",
  audit_event: "Tenancy",

  catalog: "Catalog",
  work: "Catalog",
  work_identifier: "Catalog",
  recording: "Catalog",
  recording_identifier: "Catalog",
  work_recording: "Catalog",
  release: "Catalog",
  release_track: "Catalog",

  party: "Parties & ownership",
  party_identifier: "Parties & ownership",
  party_affiliation: "Parties & ownership",
  work_share: "Parties & ownership",
  recording_share: "Parties & ownership",
  registration: "Parties & ownership",

  source_account: "Ingestion",
  statement_format: "Ingestion",
  statement_file: "Ingestion",
  statement_line: "Ingestion",
  ingest_run: "Ingestion",
  match_alias: "Ingestion",

  detection_run: "Analysis",
  issue: "Analysis",
  recommendation: "Analysis",
};

const LAYER_ORDER = ["Tenancy", "Catalog", "Parties & ownership", "Ingestion", "Analysis"];

interface Relationship {
  readonly from: string;
  readonly to: string;
  readonly columns: string;
}

export interface GenerationResult {
  readonly markdown: string;
  /** Tables present in the schema but missing from LAYERS. */
  readonly uncategorized: readonly string[];
}

function tableConfigs() {
  return Object.values(schema)
    .filter((v) => is(v, PgTable))
    .map((t) => getTableConfig(t))
    // Sorted for deterministic output — the staleness check depends on it.
    .sort((a, b) => a.name.localeCompare(b.name));
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, "\\|");
}

export function renderSchemaDoc(): GenerationResult {
  const tables = tableConfigs();
  const names = new Set(tables.map((t) => t.name));
  const uncategorized = tables.map((t) => t.name).filter((n) => !LAYERS[n]);

  const relationships: Relationship[] = [];
  for (const table of tables) {
    for (const fk of table.foreignKeys) {
      const ref = fk.reference();
      const target = getTableConfig(ref.foreignTable).name;
      if (!names.has(target)) continue;
      relationships.push({
        from: target,
        to: table.name,
        columns: ref.columns.map((c) => c.name).join(", "),
      });
    }
  }
  relationships.sort(
    (a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to) || a.columns.localeCompare(b.columns),
  );

  const out: string[] = [];

  out.push("<!-- GENERATED FILE — do not edit by hand.");
  out.push("     Run `pnpm docs:generate`. CI fails if this file is stale. -->");
  out.push("");
  out.push("# Schema reference (generated)");
  out.push("");
  out.push(
    `Generated from \`packages/db/src/schema\`. **${tables.length} tables.**`,
  );
  out.push("");
  out.push(
    "This file documents *structure*. For the reasoning behind non-obvious columns see",
  );
  out.push(
    "[schema.md](schema.md) and the `COMMENT ON` statements in `packages/db/migrations/`.",
  );
  out.push("");
  out.push("Conventions that hold throughout:");
  out.push("");
  out.push(
    "- Every table carries `org_id` except `organization` itself. `audit_event` and",
  );
  out.push(
    "  `statement_format` allow it to be NULL, deliberately — see [schema.md](schema.md).",
  );
  out.push("- Money is `numeric(18, 6)` and always paired with a currency column.");
  out.push("- Soft-deletable tables have `deleted_at`, and their unique indexes are partial.");
  out.push("");
  out.push(
    "> The diagrams below **omit the universal `org_id` → `organization` edge** except in",
  );
  out.push(
    "> the Tenancy diagram. Every table has one; drawing all 26 buries the structure that",
  );
  out.push("> actually varies.");
  out.push("");

  // --- Relationship diagrams, one per layer -------------------------------
  out.push("## Entity relationships");
  out.push("");

  for (const layer of LAYER_ORDER) {
    const layerTables = tables.filter((t) => LAYERS[t.name] === layer);
    if (layerTables.length === 0) continue;
    const layerNames = new Set(layerTables.map((t) => t.name));

    out.push(`### ${layer}`);
    out.push("");
    out.push("```mermaid");
    out.push("erDiagram");

    /* Edge selection. Every table FKs to `organization` via org_id, so
       including those edges everywhere swamps each diagram with 26 identical
       lines and buries the actual domain structure. So org_id edges appear only
       in the Tenancy diagram, where the tenancy relationship IS the subject;
       elsewhere the universal rule is stated in prose above.

       Non-org edges appear in the diagram for either end's layer, so a
       cross-layer relationship like work_share → work is visible from both. */
    const shown = relationships.filter((r) => {
      const isOrgEdge = r.columns === "org_id";
      if (isOrgEdge && LAYERS[r.to] !== "Tenancy") return false;
      return layerNames.has(r.from) || layerNames.has(r.to);
    });
    if (shown.length === 0) {
      for (const t of layerTables) out.push(`  ${t.name}`);
    } else {
      for (const r of shown) {
        // FK side is the "many" end.
        out.push(`  ${r.from} ||--o{ ${r.to} : "${r.columns}"`);
      }
    }
    out.push("```");
    out.push("");
  }

  // --- Per-table reference -------------------------------------------------
  out.push("## Tables");
  out.push("");

  for (const layer of LAYER_ORDER) {
    const layerTables = tables.filter((t) => LAYERS[t.name] === layer);
    if (layerTables.length === 0) continue;

    out.push(`### ${layer}`);
    out.push("");

    for (const table of layerTables) {
      out.push(`#### \`${table.name}\``);
      out.push("");
      out.push("| Column | Type | Null | Key |");
      out.push("| --- | --- | --- | --- |");

      for (const col of table.columns) {
        const flags: string[] = [];
        if (col.primary) flags.push("PK");
        const fk = table.foreignKeys.find((f) =>
          f.reference().columns.some((c) => c.name === col.name),
        );
        if (fk) {
          const ref = fk.reference();
          flags.push(`FK → ${getTableConfig(ref.foreignTable).name}`);
        }
        out.push(
          `| \`${col.name}\` | \`${escapeCell(col.getSQLType())}\` | ${
            col.notNull ? "no" : "yes"
          } | ${flags.join(", ") || "—"} |`,
        );
      }
      out.push("");

      const indexes = [...table.indexes]
        .map((i) => i.config)
        .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
      if (indexes.length > 0) {
        out.push("Indexes:");
        out.push("");
        for (const idx of indexes) {
          const parts: string[] = [];
          if (idx.unique) parts.push("unique");
          if (idx.where) parts.push("partial");
          if (idx.method && idx.method !== "btree") parts.push(idx.method);
          const suffix = parts.length > 0 ? ` *(${parts.join(", ")})*` : "";
          out.push(`- \`${idx.name}\`${suffix}`);
        }
        out.push("");
      }

      if (table.checks.length > 0) {
        out.push("Check constraints:");
        out.push("");
        for (const chk of [...table.checks].sort((a, b) => a.name.localeCompare(b.name))) {
          out.push(`- \`${chk.name}\``);
        }
        out.push("");
      }
    }
  }

  return { markdown: `${out.join("\n").trimEnd()}\n`, uncategorized };
}
