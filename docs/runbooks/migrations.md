# Runbook: database migrations

> **Status: partially exercised.** The `db:generate` → read SQL → `db:migrate` → `verify:migration`
> loop has been run for real against a PostgreSQL 17.6 instance, so those steps are tested. The
> Aurora, CI-gating, and rollback sections are still design — correct them the first time they are
> genuinely used.

## Why migrations are gated

The schema holds financial data and third parties' PII. It is also listed as a **Protected Area**
in `CLAUDE.md`, meaning schema changes need explicit approval.

So migrations are never a side effect of deploying code. They are an explicit, reviewed,
separately-triggered step, and production requires an approval.

## Tooling

**Drizzle ORM + drizzle-kit.** Migrations are plain `.sql` files committed to the repo — chosen
specifically because reviewable SQL beats an opaque migration engine for a schema that requires
approval. See [ADR 0003](../adr/0003-postgres-not-dynamodb.md).

```bash
# after editing packages/db/src/schema.ts
corepack pnpm --filter @source/db db:generate    # writes a new .sql migration
corepack pnpm --filter @source/db db:migrate     # applies to the target database
```

`db:generate` and `db:migrate` are uncached Turbo tasks — they touch real state.

## Writing a migration

1. **Edit the schema, then generate.** Never hand-write the migration first; the generated SQL is
   the diff of intent.
2. **Read the generated SQL.** Every time. Drizzle occasionally generates a destructive step
   (drop-and-recreate) where an in-place alter was intended.
3. **Add `COMMENT ON` for every non-obvious column.** This is a project convention: the reasoning
   travels with the schema and shows up in any introspection tool. `work.share_completeness` and
   `work_share.share_basis` are meaningless without it — see
   [../domain/glossary.md](../domain/glossary.md).
4. **Prefer additive changes.** Add a nullable column, backfill, then tighten — rather than a
   rewrite that locks a large table.
5. **Never add a constraint that blocks ingesting true-but-ugly data.** Splits that do not sum to
   100, overlapping terms, and duplicate ISRCs all occur in real catalogs. They are *findings*
   produced by rules, not `CHECK` constraints. A database error on a real statement is a product
   failure.

## Applying

| Environment | How | Approval |
| --- | --- | --- |
| local / dev | `db:migrate` against your own schema | none |
| staging | GitHub Actions, gated step | none |
| production | GitHub Actions, gated step | **required** |

Order matters: for an additive change, migrate **before** deploying code that uses it. For a
removal, deploy code that stops using the column **first**, then migrate in a later release.

## Rollback

**Forward-only by default.** Drizzle does not generate down-migrations, and for a schema holding
financial data an automated reverse migration is more dangerous than it looks — it can discard data
written between deploy and rollback.

If a migration is wrong:

1. **Additive and unused** (a new nullable column): leave it. Harmless.
2. **Additive and wrong**: write a new forward migration that corrects it.
3. **Destructive** (dropped a column, changed a type lossily): this is a **data-loss incident**, not
   a rollback. Restore from Aurora PITR to a new cluster, extract what was lost, and reconcile
   forward. See `restore-from-backup.md` *(written during the M5 restore rehearsal)*.

Case 3 is the reason to read generated SQL before applying it.

## Verifying a migration applied correctly

`db:migrate` exiting 0 proves the statements ran, not that the result is right. Always follow with:

```bash
DATABASE_URL='…' pnpm --filter @source/db verify:migration
```

Nine checks, all of which must read `PASS`. Extend `packages/db/scripts/verify-migration.ts`
whenever a migration adds something worth asserting — an extension, a constraint that must bite, a
column whose type matters.

Migration `0000` passed all nine against PostgreSQL 17.6 on 2026-07-29. See the table in
[../domain/schema.md](../domain/schema.md).

## Before the first production migration

- [x] The generate → review → migrate → verify loop exercised against a real database.
- [ ] The same verification re-run against **Aurora 16.6** (verified so far only on 17.6).
- [ ] Aurora PITR enabled, with the retention window set deliberately.
- [ ] A restore **rehearsed** at least once. An untested backup is not a backup.
- [ ] `restore-from-backup.md` written from that rehearsal.
- [ ] The gated Actions step verified on staging.
