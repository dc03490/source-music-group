import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createdAt, deletedAt, notDeleted, percent, primaryId, updatedAt, userRef } from "./columns";
import {
  partyIdentifierScheme,
  partyKind,
  recordingRightType,
  recordingShareRole,
  registrationSource,
  registrationStatus,
  registrationSubject,
  shareBasis,
  shareSource,
  society,
  workRightType,
  workShareRole,
} from "./enums";
import { recording, work } from "./catalog";
import { organization } from "./tenancy";

/* Parties, ownership shares, and registrations.

   THIS FILE CONTAINS THE MOST DOMAIN-SENSITIVE MODELLING IN THE SCHEMA.
   Before changing `work_share`, read docs/domain/glossary.md — specifically the
   sections on split sums, ownership vs collection, and territory/term scoping.
   Every field on that table exists because a plausible simplification of it
   produces confidently wrong findings. */

/**
 * Any interested person or company: writer, publisher, producer, label, society.
 *
 * Identified by IPI, not by name. Two different writers called "John Smith" is
 * routine, not an edge case.
 */
export const party = pgTable(
  "party",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    /** "Smith, John" — how societies alphabetise. */
    sortName: text("sort_name"),
    nameNorm: text("name_norm").notNull(),
    kind: partyKind("kind").notNull(),
    /**
     * Does this party represent the organisation itself?
     *
     * Load-bearing for the `self_party_absent` rule, which answers "am I even
     * recorded as having an interest in this work?" — a critical finding that
     * is impossible to compute without knowing which parties are "us".
     */
    isSelf: boolean("is_self").notNull().default(false),
    notes: text("notes"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    index("party_org_idx").on(t.orgId),
    index("party_name_norm_trgm_idx").using("gin", sql`${t.nameNorm} gin_trgm_ops`),
    index("party_org_self_idx").on(t.orgId, t.isSelf).where(sql`is_self = true`),
  ],
);

export const partyIdentifier = pgTable(
  "party_identifier",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    partyId: uuid("party_id")
      .notNull()
      .references(() => party.id, { onDelete: "cascade" }),
    scheme: partyIdentifierScheme("scheme").notNull(),
    /** IPI/CAE normalised to 11 zero-padded digits. See `@source/domain` parseIpi. */
    valueNorm: text("value_norm").notNull(),
    valueRaw: text("value_raw"),
    source: text("source"),
    firstSeenAt: createdAt(),
  },
  (t) => [
    uniqueIndex("party_identifier_key").on(t.orgId, t.scheme, t.valueNorm, t.partyId),
    index("party_identifier_lookup_idx").on(t.orgId, t.scheme, t.valueNorm),
  ],
);

/**
 * A party's society membership over time.
 *
 * Time-scoped because writers change PROs. A 2023 statement must be interpreted
 * against the affiliation that was in force in 2023, not today's — otherwise
 * historical revenue appears to have come from the wrong society.
 */
export const partyAffiliation = pgTable(
  "party_affiliation",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    partyId: uuid("party_id")
      .notNull()
      .references(() => party.id, { onDelete: "cascade" }),
    society: society("society").notNull(),
    /** Whether affiliated as a writer or a publisher — a party can be both. */
    role: text("role").notNull(),
    memberId: text("member_id"),
    effectiveFrom: date("effective_from"),
    effectiveTo: date("effective_to"),
    createdAt: createdAt(),
  },
  (t) => [index("party_affiliation_party_idx").on(t.orgId, t.partyId)],
);

/**
 * A share in a COMPOSITION. The most carefully modelled table in the schema.
 *
 * Each field below exists to prevent a specific class of wrong finding:
 *
 * - `shareBasis` — performing rights are conventionally writer-side 100% AND
 *   publisher-side 100%, two separate universes. Without this discriminator a
 *   "must sum to 100" check fires on every correctly-entered work.
 * - `ownershipPct` vs `collectionPct` — owning 50% while collecting 100% under
 *   an admin deal is normal. One number cannot express both, and conflating
 *   them produces false "under-collecting" findings.
 * - `territory` + `territoryExcludes` — "World except US" is the single most
 *   common real-world expression. A flat country list is tidier but loses the
 *   intent the paperwork actually states.
 * - `termStart`/`termEnd` — shares are interval data and reversion happens.
 *
 * Deliberately NO exclusion constraint on overlapping terms: real catalogs
 * contain overlaps, and blocking the insert would prevent recording the truth.
 * Overlaps are surfaced by the `split_overlap_conflict` rule instead.
 */
export const workShare = pgTable(
  "work_share",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    workId: uuid("work_id")
      .notNull()
      .references(() => work.id, { onDelete: "cascade" }),
    partyId: uuid("party_id")
      .notNull()
      .references(() => party.id, { onDelete: "restrict" }),
    role: workShareRole("role").notNull(),
    rightType: workRightType("right_type").notNull().default("all"),
    /** Which 100% universe this share belongs to. See enums.ts. */
    shareBasis: shareBasis("share_basis").notNull(),
    ownershipPct: percent("ownership_pct"),
    /** May legitimately differ from ownership under an administration deal. */
    collectionPct: percent("collection_pct"),
    /** `WORLD`, an ISO 3166-1 alpha-2 code, or a TIS code. */
    territory: text("territory").notNull().default("WORLD"),
    /** Carve-outs, e.g. `["US"]` for "World except US". */
    territoryExcludes: text("territory_excludes").array(),
    termStart: date("term_start"),
    termEnd: date("term_end"),
    source: shareSource("source").notNull().default("user"),
    /** Storage key of the split sheet or contract that evidences this share. */
    evidenceRef: text("evidence_ref"),
    confirmedByUserId: userRef("confirmed_by_user_id"),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    index("work_share_work_idx").on(t.orgId, t.workId).where(notDeleted()),
    index("work_share_party_idx").on(t.orgId, t.partyId),
    /* The grouping the split-sum rule aggregates over. */
    index("work_share_rule_idx").on(t.orgId, t.workId, t.rightType, t.shareBasis),
  ],
);

/** A share in a RECORDING (master side). Same scoping concerns as work_share. */
export const recordingShare = pgTable(
  "recording_share",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    recordingId: uuid("recording_id")
      .notNull()
      .references(() => recording.id, { onDelete: "cascade" }),
    partyId: uuid("party_id")
      .notNull()
      .references(() => party.id, { onDelete: "restrict" }),
    role: recordingShareRole("role").notNull(),
    rightType: recordingRightType("right_type").notNull().default("master_use"),
    ownershipPct: percent("ownership_pct"),
    collectionPct: percent("collection_pct"),
    territory: text("territory").notNull().default("WORLD"),
    territoryExcludes: text("territory_excludes").array(),
    termStart: date("term_start"),
    termEnd: date("term_end"),
    source: shareSource("source").notNull().default("user"),
    evidenceRef: text("evidence_ref"),
    confirmedByUserId: userRef("confirmed_by_user_id"),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    index("recording_share_recording_idx").on(t.orgId, t.recordingId).where(notDeleted()),
    index("recording_share_party_idx").on(t.orgId, t.partyId),
  ],
);

/**
 * Registration status of a work or recording with a society or registry.
 *
 * IMPORTANT: Phase 1 has NO write access to any registry. Every row here is
 * user-asserted, inferred from a statement's existence, or read from a public
 * search — which is why `source` is not optional and is rendered on every
 * registration row in the UI. Presenting an inferred status as authoritative
 * would be a claim we cannot support.
 */
export const registration = pgTable(
  "registration",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    /** Polymorphic: a work registers with a PRO, a recording with SoundExchange. */
    subjectType: registrationSubject("subject_type").notNull(),
    subjectId: uuid("subject_id").notNull(),
    registry: society("registry").notNull(),
    externalId: text("external_id"),
    status: registrationStatus("status").notNull().default("unknown"),
    /** What the registry reported the shares to be, for comparison against ours. */
    registeredSharesSnapshot: jsonb("registered_shares_snapshot"),
    evidenceStorageKey: text("evidence_storage_key"),
    source: registrationSource("source").notNull(),
    lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }),
    checkedBy: userRef("checked_by"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("registration_subject_registry_key").on(
      t.orgId,
      t.subjectType,
      t.subjectId,
      t.registry,
    ),
    index("registration_subject_idx").on(t.orgId, t.subjectType, t.subjectId),
    /* Drives the `stale_registration_check` rule. */
    index("registration_stale_idx").on(t.orgId, t.lastCheckedAt),
  ],
);
