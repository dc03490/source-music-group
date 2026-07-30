import postgres from "postgres";

/* Post-migration verification.
 *
 *   DATABASE_URL='postgres://…' pnpm --filter @source/db verify:migration
 *
 * `drizzle-kit migrate` exiting 0 proves the statements ran. It does NOT prove
 * the result is what we intended. This asserts the nine things that could
 * plausibly be wrong, and exits non-zero if any of them are.
 *
 * Written in TypeScript rather than plain SQL deliberately: a .sql file needs
 * psql, which is not installed on the machines this project is developed on, so
 * a SQL-only check would in practice never be run.
 *
 * Check 5 is the important one. It does not confirm the compliance constraint
 * EXISTS — it tries to insert an unexplained monetary value and asserts the
 * database refuses it. A constraint nobody has watched reject anything is not
 * known to work.
 */

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = postgres(url, { max: 1, connect_timeout: 20, idle_timeout: 5, onnotice: () => {} });

interface Check {
  readonly name: string;
  readonly run: () => Promise<{ pass: boolean; detail: string }>;
}

const checks: Check[] = [
  {
    name: "27 tables created",
    run: async () => {
      const [row] = await sql<{ n: number }[]>`
        SELECT count(*)::int AS n
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
          AND table_name NOT LIKE '\\_\\_drizzle%'`;
      const n = row?.n ?? 0;
      return { pass: n === 27, detail: `${n} tables (expected 27)` };
    },
  },
  {
    name: "pg_trgm extension installed",
    run: async () => {
      const rows = await sql`SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm'`;
      return {
        pass: rows.length === 1,
        detail: rows.length === 1 ? "present" : "MISSING — trigram indexes cannot exist",
      };
    },
  },
  {
    name: "3 GIN trigram indexes exist",
    run: async () => {
      const rows = await sql<{ indexname: string }[]>`
        SELECT indexname FROM pg_indexes
        WHERE schemaname = 'public' AND indexdef LIKE '%gin_trgm_ops%'
        ORDER BY indexname`;
      return {
        pass: rows.length === 3,
        detail: `${rows.length}: ${rows.map((r) => r.indexname).join(", ") || "none"}`,
      };
    },
  },
  {
    name: "compliance CHECK constraints present",
    run: async () => {
      const rows = await sql<{ conname: string }[]>`
        SELECT conname FROM pg_constraint
        WHERE conrelid = 'issue'::regclass
          AND contype = 'c'
          AND conname LIKE 'issue_value_requires%'
        ORDER BY conname`;
      return {
        pass: rows.length === 2,
        detail: rows.map((r) => r.conname).join(", ") || "none",
      };
    },
  },
  {
    name: "compliance CHECK actually rejects an unexplained value",
    run: async () => {
      const slug = `verify-${Math.random().toString(36).slice(2, 10)}`;
      const [org] = await sql<{ id: string }[]>`
        INSERT INTO organization (created_by_user_id, name, slug)
        VALUES ('verify-script', 'Verify Co', ${slug})
        RETURNING id`;
      const orgId = org!.id;

      let refused = false;
      try {
        await sql`
          INSERT INTO issue (
            org_id, rule_key, ruleset_version, severity, subject_type,
            title, evidence, estimated_value, estimated_currency, fingerprint
          ) VALUES (
            ${orgId}, 'verify_probe', 'v0', 'low', 'organization',
            'probe', '{}'::jsonb, 1234.56, 'USD', ${`probe-${slug}`}
          )`;
      } catch (err) {
        // 23514 = check_violation
        refused = (err as { code?: string }).code === "23514";
      } finally {
        await sql`DELETE FROM issue WHERE org_id = ${orgId}`;
        await sql`DELETE FROM organization WHERE id = ${orgId}`;
      }

      return {
        pass: refused,
        detail: refused
          ? "insert refused by check_violation, as intended"
          : "ACCEPTED an unexplained monetary value — the control does not work",
      };
    },
  },
  {
    name: "COMMENT ON documentation landed",
    run: async () => {
      const [row] = await sql<{ n: number }[]>`
        SELECT count(*)::int AS n
        FROM pg_description d
        JOIN pg_class c ON c.oid = d.objoid
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'`;
      const n = row?.n ?? 0;
      return { pass: n >= 30, detail: `${n} comments (expected >= 30)` };
    },
  },
  {
    name: "partial unique indexes on soft-deletable tables",
    run: async () => {
      const [row] = await sql<{ n: number }[]>`
        SELECT count(*)::int AS n FROM pg_indexes
        WHERE schemaname = 'public'
          AND indexdef LIKE '%UNIQUE%'
          AND indexdef LIKE '%deleted_at IS NULL%'`;
      const n = row?.n ?? 0;
      return { pass: n >= 5, detail: `${n} partial unique indexes (expected >= 5)` };
    },
  },
  {
    name: "money columns are numeric(18,6)",
    run: async () => {
      const rows = await sql<{ t: string; c: string; p: number; s: number }[]>`
        SELECT table_name AS t, column_name AS c,
               numeric_precision AS p, numeric_scale AS s
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND column_name IN ('reported_total','parsed_total','gross_amount',
                              'net_amount','amount_base','estimated_value')
          AND NOT (numeric_precision = 18 AND numeric_scale = 6)`;
      return {
        pass: rows.length === 0,
        detail:
          rows.length === 0
            ? "all correct"
            : rows.map((r) => `${r.t}.${r.c} is (${r.p},${r.s})`).join(", "),
      };
    },
  },
  {
    name: "every table except organization has org_id",
    run: async () => {
      const rows = await sql<{ table_name: string }[]>`
        SELECT t.table_name FROM information_schema.tables t
        WHERE t.table_schema = 'public'
          AND t.table_type = 'BASE TABLE'
          AND t.table_name <> 'organization'
          AND t.table_name NOT LIKE '\\_\\_drizzle%'
          AND NOT EXISTS (
            SELECT 1 FROM information_schema.columns c
            WHERE c.table_schema = 'public'
              AND c.table_name = t.table_name
              AND c.column_name = 'org_id')`;
      return {
        pass: rows.length === 0,
        detail: rows.length === 0 ? "all covered" : rows.map((r) => r.table_name).join(", "),
      };
    },
  },
];

let failures = 0;

try {
  const [meta] = await sql<{ v: string; db: string }[]>`
    SELECT version() AS v, current_database() AS db`;
  console.log(`Connected to ${meta!.db} — ${meta!.v.split(",")[0]}\n`);

  for (const [i, check] of checks.entries()) {
    let result: { pass: boolean; detail: string };
    try {
      result = await check.run();
    } catch (err) {
      result = { pass: false, detail: `threw: ${(err as Error).message}` };
    }
    if (!result.pass) failures += 1;
    const label = result.pass ? "PASS" : "FAIL";
    console.log(`${label}  ${i + 1}. ${check.name}`);
    console.log(`      ${result.detail}`);
  }

  console.log(
    `\n${checks.length - failures}/${checks.length} checks passed.` +
      (failures > 0 ? " Migration result is NOT correct." : " Migration verified."),
  );
} catch (err) {
  console.error(`Fatal: ${(err as Error).message}`);
  failures = 1;
} finally {
  await sql.end({ timeout: 5 });
}

process.exit(failures > 0 ? 1 : 0);
