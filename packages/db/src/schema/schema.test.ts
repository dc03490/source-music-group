import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { is } from "drizzle-orm";
import { getTableConfig, PgTable } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";
import * as schema from "./index";

/* Schema invariant tests.

   There is no database available in CI or locally, so the migration cannot be
   applied here. What CAN be verified without one is everything that would
   otherwise fail at apply time in production, plus the structural invariants
   the whole security and compliance model rests on.

   The most valuable check below is the COMMENT ON cross-reference: 39 comments
   were hand-written into the generated migration, and one referring to a column
   that does not exist would abort the migration mid-run.

   Still unverified until a real database exists: that the SQL executes. Applying
   this migration to a throwaway Postgres is the first thing to do once Aurora
   (or any local Postgres) is available. */

const MIGRATION = readFileSync(
  fileURLToPath(new URL("../../migrations/0000_init.sql", import.meta.url)),
  "utf8",
);

/* The migration carries an explanatory `--` comment header that itself mentions
   `gin_trgm_ops`. Any positional check has to look at executable SQL only, or it
   matches the prose describing the problem instead of the statement solving it.
   (This test initially did exactly that and failed for the wrong reason.) */
const MIGRATION_SQL = MIGRATION.split(/\r?\n/)
  .filter((line) => !line.trimStart().startsWith("--"))
  .join("\n");

/** Every exported Drizzle table, with its introspected config.
 *
 * `is()` is Drizzle's own runtime type guard, which narrows correctly. A
 * hand-written type predicate over `Object.values(schema)` does not typecheck,
 * because that union also contains enums and column helpers. */
const tables = Object.values(schema)
  .filter((v) => is(v, PgTable))
  .map((t) => getTableConfig(t));

const tableNames = new Set(tables.map((t) => t.name));

describe("schema introspection", () => {
  it("exports the expected number of tables", () => {
    // Guards against an export being dropped from schema/index.ts by accident.
    // 4 tenancy + 8 catalog + 6 parties + 6 ingest + 3 analysis.
    expect(tables.length).toBe(27);
  });

  it("includes every layer of the domain", () => {
    for (const name of [
      "organization",
      "membership",
      "invitation",
      "audit_event",
      "catalog",
      "work",
      "recording",
      "work_recording",
      "release",
      "release_track",
      "party",
      "work_share",
      "recording_share",
      "registration",
      "source_account",
      "statement_format",
      "statement_file",
      "statement_line",
      "match_alias",
      "issue",
      "recommendation",
    ]) {
      expect(tableNames, `missing table: ${name}`).toContain(name);
    }
  });
});

describe("tenant isolation", () => {
  /* `organization` IS the tenant, so it has no org_id. Everything else must
     carry one — including join tables — or row-level security and the
     tenant-scoped client cannot constrain it. */
  const exempt = new Set(["organization"]);

  it("gives every table an org_id", () => {
    const missing = tables
      .filter((t) => !exempt.has(t.name))
      .filter((t) => !t.columns.some((c) => c.name === "org_id"))
      .map((t) => t.name);

    expect(missing, `tables without org_id: ${missing.join(", ")}`).toEqual([]);
  });

  /* Two tables legitimately have a NULLABLE org_id, and both are deliberate.
     Anyone writing the row-level security policies must handle them explicitly
     rather than filtering on `org_id = current_setting(...)` alone:

     - audit_event: nullable so an organisation can be hard-deleted without
       destroying its audit history.
     - statement_format: a `global` format is shared across all orgs and belongs
       to none, so it has no org_id. RLS must allow reading global formats while
       still restricting org-scoped ones. */
  const nullableOrgIdByDesign = new Set(["audit_event", "statement_format"]);

  it("makes org_id NOT NULL except where nullability is deliberate", () => {
    const nullable = tables
      .filter((t) => !exempt.has(t.name) && !nullableOrgIdByDesign.has(t.name))
      .filter((t) => {
        const col = t.columns.find((c) => c.name === "org_id");
        return col && !col.notNull;
      })
      .map((t) => t.name);

    expect(nullable, `unexpectedly nullable org_id in: ${nullable.join(", ")}`).toEqual([]);
  });

  it("keeps the nullable-org_id exceptions to the documented set", () => {
    /* If a new table appears here, it needs an RLS decision, not just a test
       update. Failing loudly is the point. */
    const actuallyNullable = tables
      .filter((t) => !exempt.has(t.name))
      .filter((t) => {
        const col = t.columns.find((c) => c.name === "org_id");
        return col && !col.notNull;
      })
      .map((t) => t.name)
      .sort();

    expect(actuallyNullable).toEqual([...nullableOrgIdByDesign].sort());
  });
});

describe("money columns", () => {
  /* Every monetary column must be numeric(18,6) — never a float, and never a
     narrower scale. Per-stream rates are fractions of a cent, so rounding at
     two decimal places loses real money across millions of rows. */
  const MONEY_COLUMNS: ReadonlyArray<[string, string]> = [
    ["statement_file", "reported_total"],
    ["statement_file", "parsed_total"],
    ["statement_line", "gross_amount"],
    ["statement_line", "net_amount"],
    ["statement_line", "amount_base"],
    ["issue", "estimated_value"],
  ];

  it.each(MONEY_COLUMNS)("%s.%s is numeric with scale 6", (tableName, columnName) => {
    const table = tables.find((t) => t.name === tableName);
    const column = table?.columns.find((c) => c.name === columnName);
    expect(column, `${tableName}.${columnName} not found`).toBeDefined();
    expect(column!.getSQLType()).toBe("numeric(18, 6)");
  });

  it("pairs every monetary column with a currency on the same table", () => {
    for (const [tableName] of MONEY_COLUMNS) {
      const table = tables.find((t) => t.name === tableName);
      const hasCurrency = table?.columns.some((c) => c.name.includes("currency"));
      expect(hasCurrency, `${tableName} has money but no currency column`).toBe(true);
    }
  });
});

describe("compliance controls in the migration", () => {
  it("enforces that an estimated value carries a basis and confidence", () => {
    /* THE compliance control. A monetary figure cannot be persisted without
       recording how it was derived. See docs/compliance/claims-lexicon.md. */
    expect(MIGRATION).toContain("issue_value_requires_basis");
    expect(MIGRATION).toMatch(
      /estimated_value IS NULL OR \(estimate_basis IS NOT NULL AND estimate_confidence IS NOT NULL\)/,
    );
  });

  it("enforces that an estimated value carries a currency", () => {
    expect(MIGRATION).toContain("issue_value_requires_currency");
  });

  it("declares value_is_estimate NOT NULL", () => {
    const issue = tables.find((t) => t.name === "issue");
    const col = issue?.columns.find((c) => c.name === "value_is_estimate");
    expect(col?.notNull).toBe(true);
  });
});

describe("migration correctness", () => {
  it("creates the pg_trgm extension before any trigram index uses it", () => {
    /* Regression guard: drizzle-kit does NOT emit CREATE EXTENSION, so the
       generated migration would fail on a fresh database — the gin_trgm_ops
       operator class would not exist. This was verified to be missing and added
       by hand. */
    const extensionAt = MIGRATION_SQL.indexOf("CREATE EXTENSION IF NOT EXISTS pg_trgm");
    const firstTrigramAt = MIGRATION_SQL.indexOf("gin_trgm_ops");

    expect(extensionAt, "CREATE EXTENSION pg_trgm is missing").toBeGreaterThanOrEqual(0);
    expect(firstTrigramAt).toBeGreaterThanOrEqual(0);
    expect(extensionAt, "extension must be created before it is used").toBeLessThan(firstTrigramAt);
  });

  it("creates a trigram index for every column the fuzzy matcher searches", () => {
    for (const idx of [
      "work_title_norm_trgm_idx",
      "recording_title_norm_trgm_idx",
      "party_name_norm_trgm_idx",
    ]) {
      expect(MIGRATION, `missing index: ${idx}`).toContain(idx);
    }
  });

  it("has no leftover printf-style escapes in comment text", () => {
    // A quoted heredoc does not expand %%, so it would appear literally.
    expect(MIGRATION).not.toContain("%%");
  });

  it("only comments on tables that exist", () => {
    const targets = [...MIGRATION.matchAll(/COMMENT ON TABLE "([^"]+)"/g)].map((m) => m[1]!);
    expect(targets.length).toBeGreaterThan(5);

    const unknown = targets.filter((t) => !tableNames.has(t));
    expect(unknown, `COMMENT ON TABLE for unknown tables: ${unknown.join(", ")}`).toEqual([]);
  });

  it("only comments on columns that exist", () => {
    /* The highest-value check here. A COMMENT ON COLUMN naming a column that
       does not exist aborts the migration mid-run, and there is no database
       available to catch it before then. */
    const targets = [...MIGRATION.matchAll(/COMMENT ON COLUMN "([^"]+)"\."([^"]+)"/g)].map(
      (m) => [m[1]!, m[2]!] as const,
    );
    expect(targets.length).toBeGreaterThan(20);

    const unknown: string[] = [];
    for (const [tableName, columnName] of targets) {
      const table = tables.find((t) => t.name === tableName);
      if (!table) {
        unknown.push(`${tableName} (unknown table)`);
        continue;
      }
      if (!table.columns.some((c) => c.name === columnName)) {
        unknown.push(`${tableName}.${columnName}`);
      }
    }

    expect(unknown, `COMMENT ON COLUMN for unknown columns: ${unknown.join(", ")}`).toEqual([]);
  });

  it("escapes apostrophes in every comment string", () => {
    /* An unescaped apostrophe terminates the SQL string early and breaks the
       statement. Inside a COMMENT ON body, every ' must be doubled. */
    const bodies = [...MIGRATION.matchAll(/COMMENT ON [^']*'((?:[^']|'')*)'/g)].map((m) => m[1]!);
    expect(bodies.length).toBeGreaterThan(20);

    for (const body of bodies) {
      // After removing legitimate '' pairs, no bare apostrophe may remain.
      expect(body.replace(/''/g, "")).not.toContain("'");
    }
  });
});

describe("soft delete", () => {
  it("keeps unique indexes partial on soft-deletable tables", () => {
    /* If a table can be soft-deleted, its unique indexes must exclude deleted
       rows — otherwise deleting a work and re-creating it with the same ISWC
       collides with a row the user believes is gone. */
    const softDeletable = tables.filter((t) => t.columns.some((c) => c.name === "deleted_at"));
    expect(softDeletable.length).toBeGreaterThan(5);

    const offenders: string[] = [];
    for (const table of softDeletable) {
      for (const index of table.indexes) {
        const cfg = index.config;
        if (!cfg.unique) continue;
        if (!cfg.where) offenders.push(`${table.name}.${cfg.name}`);
      }
    }

    expect(
      offenders,
      `unique indexes on soft-deletable tables without a WHERE clause: ${offenders.join(", ")}`,
    ).toEqual([]);
  });
});
