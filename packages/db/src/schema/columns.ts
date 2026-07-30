import { sql } from "drizzle-orm";
import { char, numeric, timestamp, uuid } from "drizzle-orm/pg-core";

/* Shared column definitions, so the conventions below are impossible to get
   wrong by hand in twenty-five table definitions. */

/**
 * Primary key for entity tables.
 *
 * `gen_random_uuid()` (v4), not UUIDv7. Time-sortable IDs were considered for
 * index locality, but Aurora PostgreSQL 16 has no native `uuidv7()`, and
 * generating in the application means any insert outside Drizzle (a backfill, a
 * raw SQL fix) silently loses the default. The locality argument only really
 * matters for the hot, high-volume table — and `statement_line` uses a
 * `bigint` identity precisely for that reason. Entity tables are low-volume, so
 * v4 with a database-side default is the safer trade.
 */
export const primaryId = () => uuid("id").primaryKey().defaultRandom();

/**
 * Money. NEVER a float, and never without its currency.
 *
 * `numeric(18,6)`: six decimal places because per-stream rates are fractions of
 * a cent and rounding at two places loses real money across millions of rows.
 * Drizzle returns `numeric` as a string, which is correct — it must be handed to
 * `decimal.js` at the boundary, never to `Number()`.
 */
export const money = (name: string) => numeric(name, { precision: 18, scale: 6 });

/** A percentage share, e.g. 33.3333. Same no-float rule applies. */
export const percent = (name: string) => numeric(name, { precision: 7, scale: 4 });

/** A 0.000–1.000 confidence score. */
export const confidence = (name: string) => numeric(name, { precision: 4, scale: 3 });

/** ISO 4217 currency code, always alongside an amount. */
export const currencyCode = (name = "currency") => char(name, { length: 3 });

/** Creation timestamp, with time zone. All timestamps in this schema are tz-aware. */
export const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

export const updatedAt = () => timestamp("updated_at", { withTimezone: true });

/**
 * Soft-delete marker.
 *
 * Soft delete first, then a real hard-delete job purges rows and their S3
 * objects on a documented SLA. Every unique index that could collide with a
 * deleted row must be partial: `WHERE deleted_at IS NULL`.
 */
export const deletedAt = () => timestamp("deleted_at", { withTimezone: true });

/** Cognito `sub`. Not a foreign key — user identity lives in Cognito, not here. */
export const userRef = (name: string) => char(name, { length: 64 });

/** A SHA-256 hex digest. Used for file dedupe and hashed bearer tokens. */
export const sha256Hex = (name: string) => char(name, { length: 64 });

/**
 * Predicate for partial indexes that must ignore soft-deleted rows.
 *
 * Every unique index on a soft-deletable table needs this, or deleting a row
 * and re-creating it with the same natural key fails on a constraint against a
 * row the user believes is gone.
 */
export const notDeleted = () => sql`deleted_at IS NULL`;
