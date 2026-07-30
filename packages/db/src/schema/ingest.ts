import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  char,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import {
  confidence,
  createdAt,
  currencyCode,
  money,
  percent,
  primaryId,
  sha256Hex,
  updatedAt,
  userRef,
} from "./columns";
import {
  aliasKind,
  expectedCadence,
  formatScope,
  fxSource,
  matchMethod,
  matchStatus,
  matchTargetType,
  sourceType,
  statementFileKind,
  statementFileStatus,
  usageType,
} from "./enums";
import { recording, work } from "./catalog";
import { organization } from "./tenancy";

/* Statement ingestion.

   The pipeline this models:
     upload → fingerprint → detect format → [map if unknown] → parse
            → normalise → reconcile → HUMAN COMMIT → match → detect issues

   Two ADRs govern the design here and should be read before changing it:
   - 0008: raw rows are immutable, normalised values are derived and re-derivable
   - 0009: nothing is trusted without an explicit human commit */

/** A configured place statements come from. One org may have several. */
export const sourceAccount = pgTable(
  "source_account",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    /** Stable key, e.g. `distrokid`, `the_mlc`, `ascap`. */
    sourceKey: text("source_key").notNull(),
    sourceType: sourceType("source_type").notNull(),
    displayName: text("display_name").notNull(),
    defaultCurrency: currencyCode("default_currency"),
    /**
     * How often this source is expected to report. Drives the
     * `missing_statement_period` rule — without an expected cadence there is no
     * baseline against which a gap is detectable.
     */
    expectedCadence: expectedCadence("expected_cadence").notNull().default("unknown"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("source_account_org_idx").on(t.orgId)],
);

/**
 * A learned file layout. The answer to format sprawl.
 *
 * Recognised by `headerFingerprint` — a hash of the sorted, normalised header
 * tokens. When a distributor renames one column the fingerprint misses but
 * remains a *near* match, so the user is shown a pre-filled diff rather than a
 * blank mapping screen.
 *
 * Scope matters: a format learned by one org starts `org`-scoped and can be
 * promoted to `global` by an admin once it is known to generalise. That way one
 * user's odd export never silently changes parsing for everyone.
 */
export const statementFormat = pgTable(
  "statement_format",
  {
    id: primaryId(),
    /** Null for a global format not tied to one source key. */
    sourceKey: text("source_key"),
    name: text("name").notNull(),
    version: integer("version").notNull().default(1),
    fileKind: statementFileKind("file_kind").notNull(),
    /** SHA-256 of sorted, normalised header tokens. */
    headerFingerprint: sha256Hex("header_fingerprint").notNull(),
    /** Retained for the near-match diff and for debugging a detection failure. */
    sampleHeaders: text("sample_headers").array(),
    sheetName: text("sheet_name"),
    headerRowIndex: integer("header_row_index").notNull().default(0),
    /** canonical field name → source column name or index. */
    columnMap: jsonb("column_map").notNull(),
    /** Decimal separator, thousands separator, negative style (parens vs minus). */
    numberFormat: jsonb("number_format"),
    dateFormat: text("date_format"),
    encoding: text("encoding"),
    /**
     * Columns dropped AT PARSE TIME, before anything is persisted — payee bank
     * details, tax IDs, addresses. PII minimisation is the cheapest compliance
     * win available, and these columns are never needed for analysis. Note the
     * consequence: they cannot be recovered by a reparse. Deliberate.
     */
    sensitiveFields: text("sensitive_fields").array(),
    scope: formatScope("scope").notNull().default("org"),
    /** Set when scope is `org`. */
    orgId: uuid("org_id").references(() => organization.id, { onDelete: "cascade" }),
    createdByUserId: userRef("created_by_user_id"),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [
    /* An org's own format shadows a global one with the same fingerprint. */
    uniqueIndex("statement_format_fingerprint_scope_key").on(
      t.headerFingerprint,
      t.scope,
      t.orgId,
      t.version,
    ),
    index("statement_format_lookup_idx").on(t.headerFingerprint),
    index("statement_format_source_idx").on(t.sourceKey),
  ],
);

/**
 * One uploaded statement file and its lifecycle.
 *
 * `status` is what governs trust across the whole system: nothing outside the
 * statement detail screen reads lines belonging to a file that is not
 * `committed`. This is why there is no separate staging table — one table plus
 * a status gate is simpler than two schemas that can drift.
 */
export const statementFile = pgTable(
  "statement_file",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    sourceAccountId: uuid("source_account_id").references(() => sourceAccount.id, {
      onDelete: "set null",
    }),
    uploadedByUserId: userRef("uploaded_by_user_id").notNull(),
    originalFilename: text("original_filename").notNull(),
    mime: text("mime"),
    byteSize: bigint("byte_size", { mode: "number" }),
    /** Content hash, for duplicate-upload detection within an org. */
    sha256: sha256Hex("sha256").notNull(),
    /** S3 key. Format `{org_id}/{uuid}` — never the original filename, which leaks artist names. */
    storageKey: text("storage_key").notNull(),
    status: statementFileStatus("status").notNull().default("uploaded"),
    detectedFormatId: uuid("detected_format_id").references(() => statementFormat.id, {
      onDelete: "set null",
    }),
    detectionConfidence: confidence("detection_confidence"),
    periodStart: date("period_start"),
    periodEnd: date("period_end"),
    statementCurrency: currencyCode("statement_currency"),
    /** The total the FILE ITSELF declares, when it declares one. */
    reportedTotal: money("reported_total"),
    /** The total WE computed by summing parsed lines. */
    parsedTotal: money("parsed_total"),
    rowCount: integer("row_count"),
    error: jsonb("error"),
    uploadedAt: createdAt(),
    /* The commit gate. Set only by an explicit human action, and audited. */
    committedAt: timestamp("committed_at", { withTimezone: true }),
    committedByUserId: userRef("committed_by_user_id"),
  },
  (t) => [
    /* Same file uploaded twice is caught here rather than silently double-counted. */
    uniqueIndex("statement_file_org_sha_key").on(t.orgId, t.sha256),
    index("statement_file_org_status_idx").on(t.orgId, t.status),
    index("statement_file_org_period_idx").on(t.orgId, t.periodStart, t.periodEnd),
    index("statement_file_source_idx").on(t.orgId, t.sourceAccountId),
  ],
);

/**
 * One row of one statement. The hot, high-volume table.
 *
 * `bigint` identity primary key, not a uuid: this table grows without bound
 * (one small catalog produces tens of thousands of rows per month), is written
 * in bulk, and is always read in insertion or period order. A time-sortable
 * integer gives index locality that a random uuid destroys.
 *
 * `raw` holds the source row VERBATIM, forever. Every normalised column below
 * is derived from it and can be recomputed — so a parser bug is a bug, not an
 * incident. See docs/adr/0008-raw-immutable-normalized-derived.md.
 *
 * Every normalised column is nullable, because every source omits something.
 * A PRO statement has no ISRC; a distributor statement has no writer.
 */
export const statementLine = pgTable(
  "statement_line",
  {
    id: bigint("id", { mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    statementFileId: uuid("statement_file_id")
      .notNull()
      .references(() => statementFile.id, { onDelete: "cascade" }),
    lineNo: integer("line_no").notNull(),

    /** The source row, verbatim, minus columns marked sensitive at parse time. */
    raw: jsonb("raw").notNull(),

    // --- Normalised projection (all nullable by design) ---
    reportedTitle: text("reported_title"),
    reportedArtist: text("reported_artist"),
    reportedWriter: text("reported_writer"),
    reportedPublisher: text("reported_publisher"),
    reportedIsrc: char("reported_isrc", { length: 12 }),
    reportedIswc: char("reported_iswc", { length: 11 }),
    reportedGtin: char("reported_gtin", { length: 14 }),
    reportedTrackNo: integer("reported_track_no"),
    /**
     * The source's own track identifier. Gold for matching: it is stable across
     * periods, so one confirmed alias auto-matches every future statement from
     * that source. This column is why month two is nearly free.
     */
    reportedSourceTrackId: text("reported_source_track_id"),

    platform: text("platform"),
    storeService: text("store_service"),
    countryCode: char("country_code", { length: 2 }),
    usageType: usageType("usage_type").notNull().default("unknown"),
    quantity: numeric("quantity", { precision: 18, scale: 4 }),
    periodStart: date("period_start"),
    periodEnd: date("period_end"),

    grossAmount: money("gross_amount"),
    netAmount: money("net_amount"),
    currency: currencyCode("currency"),
    fxRate: numeric("fx_rate", { precision: 18, scale: 8 }),
    amountBase: money("amount_base"),
    fxSource: fxSource("fx_source").notNull().default("none"),
    sharePctReported: percent("share_pct_reported"),

    /**
     * A correction of an earlier overpayment. Must be excluded from "revenue"
     * tiles and shown explicitly — silently netting reversals into revenue hides
     * the reason for a drop the user can see in their own statement.
     */
    isReversal: boolean("is_reversal").notNull().default(false),

    // --- Matching ---
    matchStatus: matchStatus("match_status").notNull().default("unmatched"),
    matchedRecordingId: uuid("matched_recording_id").references(() => recording.id, {
      onDelete: "set null",
    }),
    matchedWorkId: uuid("matched_work_id").references(() => work.id, { onDelete: "set null" }),
    matchConfidence: confidence("match_confidence"),
    matchMethod: matchMethod("match_method"),
    /**
     * Top candidates with their scores and the reason each scored what it did.
     * This is the "why" behind a match — it powers the review UI and makes a
     * bad match debuggable six months later.
     */
    matchCandidates: jsonb("match_candidates"),
    matchedAt: timestamp("matched_at", { withTimezone: true }),
    matchedByUserId: userRef("matched_by_user_id"),
  },
  (t) => [
    uniqueIndex("statement_line_file_line_key").on(t.statementFileId, t.lineNo),
    /* The review queue reads this: only unmatched and needs_review rows. */
    index("statement_line_review_idx")
      .on(t.orgId, t.matchStatus)
      .where(sql`match_status IN ('unmatched', 'needs_review')`),
    index("statement_line_isrc_idx").on(t.orgId, t.reportedIsrc),
    index("statement_line_source_track_idx").on(t.orgId, t.reportedSourceTrackId),
    /* Revenue rollups by recording and period. */
    index("statement_line_recording_period_idx").on(t.orgId, t.matchedRecordingId, t.periodStart),
    index("statement_line_work_period_idx").on(t.orgId, t.matchedWorkId, t.periodStart),
  ],
);

/**
 * Observability for a pipeline that will fail in unanticipated ways.
 *
 * One row per pipeline step per file, so "why did this file produce these
 * numbers" is answerable without adding logging after the fact.
 */
export const ingestRun = pgTable(
  "ingest_run",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    statementFileId: uuid("statement_file_id")
      .notNull()
      .references(() => statementFile.id, { onDelete: "cascade" }),
    step: text("step").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    inputCount: integer("input_count"),
    outputCount: integer("output_count"),
    error: jsonb("error"),
  },
  (t) => [index("ingest_run_file_idx").on(t.statementFileId, t.startedAt)],
);

/**
 * A confirmed mapping from a source's identifier to one of our entities.
 *
 * The compounding-value mechanic of the whole product. Confirming a match in
 * the review queue writes a row here, and the queue never asks about that
 * identifier again — including in next month's statement. This is what turns a
 * painful first month into a nearly-automatic second month, and it is why M3's
 * exit criterion is measured on the SECOND statement from a source.
 */
export const matchAlias = pgTable(
  "match_alias",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    /** Aliases are per-source: the same track id means different things elsewhere. */
    sourceAccountId: uuid("source_account_id").references(() => sourceAccount.id, {
      onDelete: "cascade",
    }),
    aliasKind: aliasKind("alias_kind").notNull(),
    aliasValueNorm: text("alias_value_norm").notNull(),
    targetType: matchTargetType("target_type").notNull(),
    targetId: uuid("target_id").notNull(),
    confirmedByUserId: userRef("confirmed_by_user_id"),
    confirmedAt: createdAt(),
    /** Incremented on use, so the value of the learning is measurable. */
    hitCount: integer("hit_count").notNull().default(0),
  },
  (t) => [
    uniqueIndex("match_alias_key").on(t.orgId, t.sourceAccountId, t.aliasKind, t.aliasValueNorm),
    index("match_alias_target_idx").on(t.orgId, t.targetType, t.targetId),
  ],
);
