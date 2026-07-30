import { sql } from "drizzle-orm";
import {
  char,
  date,
  index,
  integer,
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
  deletedAt,
  primaryId,
  updatedAt,
  userRef,
} from "./columns";
import {
  catalogKind,
  entityOrigin,
  linkSource,
  recordingIdentifierScheme,
  releaseType,
  shareCompleteness,
  workIdentifierScheme,
  workRecordingLinkType,
} from "./enums";
import { organization } from "./tenancy";

/* The catalog: works (compositions), recordings, releases, and the identifiers
   and links between them.

   THE central domain distinction, and the one that causes the most expensive
   mistakes if misunderstood: a WORK is the composition (melody, lyrics), a
   RECORDING is one specific recorded performance of it. Thirty recordings of a
   song share one ISWC and have thirty ISRCs. Read docs/domain/glossary.md. */

export const catalog = pgTable(
  "catalog",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    /** Whether these are the org's own rights, administered, or a client's. */
    kind: catalogKind("kind").notNull().default("owned"),
    defaultCurrency: currencyCode("default_currency"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [index("catalog_org_idx").on(t.orgId)],
);

/**
 * A composition. The song itself, independent of any recording of it.
 *
 * Most orgs will have far fewer works than recordings, and a work can exist
 * with no recordings at all (an unreleased song still needs registering).
 */
export const work = pgTable(
  "work",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    catalogId: uuid("catalog_id")
      .notNull()
      .references(() => catalog.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    /**
     * Normalised title, maintained by the application (see
     * `@source/domain` `normalizeTitle`). Trigram-indexed for fuzzy candidate
     * generation — the matching engine's tier T5 depends on this column and its
     * GIN index existing.
     */
    titleNorm: text("title_norm").notNull(),
    /** Alternative and foreign-language titles, as reported by various sources. */
    altTitles: text("alt_titles").array(),
    iswc: char("iswc", { length: 11 }),
    language: char("language", { length: 3 }),
    durationSeconds: integer("duration_seconds"),
    /**
     * Whether the recorded shares are believed complete. Gates the split-sum
     * rule so partially-entered works do not generate noise. See enums.ts.
     */
    shareCompleteness: shareCompleteness("share_completeness").notNull().default("unknown"),
    origin: entityOrigin("origin").notNull().default("manual"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    /* Partial unique: two sources reporting the same ISWC must become a MERGE
       issue surfaced to the user, never an insert failure that blocks ingest. */
    uniqueIndex("work_org_iswc_key")
      .on(t.orgId, t.iswc)
      .where(sql`iswc IS NOT NULL AND deleted_at IS NULL`),
    index("work_org_catalog_idx").on(t.orgId, t.catalogId),
    /* Trigram index for fuzzy title matching. Requires the pg_trgm extension —
       see the migration. This is the index tier T5 of the matcher reads. */
    index("work_title_norm_trgm_idx").using("gin", sql`${t.titleNorm} gin_trgm_ops`),
  ],
);

/** Identifiers for a work, each from a source with its own trust level. */
export const workIdentifier = pgTable(
  "work_identifier",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    workId: uuid("work_id")
      .notNull()
      .references(() => work.id, { onDelete: "cascade" }),
    scheme: workIdentifierScheme("scheme").notNull(),
    /** Canonical form, produced by `@source/domain` parsers. */
    valueNorm: text("value_norm").notNull(),
    /** Exactly as the source wrote it, for display and debugging. */
    valueRaw: text("value_raw"),
    source: text("source"),
    firstSeenAt: createdAt(),
    /** Set when a human or an authoritative lookup confirmed this identifier. */
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("work_identifier_key").on(t.orgId, t.scheme, t.valueNorm, t.workId),
    index("work_identifier_lookup_idx").on(t.orgId, t.scheme, t.valueNorm),
    index("work_identifier_work_idx").on(t.workId),
  ],
);

/**
 * A recording. One specific recorded performance.
 *
 * NOTE THE ABSENCE of a `work_id` column. That is deliberate and important:
 * recordings routinely arrive from a distributor statement before anyone knows
 * which composition they embody, and a medley embodies several. The relationship
 * lives in `work_recording`, many-to-many, with provenance.
 */
export const recording = pgTable(
  "recording",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    catalogId: uuid("catalog_id")
      .notNull()
      .references(() => catalog.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    titleNorm: text("title_norm").notNull(),
    /**
     * What distinguishes six recordings that share a title: "Radio Edit",
     * "Live at X", "Sped Up", "Remastered". Extracted from reported titles by
     * `@source/domain` `parseTitle`. Losing this is how a live version's
     * revenue gets attributed to the studio recording.
     */
    versionLabel: text("version_label"),
    isrc: char("isrc", { length: 12 }),
    displayArtist: text("display_artist"),
    /** Normalised artist tokens for matching. See `@source/domain` artistTokens. */
    artistNorm: text("artist_norm"),
    durationMs: integer("duration_ms"),
    releaseDate: date("release_date"),
    labelName: text("label_name"),
    origin: entityOrigin("origin").notNull().default("manual"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    /* Same reasoning as work.iswc: a duplicate ISRC across two sources is a
       finding (`duplicate_recording`), not an ingest failure. */
    uniqueIndex("recording_org_isrc_key")
      .on(t.orgId, t.isrc)
      .where(sql`isrc IS NOT NULL AND deleted_at IS NULL`),
    index("recording_org_catalog_idx").on(t.orgId, t.catalogId),
    index("recording_title_norm_trgm_idx").using("gin", sql`${t.titleNorm} gin_trgm_ops`),
  ],
);

export const recordingIdentifier = pgTable(
  "recording_identifier",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    recordingId: uuid("recording_id")
      .notNull()
      .references(() => recording.id, { onDelete: "cascade" }),
    scheme: recordingIdentifierScheme("scheme").notNull(),
    valueNorm: text("value_norm").notNull(),
    valueRaw: text("value_raw"),
    source: text("source"),
    firstSeenAt: createdAt(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("recording_identifier_key").on(t.orgId, t.scheme, t.valueNorm, t.recordingId),
    index("recording_identifier_lookup_idx").on(t.orgId, t.scheme, t.valueNorm),
    index("recording_identifier_recording_idx").on(t.recordingId),
  ],
);

/**
 * Which compositions a recording embodies.
 *
 * Many-to-many in both directions, with provenance and confidence. A link that
 * has never been human-confirmed (`confirmedAt IS NULL`) must render
 * differently in the UI from one that has — an inferred link is a hypothesis.
 */
export const workRecording = pgTable(
  "work_recording",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    workId: uuid("work_id")
      .notNull()
      .references(() => work.id, { onDelete: "cascade" }),
    recordingId: uuid("recording_id")
      .notNull()
      .references(() => recording.id, { onDelete: "cascade" }),
    linkType: workRecordingLinkType("link_type").notNull().default("primary"),
    linkSource: linkSource("link_source").notNull().default("user"),
    confidence: confidence("confidence"),
    confirmedByUserId: userRef("confirmed_by_user_id"),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("work_recording_key").on(t.workId, t.recordingId, t.linkType),
    index("work_recording_recording_idx").on(t.orgId, t.recordingId),
    index("work_recording_work_idx").on(t.orgId, t.workId),
  ],
);

/**
 * A release: an album, EP, or single as a *product*.
 *
 * Exists because a meaningful fraction of distributor statements key on
 * UPC + track number and carry no ISRC at all. Without releases, those lines
 * have no path to a recording. This is matching tier T3.
 */
export const release = pgTable(
  "release",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    catalogId: uuid("catalog_id")
      .notNull()
      .references(() => catalog.id, { onDelete: "cascade" }),
    /** Normalised to GTIN-14 so UPC-12/EAN-13/GTIN-14 forms are one value. */
    gtin: char("gtin", { length: 14 }),
    title: text("title").notNull(),
    titleNorm: text("title_norm").notNull(),
    displayArtist: text("display_artist"),
    releaseDate: date("release_date"),
    type: releaseType("type"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    uniqueIndex("release_org_gtin_key")
      .on(t.orgId, t.gtin)
      .where(sql`gtin IS NOT NULL AND deleted_at IS NULL`),
    index("release_org_catalog_idx").on(t.orgId, t.catalogId),
  ],
);

/** Track listing. The (release, disc, track) → recording mapping for tier T3. */
export const releaseTrack = pgTable(
  "release_track",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    releaseId: uuid("release_id")
      .notNull()
      .references(() => release.id, { onDelete: "cascade" }),
    recordingId: uuid("recording_id")
      .notNull()
      .references(() => recording.id, { onDelete: "cascade" }),
    discNo: integer("disc_no").notNull().default(1),
    trackNo: integer("track_no").notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("release_track_position_key").on(t.releaseId, t.discNo, t.trackNo),
    index("release_track_recording_idx").on(t.orgId, t.recordingId),
  ],
);
