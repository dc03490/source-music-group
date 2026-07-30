import { pgEnum } from "drizzle-orm/pg-core";

/* Every enumerated value in the domain, in one place.

   Postgres enums rather than check constraints or lookup tables: the value sets
   here are vocabulary, not data. They change with a migration and a code
   change together, which is the behaviour we want — adding a new royalty type
   should be a reviewed decision, not a row someone inserts.

   Adding a value is cheap (`ALTER TYPE ... ADD VALUE`). REMOVING one is not, so
   prefer a slightly wider set over a too-narrow one, and always include an
   `unknown`/`other` member for data we cannot classify at ingest. Coercing an
   unclassifiable statement row into a specific bucket is how silent data
   corruption starts. */

// --- Tenancy ---------------------------------------------------------------

/** Role within an organisation. Checked server-side against `membership`. */
export const orgRole = pgEnum("org_role", ["owner", "admin", "analyst", "viewer"]);

export const invitationStatus = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "revoked",
  "expired",
]);

// --- Catalog ---------------------------------------------------------------

/** Why an org holds this catalog. Affects which rules apply. */
export const catalogKind = pgEnum("catalog_kind", [
  "owned", // the org's own rights
  "administered", // administered on someone else's behalf
  "client", // a managed client's catalog
]);

/**
 * How an entity entered the system. Trust level, essentially.
 *
 * `statement_inferred` is the important one: a recording created because a
 * statement line mentioned it has never been confirmed by a human and must be
 * visually distinguishable from one the user entered deliberately.
 */
export const entityOrigin = pgEnum("entity_origin", [
  "manual",
  "statement_inferred",
  "imported",
  "external_lookup",
]);

/**
 * Whether the shares recorded for a work are believed to be the complete set.
 *
 * This is the most compliance-adjacent field in the schema. The split-sum rule
 * only fires on `asserted_complete` works — otherwise every half-entered work
 * generates a "your splits don't add up" issue and users learn to ignore the
 * rules entirely. See docs/domain/glossary.md.
 */
export const shareCompleteness = pgEnum("share_completeness", [
  "unknown",
  "partial_by_design",
  "asserted_complete",
]);

/** Identifier namespaces for a composition. */
export const workIdentifierScheme = pgEnum("work_identifier_scheme", [
  "iswc",
  "mlc_work_id",
  "ascap_work_id",
  "bmi_work_id",
  "sesac_work_id",
  "hfa_song_code",
  "proprietary",
]);

/** Identifier namespaces for a recording. */
export const recordingIdentifierScheme = pgEnum("recording_identifier_scheme", [
  "isrc",
  "spotify_track_id",
  "apple_track_id",
  "musicbrainz_recording_mbid",
  "distributor_track_id",
  "proprietary",
]);

/**
 * How a recording relates to a composition.
 *
 * Not just `primary`: a medley embodies several works, and an interpolation or
 * sample creates a partial relationship. This is why `work_recording` is
 * many-to-many in both directions.
 */
export const workRecordingLinkType = pgEnum("work_recording_link_type", [
  "primary",
  "sample",
  "medley_segment",
  "interpolation",
]);

/** Where a work↔recording link came from, which sets how much to trust it. */
export const linkSource = pgEnum("link_source", [
  "user",
  "isrc_lookup",
  "statement_inferred",
  "external",
]);

export const releaseType = pgEnum("release_type", ["single", "ep", "album", "compilation"]);

// --- Parties and ownership -------------------------------------------------

export const partyKind = pgEnum("party_kind", [
  "writer",
  "publisher",
  "administrator",
  "sub_publisher",
  "producer",
  "artist",
  "label",
  "society",
  "distributor",
  "other",
]);

export const partyIdentifierScheme = pgEnum("party_identifier_scheme", [
  "ipi_cae",
  "isni",
  "mlc_member_id",
  "pro_member_id",
  "proprietary",
]);

/** Societies we may see on a statement or affiliation. `other` is load-bearing. */
export const society = pgEnum("society", [
  "ascap",
  "bmi",
  "sesac",
  "gmr",
  "the_mlc",
  "hfa",
  "soundexchange",
  "prs",
  "mcps",
  "socan",
  "gema",
  "sacem",
  "apra_amcos",
  "other",
]);

/** A party's role on a composition. */
export const workShareRole = pgEnum("work_share_role", [
  "composer",
  "author",
  "composer_author",
  "arranger",
  "adaptor",
  "translator",
  "original_publisher",
  "sub_publisher",
  "administrator",
  "income_participant",
]);

/** A party's role on a recording. */
export const recordingShareRole = pgEnum("recording_share_role", [
  "featured_artist",
  "non_featured",
  "producer",
  "label",
  "owner",
]);

/** Which right a share applies to. Shares are per-right, not global. */
export const workRightType = pgEnum("work_right_type", [
  "performing",
  "mechanical",
  "sync",
  "print",
  "all",
]);

export const recordingRightType = pgEnum("recording_right_type", [
  "master_use",
  "neighbouring",
  "sync",
]);

/**
 * Which 100% universe a share belongs to.
 *
 * THE most misunderstood field in the schema. Performing rights are
 * conventionally expressed as writer-side totalling 100% AND publisher-side
 * totalling 100% — two separate universes. Mechanical is usually a single 100%.
 *
 * Without this discriminator, a naive "shares must sum to 100" check fires a
 * false positive on every correctly-entered work. See docs/domain/glossary.md.
 */
export const shareBasis = pgEnum("share_basis", ["writer_side", "publisher_side", "total"]);

/** Provenance of a share, which determines how much to trust it. */
export const shareSource = pgEnum("share_source", [
  "user",
  "statement_inferred",
  "split_sheet",
  "contract",
  "external",
]);

// --- Registrations ---------------------------------------------------------

export const registrationSubject = pgEnum("registration_subject", ["work", "recording"]);

export const registrationStatus = pgEnum("registration_status", [
  "unknown",
  "not_registered",
  "submitted",
  "pending",
  "registered",
  "conflict",
  "rejected",
]);

/**
 * How we know a registration's status.
 *
 * Phase 1 has NO write access to any registry, so this is always user-asserted,
 * inferred from a statement's existence, or read from a public search. Rendered
 * on every registration row so the user knows how much to trust it.
 */
export const registrationSource = pgEnum("registration_source", [
  "user_asserted",
  "mlc_public_search",
  "statement_inferred",
]);

// --- Ingestion -------------------------------------------------------------

export const sourceType = pgEnum("source_type", [
  "distributor",
  "dsp",
  "pro",
  "mro",
  "label",
  "admin",
  "other",
]);

export const statementFileKind = pgEnum("statement_file_kind", ["csv", "tsv", "xlsx", "xls", "pdf"]);

/** Whether a learned format belongs to one org or is shared. */
export const formatScope = pgEnum("format_scope", ["global", "org"]);

/**
 * Lifecycle of an uploaded statement file.
 *
 * `statement_file.status` is what governs trust: nothing outside the statement
 * detail screen reads lines whose file is not `committed`. This is why there is
 * no separate staging table. See docs/adr/0009-human-commit-gate.md.
 */
export const statementFileStatus = pgEnum("statement_file_status", [
  "uploaded",
  "detecting",
  "awaiting_mapping", // unknown format — needs a human to map columns
  "parsing",
  "parsed",
  "reconcile_failed", // our total disagrees with the file's own; commit blocked
  "committed",
  "failed",
  "quarantined",
]);

/** What kind of use a statement line represents. Drives which rules apply. */
export const usageType = pgEnum("usage_type", [
  "stream",
  "download",
  "physical",
  "mechanical",
  "performance",
  "sync",
  "neighbouring",
  "print",
  "other",
  "unknown",
]);

export const matchStatus = pgEnum("match_status", [
  "unmatched",
  "auto_matched",
  "needs_review",
  "confirmed",
  "rejected",
  "ignored",
]);

/** Which tier of the matching ladder produced a match. See docs/domain/matching.md. */
export const matchMethod = pgEnum("match_method", [
  "alias", // T0 — previously confirmed by this user
  "isrc", // T1
  "iswc", // T2
  "upc_track", // T3
  "title_artist_exact", // T4
  "fuzzy", // T5
  "manual",
]);

export const matchTargetType = pgEnum("match_target_type", ["recording", "work"]);

export const aliasKind = pgEnum("alias_kind", [
  "source_track_id",
  "isrc",
  "title_artist",
  "upc_track",
]);

/** Where FX came from, when an amount was converted. */
export const fxSource = pgEnum("fx_source", ["statement", "table", "none"]);

export const expectedCadence = pgEnum("expected_cadence", [
  "monthly",
  "quarterly",
  "semiannual",
  "irregular",
  "unknown",
]);

// --- Analysis --------------------------------------------------------------

export const issueSeverity = pgEnum("issue_severity", [
  "critical",
  "high",
  "medium",
  "low",
  "info",
]);

export const issueStatus = pgEnum("issue_status", ["open", "in_review", "dismissed", "resolved"]);

export const issueSubject = pgEnum("issue_subject", [
  "work",
  "recording",
  "party",
  "statement_file",
  "statement_line",
  "catalog",
  "organization",
]);

/** Confidence in an estimated value. Required whenever a value is an estimate. */
export const estimateConfidence = pgEnum("estimate_confidence", ["low", "medium", "high"]);

/**
 * What a user can actually do about an issue.
 *
 * Deliberately biased toward self-serve actions. The plan's product risk is
 * that findings whose only action is "contact your PRO and wait six months"
 * feel worthless regardless of how correct they are.
 */
export const recommendationAction = pgEnum("recommendation_action", [
  "register_work",
  "correct_split",
  "add_isrc",
  "link_work_recording",
  "claim_unmatched_lines",
  "request_missing_statement",
  "contact_source",
  "verify_ownership",
  "merge_duplicates",
  "update_metadata",
]);

/**
 * Ranking band for a recommendation, deliberately NOT a dollar figure.
 *
 * Lets us order "do this first" without minting a number that would need an
 * estimate basis and a compliance caveat. See docs/compliance/claims-lexicon.md.
 */
export const impactBand = pgEnum("impact_band", ["unknown", "low", "medium", "high"]);

export const recommendationStatus = pgEnum("recommendation_status", [
  "suggested",
  "accepted",
  "in_progress",
  "done",
  "dismissed",
]);
