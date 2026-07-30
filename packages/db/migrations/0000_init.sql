-- HAND-EDITED GENERATED MIGRATION.
--
-- This file was produced by `drizzle-kit generate`, then edited to add two
-- things Drizzle cannot express in the schema DSL:
--
--   1. CREATE EXTENSION pg_trgm  (below) — without it the three gin_trgm_ops
--      indexes later in this file fail, and the matching engine's fuzzy tier
--      has no index to read. Verified: the generated file omitted this.
--   2. COMMENT ON statements (at the end) — so the reasoning behind
--      non-obvious columns travels with the schema and appears in any
--      introspection tool, per docs/runbooks/migrations.md.
--
-- Editing an UNAPPLIED initial migration is safe and intentional. Do not
-- re-generate this file without re-applying both additions.

CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint
CREATE TYPE "public"."alias_kind" AS ENUM('source_track_id', 'isrc', 'title_artist', 'upc_track');--> statement-breakpoint
CREATE TYPE "public"."catalog_kind" AS ENUM('owned', 'administered', 'client');--> statement-breakpoint
CREATE TYPE "public"."entity_origin" AS ENUM('manual', 'statement_inferred', 'imported', 'external_lookup');--> statement-breakpoint
CREATE TYPE "public"."estimate_confidence" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."expected_cadence" AS ENUM('monthly', 'quarterly', 'semiannual', 'irregular', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."format_scope" AS ENUM('global', 'org');--> statement-breakpoint
CREATE TYPE "public"."fx_source" AS ENUM('statement', 'table', 'none');--> statement-breakpoint
CREATE TYPE "public"."impact_band" AS ENUM('unknown', 'low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'revoked', 'expired');--> statement-breakpoint
CREATE TYPE "public"."issue_severity" AS ENUM('critical', 'high', 'medium', 'low', 'info');--> statement-breakpoint
CREATE TYPE "public"."issue_status" AS ENUM('open', 'in_review', 'dismissed', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."issue_subject" AS ENUM('work', 'recording', 'party', 'statement_file', 'statement_line', 'catalog', 'organization');--> statement-breakpoint
CREATE TYPE "public"."link_source" AS ENUM('user', 'isrc_lookup', 'statement_inferred', 'external');--> statement-breakpoint
CREATE TYPE "public"."match_method" AS ENUM('alias', 'isrc', 'iswc', 'upc_track', 'title_artist_exact', 'fuzzy', 'manual');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('unmatched', 'auto_matched', 'needs_review', 'confirmed', 'rejected', 'ignored');--> statement-breakpoint
CREATE TYPE "public"."match_target_type" AS ENUM('recording', 'work');--> statement-breakpoint
CREATE TYPE "public"."org_role" AS ENUM('owner', 'admin', 'analyst', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."party_identifier_scheme" AS ENUM('ipi_cae', 'isni', 'mlc_member_id', 'pro_member_id', 'proprietary');--> statement-breakpoint
CREATE TYPE "public"."party_kind" AS ENUM('writer', 'publisher', 'administrator', 'sub_publisher', 'producer', 'artist', 'label', 'society', 'distributor', 'other');--> statement-breakpoint
CREATE TYPE "public"."recommendation_action" AS ENUM('register_work', 'correct_split', 'add_isrc', 'link_work_recording', 'claim_unmatched_lines', 'request_missing_statement', 'contact_source', 'verify_ownership', 'merge_duplicates', 'update_metadata');--> statement-breakpoint
CREATE TYPE "public"."recommendation_status" AS ENUM('suggested', 'accepted', 'in_progress', 'done', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."recording_identifier_scheme" AS ENUM('isrc', 'spotify_track_id', 'apple_track_id', 'musicbrainz_recording_mbid', 'distributor_track_id', 'proprietary');--> statement-breakpoint
CREATE TYPE "public"."recording_right_type" AS ENUM('master_use', 'neighbouring', 'sync');--> statement-breakpoint
CREATE TYPE "public"."recording_share_role" AS ENUM('featured_artist', 'non_featured', 'producer', 'label', 'owner');--> statement-breakpoint
CREATE TYPE "public"."registration_source" AS ENUM('user_asserted', 'mlc_public_search', 'statement_inferred');--> statement-breakpoint
CREATE TYPE "public"."registration_status" AS ENUM('unknown', 'not_registered', 'submitted', 'pending', 'registered', 'conflict', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."registration_subject" AS ENUM('work', 'recording');--> statement-breakpoint
CREATE TYPE "public"."release_type" AS ENUM('single', 'ep', 'album', 'compilation');--> statement-breakpoint
CREATE TYPE "public"."share_basis" AS ENUM('writer_side', 'publisher_side', 'total');--> statement-breakpoint
CREATE TYPE "public"."share_completeness" AS ENUM('unknown', 'partial_by_design', 'asserted_complete');--> statement-breakpoint
CREATE TYPE "public"."share_source" AS ENUM('user', 'statement_inferred', 'split_sheet', 'contract', 'external');--> statement-breakpoint
CREATE TYPE "public"."society" AS ENUM('ascap', 'bmi', 'sesac', 'gmr', 'the_mlc', 'hfa', 'soundexchange', 'prs', 'mcps', 'socan', 'gema', 'sacem', 'apra_amcos', 'other');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('distributor', 'dsp', 'pro', 'mro', 'label', 'admin', 'other');--> statement-breakpoint
CREATE TYPE "public"."statement_file_kind" AS ENUM('csv', 'tsv', 'xlsx', 'xls', 'pdf');--> statement-breakpoint
CREATE TYPE "public"."statement_file_status" AS ENUM('uploaded', 'detecting', 'awaiting_mapping', 'parsing', 'parsed', 'reconcile_failed', 'committed', 'failed', 'quarantined');--> statement-breakpoint
CREATE TYPE "public"."usage_type" AS ENUM('stream', 'download', 'physical', 'mechanical', 'performance', 'sync', 'neighbouring', 'print', 'other', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."work_identifier_scheme" AS ENUM('iswc', 'mlc_work_id', 'ascap_work_id', 'bmi_work_id', 'sesac_work_id', 'hfa_song_code', 'proprietary');--> statement-breakpoint
CREATE TYPE "public"."work_recording_link_type" AS ENUM('primary', 'sample', 'medley_segment', 'interpolation');--> statement-breakpoint
CREATE TYPE "public"."work_right_type" AS ENUM('performing', 'mechanical', 'sync', 'print', 'all');--> statement-breakpoint
CREATE TYPE "public"."work_share_role" AS ENUM('composer', 'author', 'composer_author', 'arranger', 'adaptor', 'translator', 'original_publisher', 'sub_publisher', 'administrator', 'income_participant');--> statement-breakpoint
CREATE TABLE "audit_event" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "audit_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"org_id" uuid,
	"actor_user_id" char(64),
	"action" text NOT NULL,
	"entity_type" text,
	"entity_id" text,
	"ip" "inet",
	"user_agent" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role" "org_role" NOT NULL,
	"token_hash" char(64) NOT NULL,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"invited_by_user_id" char(64) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"accepted_by_user_id" char(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "membership" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" char(64) NOT NULL,
	"role" "org_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_by_user_id" char(64) NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"retention_months" integer DEFAULT 24 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "catalog" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"name" text NOT NULL,
	"kind" "catalog_kind" DEFAULT 'owned' NOT NULL,
	"default_currency" char(3),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "recording" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"catalog_id" uuid NOT NULL,
	"title" text NOT NULL,
	"title_norm" text NOT NULL,
	"version_label" text,
	"isrc" char(12),
	"display_artist" text,
	"artist_norm" text,
	"duration_ms" integer,
	"release_date" date,
	"label_name" text,
	"origin" "entity_origin" DEFAULT 'manual' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "recording_identifier" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"recording_id" uuid NOT NULL,
	"scheme" "recording_identifier_scheme" NOT NULL,
	"value_norm" text NOT NULL,
	"value_raw" text,
	"source" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"verified_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "release" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"catalog_id" uuid NOT NULL,
	"gtin" char(14),
	"title" text NOT NULL,
	"title_norm" text NOT NULL,
	"display_artist" text,
	"release_date" date,
	"type" "release_type",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "release_track" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"release_id" uuid NOT NULL,
	"recording_id" uuid NOT NULL,
	"disc_no" integer DEFAULT 1 NOT NULL,
	"track_no" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"catalog_id" uuid NOT NULL,
	"title" text NOT NULL,
	"title_norm" text NOT NULL,
	"alt_titles" text[],
	"iswc" char(11),
	"language" char(3),
	"duration_seconds" integer,
	"share_completeness" "share_completeness" DEFAULT 'unknown' NOT NULL,
	"origin" "entity_origin" DEFAULT 'manual' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "work_identifier" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"work_id" uuid NOT NULL,
	"scheme" "work_identifier_scheme" NOT NULL,
	"value_norm" text NOT NULL,
	"value_raw" text,
	"source" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"verified_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "work_recording" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"work_id" uuid NOT NULL,
	"recording_id" uuid NOT NULL,
	"link_type" "work_recording_link_type" DEFAULT 'primary' NOT NULL,
	"link_source" "link_source" DEFAULT 'user' NOT NULL,
	"confidence" numeric(4, 3),
	"confirmed_by_user_id" char(64),
	"confirmed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "party" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"name" text NOT NULL,
	"sort_name" text,
	"name_norm" text NOT NULL,
	"kind" "party_kind" NOT NULL,
	"is_self" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "party_affiliation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"party_id" uuid NOT NULL,
	"society" "society" NOT NULL,
	"role" text NOT NULL,
	"member_id" text,
	"effective_from" date,
	"effective_to" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "party_identifier" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"party_id" uuid NOT NULL,
	"scheme" "party_identifier_scheme" NOT NULL,
	"value_norm" text NOT NULL,
	"value_raw" text,
	"source" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recording_share" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"recording_id" uuid NOT NULL,
	"party_id" uuid NOT NULL,
	"role" "recording_share_role" NOT NULL,
	"right_type" "recording_right_type" DEFAULT 'master_use' NOT NULL,
	"ownership_pct" numeric(7, 4),
	"collection_pct" numeric(7, 4),
	"territory" text DEFAULT 'WORLD' NOT NULL,
	"territory_excludes" text[],
	"term_start" date,
	"term_end" date,
	"source" "share_source" DEFAULT 'user' NOT NULL,
	"evidence_ref" text,
	"confirmed_by_user_id" char(64),
	"confirmed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "registration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"subject_type" "registration_subject" NOT NULL,
	"subject_id" uuid NOT NULL,
	"registry" "society" NOT NULL,
	"external_id" text,
	"status" "registration_status" DEFAULT 'unknown' NOT NULL,
	"registered_shares_snapshot" jsonb,
	"evidence_storage_key" text,
	"source" "registration_source" NOT NULL,
	"last_checked_at" timestamp with time zone,
	"checked_by" char(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "work_share" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"work_id" uuid NOT NULL,
	"party_id" uuid NOT NULL,
	"role" "work_share_role" NOT NULL,
	"right_type" "work_right_type" DEFAULT 'all' NOT NULL,
	"share_basis" "share_basis" NOT NULL,
	"ownership_pct" numeric(7, 4),
	"collection_pct" numeric(7, 4),
	"territory" text DEFAULT 'WORLD' NOT NULL,
	"territory_excludes" text[],
	"term_start" date,
	"term_end" date,
	"source" "share_source" DEFAULT 'user' NOT NULL,
	"evidence_ref" text,
	"confirmed_by_user_id" char(64),
	"confirmed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "ingest_run" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"statement_file_id" uuid NOT NULL,
	"step" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"input_count" integer,
	"output_count" integer,
	"error" jsonb
);
--> statement-breakpoint
CREATE TABLE "match_alias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"source_account_id" uuid,
	"alias_kind" "alias_kind" NOT NULL,
	"alias_value_norm" text NOT NULL,
	"target_type" "match_target_type" NOT NULL,
	"target_id" uuid NOT NULL,
	"confirmed_by_user_id" char(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"hit_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source_account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"source_key" text NOT NULL,
	"source_type" "source_type" NOT NULL,
	"display_name" text NOT NULL,
	"default_currency" char(3),
	"expected_cadence" "expected_cadence" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "statement_file" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"source_account_id" uuid,
	"uploaded_by_user_id" char(64) NOT NULL,
	"original_filename" text NOT NULL,
	"mime" text,
	"byte_size" bigint,
	"sha256" char(64) NOT NULL,
	"storage_key" text NOT NULL,
	"status" "statement_file_status" DEFAULT 'uploaded' NOT NULL,
	"detected_format_id" uuid,
	"detection_confidence" numeric(4, 3),
	"period_start" date,
	"period_end" date,
	"statement_currency" char(3),
	"reported_total" numeric(18, 6),
	"parsed_total" numeric(18, 6),
	"row_count" integer,
	"error" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"committed_at" timestamp with time zone,
	"committed_by_user_id" char(64)
);
--> statement-breakpoint
CREATE TABLE "statement_format" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_key" text,
	"name" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"file_kind" "statement_file_kind" NOT NULL,
	"header_fingerprint" char(64) NOT NULL,
	"sample_headers" text[],
	"sheet_name" text,
	"header_row_index" integer DEFAULT 0 NOT NULL,
	"column_map" jsonb NOT NULL,
	"number_format" jsonb,
	"date_format" text,
	"encoding" text,
	"sensitive_fields" text[],
	"scope" "format_scope" DEFAULT 'org' NOT NULL,
	"org_id" uuid,
	"created_by_user_id" char(64),
	"confirmed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "statement_line" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "statement_line_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"org_id" uuid NOT NULL,
	"statement_file_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"raw" jsonb NOT NULL,
	"reported_title" text,
	"reported_artist" text,
	"reported_writer" text,
	"reported_publisher" text,
	"reported_isrc" char(12),
	"reported_iswc" char(11),
	"reported_gtin" char(14),
	"reported_track_no" integer,
	"reported_source_track_id" text,
	"platform" text,
	"store_service" text,
	"country_code" char(2),
	"usage_type" "usage_type" DEFAULT 'unknown' NOT NULL,
	"quantity" numeric(18, 4),
	"period_start" date,
	"period_end" date,
	"gross_amount" numeric(18, 6),
	"net_amount" numeric(18, 6),
	"currency" char(3),
	"fx_rate" numeric(18, 8),
	"amount_base" numeric(18, 6),
	"fx_source" "fx_source" DEFAULT 'none' NOT NULL,
	"share_pct_reported" numeric(7, 4),
	"is_reversal" boolean DEFAULT false NOT NULL,
	"match_status" "match_status" DEFAULT 'unmatched' NOT NULL,
	"matched_recording_id" uuid,
	"matched_work_id" uuid,
	"match_confidence" numeric(4, 3),
	"match_method" "match_method",
	"match_candidates" jsonb,
	"matched_at" timestamp with time zone,
	"matched_by_user_id" char(64)
);
--> statement-breakpoint
CREATE TABLE "detection_run" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"ruleset_version" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"issues_opened" integer,
	"issues_closed" integer,
	"error" jsonb
);
--> statement-breakpoint
CREATE TABLE "issue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"detection_run_id" uuid,
	"rule_key" text NOT NULL,
	"ruleset_version" text NOT NULL,
	"severity" "issue_severity" NOT NULL,
	"status" "issue_status" DEFAULT 'open' NOT NULL,
	"subject_type" "issue_subject" NOT NULL,
	"subject_id" uuid,
	"title" text NOT NULL,
	"body" text,
	"evidence" jsonb NOT NULL,
	"estimated_value" numeric(18, 6),
	"estimated_currency" char(3),
	"value_is_estimate" boolean DEFAULT true NOT NULL,
	"estimate_basis" text,
	"estimate_confidence" "estimate_confidence",
	"fingerprint" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_detected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	"resolution_note" text,
	"dismissed_reason" text,
	"dismissed_by_user_id" char(64),
	"updated_at" timestamp with time zone,
	CONSTRAINT "issue_value_requires_basis" CHECK (estimated_value IS NULL OR (estimate_basis IS NOT NULL AND estimate_confidence IS NOT NULL)),
	CONSTRAINT "issue_value_requires_currency" CHECK (estimated_value IS NULL OR estimated_currency IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "recommendation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"issue_id" uuid,
	"action_type" "recommendation_action" NOT NULL,
	"title" text NOT NULL,
	"rationale" text,
	"effort" "impact_band" DEFAULT 'unknown' NOT NULL,
	"impact_band" "impact_band" DEFAULT 'unknown' NOT NULL,
	"status" "recommendation_status" DEFAULT 'suggested' NOT NULL,
	"assigned_to_user_id" char(64),
	"due_date" date,
	"evidence" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "audit_event" ADD CONSTRAINT "audit_event_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership" ADD CONSTRAINT "membership_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog" ADD CONSTRAINT "catalog_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recording" ADD CONSTRAINT "recording_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recording" ADD CONSTRAINT "recording_catalog_id_catalog_id_fk" FOREIGN KEY ("catalog_id") REFERENCES "public"."catalog"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recording_identifier" ADD CONSTRAINT "recording_identifier_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recording_identifier" ADD CONSTRAINT "recording_identifier_recording_id_recording_id_fk" FOREIGN KEY ("recording_id") REFERENCES "public"."recording"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "release" ADD CONSTRAINT "release_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "release" ADD CONSTRAINT "release_catalog_id_catalog_id_fk" FOREIGN KEY ("catalog_id") REFERENCES "public"."catalog"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "release_track" ADD CONSTRAINT "release_track_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "release_track" ADD CONSTRAINT "release_track_release_id_release_id_fk" FOREIGN KEY ("release_id") REFERENCES "public"."release"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "release_track" ADD CONSTRAINT "release_track_recording_id_recording_id_fk" FOREIGN KEY ("recording_id") REFERENCES "public"."recording"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work" ADD CONSTRAINT "work_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work" ADD CONSTRAINT "work_catalog_id_catalog_id_fk" FOREIGN KEY ("catalog_id") REFERENCES "public"."catalog"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_identifier" ADD CONSTRAINT "work_identifier_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_identifier" ADD CONSTRAINT "work_identifier_work_id_work_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_recording" ADD CONSTRAINT "work_recording_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_recording" ADD CONSTRAINT "work_recording_work_id_work_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_recording" ADD CONSTRAINT "work_recording_recording_id_recording_id_fk" FOREIGN KEY ("recording_id") REFERENCES "public"."recording"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party" ADD CONSTRAINT "party_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_affiliation" ADD CONSTRAINT "party_affiliation_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_affiliation" ADD CONSTRAINT "party_affiliation_party_id_party_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."party"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_identifier" ADD CONSTRAINT "party_identifier_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_identifier" ADD CONSTRAINT "party_identifier_party_id_party_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."party"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recording_share" ADD CONSTRAINT "recording_share_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recording_share" ADD CONSTRAINT "recording_share_recording_id_recording_id_fk" FOREIGN KEY ("recording_id") REFERENCES "public"."recording"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recording_share" ADD CONSTRAINT "recording_share_party_id_party_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."party"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration" ADD CONSTRAINT "registration_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_share" ADD CONSTRAINT "work_share_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_share" ADD CONSTRAINT "work_share_work_id_work_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_share" ADD CONSTRAINT "work_share_party_id_party_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."party"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingest_run" ADD CONSTRAINT "ingest_run_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingest_run" ADD CONSTRAINT "ingest_run_statement_file_id_statement_file_id_fk" FOREIGN KEY ("statement_file_id") REFERENCES "public"."statement_file"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_alias" ADD CONSTRAINT "match_alias_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_alias" ADD CONSTRAINT "match_alias_source_account_id_source_account_id_fk" FOREIGN KEY ("source_account_id") REFERENCES "public"."source_account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_account" ADD CONSTRAINT "source_account_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statement_file" ADD CONSTRAINT "statement_file_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statement_file" ADD CONSTRAINT "statement_file_source_account_id_source_account_id_fk" FOREIGN KEY ("source_account_id") REFERENCES "public"."source_account"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statement_file" ADD CONSTRAINT "statement_file_detected_format_id_statement_format_id_fk" FOREIGN KEY ("detected_format_id") REFERENCES "public"."statement_format"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statement_format" ADD CONSTRAINT "statement_format_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statement_line" ADD CONSTRAINT "statement_line_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statement_line" ADD CONSTRAINT "statement_line_statement_file_id_statement_file_id_fk" FOREIGN KEY ("statement_file_id") REFERENCES "public"."statement_file"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statement_line" ADD CONSTRAINT "statement_line_matched_recording_id_recording_id_fk" FOREIGN KEY ("matched_recording_id") REFERENCES "public"."recording"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statement_line" ADD CONSTRAINT "statement_line_matched_work_id_work_id_fk" FOREIGN KEY ("matched_work_id") REFERENCES "public"."work"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detection_run" ADD CONSTRAINT "detection_run_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issue" ADD CONSTRAINT "issue_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issue" ADD CONSTRAINT "issue_detection_run_id_detection_run_id_fk" FOREIGN KEY ("detection_run_id") REFERENCES "public"."detection_run"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation" ADD CONSTRAINT "recommendation_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation" ADD CONSTRAINT "recommendation_issue_id_issue_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issue"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_event_org_created_idx" ON "audit_event" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_event_entity_idx" ON "audit_event" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_event_action_idx" ON "audit_event" USING btree ("action");--> statement-breakpoint
CREATE UNIQUE INDEX "invitation_token_hash_key" ON "invitation" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "invitation_org_status_idx" ON "invitation" USING btree ("org_id","status");--> statement-breakpoint
CREATE INDEX "invitation_email_idx" ON "invitation" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "membership_org_user_key" ON "membership" USING btree ("org_id","user_id") WHERE deleted_at IS NULL;--> statement-breakpoint
CREATE INDEX "membership_user_idx" ON "membership" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_slug_key" ON "organization" USING btree ("slug") WHERE deleted_at IS NULL;--> statement-breakpoint
CREATE INDEX "catalog_org_idx" ON "catalog" USING btree ("org_id");--> statement-breakpoint
CREATE UNIQUE INDEX "recording_org_isrc_key" ON "recording" USING btree ("org_id","isrc") WHERE isrc IS NOT NULL AND deleted_at IS NULL;--> statement-breakpoint
CREATE INDEX "recording_org_catalog_idx" ON "recording" USING btree ("org_id","catalog_id");--> statement-breakpoint
CREATE INDEX "recording_title_norm_trgm_idx" ON "recording" USING gin ("title_norm" gin_trgm_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "recording_identifier_key" ON "recording_identifier" USING btree ("org_id","scheme","value_norm","recording_id");--> statement-breakpoint
CREATE INDEX "recording_identifier_lookup_idx" ON "recording_identifier" USING btree ("org_id","scheme","value_norm");--> statement-breakpoint
CREATE INDEX "recording_identifier_recording_idx" ON "recording_identifier" USING btree ("recording_id");--> statement-breakpoint
CREATE UNIQUE INDEX "release_org_gtin_key" ON "release" USING btree ("org_id","gtin") WHERE gtin IS NOT NULL AND deleted_at IS NULL;--> statement-breakpoint
CREATE INDEX "release_org_catalog_idx" ON "release" USING btree ("org_id","catalog_id");--> statement-breakpoint
CREATE UNIQUE INDEX "release_track_position_key" ON "release_track" USING btree ("release_id","disc_no","track_no");--> statement-breakpoint
CREATE INDEX "release_track_recording_idx" ON "release_track" USING btree ("org_id","recording_id");--> statement-breakpoint
CREATE UNIQUE INDEX "work_org_iswc_key" ON "work" USING btree ("org_id","iswc") WHERE iswc IS NOT NULL AND deleted_at IS NULL;--> statement-breakpoint
CREATE INDEX "work_org_catalog_idx" ON "work" USING btree ("org_id","catalog_id");--> statement-breakpoint
CREATE INDEX "work_title_norm_trgm_idx" ON "work" USING gin ("title_norm" gin_trgm_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "work_identifier_key" ON "work_identifier" USING btree ("org_id","scheme","value_norm","work_id");--> statement-breakpoint
CREATE INDEX "work_identifier_lookup_idx" ON "work_identifier" USING btree ("org_id","scheme","value_norm");--> statement-breakpoint
CREATE INDEX "work_identifier_work_idx" ON "work_identifier" USING btree ("work_id");--> statement-breakpoint
CREATE UNIQUE INDEX "work_recording_key" ON "work_recording" USING btree ("work_id","recording_id","link_type");--> statement-breakpoint
CREATE INDEX "work_recording_recording_idx" ON "work_recording" USING btree ("org_id","recording_id");--> statement-breakpoint
CREATE INDEX "work_recording_work_idx" ON "work_recording" USING btree ("org_id","work_id");--> statement-breakpoint
CREATE INDEX "party_org_idx" ON "party" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "party_name_norm_trgm_idx" ON "party" USING gin ("name_norm" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "party_org_self_idx" ON "party" USING btree ("org_id","is_self") WHERE is_self = true;--> statement-breakpoint
CREATE INDEX "party_affiliation_party_idx" ON "party_affiliation" USING btree ("org_id","party_id");--> statement-breakpoint
CREATE UNIQUE INDEX "party_identifier_key" ON "party_identifier" USING btree ("org_id","scheme","value_norm","party_id");--> statement-breakpoint
CREATE INDEX "party_identifier_lookup_idx" ON "party_identifier" USING btree ("org_id","scheme","value_norm");--> statement-breakpoint
CREATE INDEX "recording_share_recording_idx" ON "recording_share" USING btree ("org_id","recording_id") WHERE deleted_at IS NULL;--> statement-breakpoint
CREATE INDEX "recording_share_party_idx" ON "recording_share" USING btree ("org_id","party_id");--> statement-breakpoint
CREATE UNIQUE INDEX "registration_subject_registry_key" ON "registration" USING btree ("org_id","subject_type","subject_id","registry");--> statement-breakpoint
CREATE INDEX "registration_subject_idx" ON "registration" USING btree ("org_id","subject_type","subject_id");--> statement-breakpoint
CREATE INDEX "registration_stale_idx" ON "registration" USING btree ("org_id","last_checked_at");--> statement-breakpoint
CREATE INDEX "work_share_work_idx" ON "work_share" USING btree ("org_id","work_id") WHERE deleted_at IS NULL;--> statement-breakpoint
CREATE INDEX "work_share_party_idx" ON "work_share" USING btree ("org_id","party_id");--> statement-breakpoint
CREATE INDEX "work_share_rule_idx" ON "work_share" USING btree ("org_id","work_id","right_type","share_basis");--> statement-breakpoint
CREATE INDEX "ingest_run_file_idx" ON "ingest_run" USING btree ("statement_file_id","started_at");--> statement-breakpoint
CREATE UNIQUE INDEX "match_alias_key" ON "match_alias" USING btree ("org_id","source_account_id","alias_kind","alias_value_norm");--> statement-breakpoint
CREATE INDEX "match_alias_target_idx" ON "match_alias" USING btree ("org_id","target_type","target_id");--> statement-breakpoint
CREATE INDEX "source_account_org_idx" ON "source_account" USING btree ("org_id");--> statement-breakpoint
CREATE UNIQUE INDEX "statement_file_org_sha_key" ON "statement_file" USING btree ("org_id","sha256");--> statement-breakpoint
CREATE INDEX "statement_file_org_status_idx" ON "statement_file" USING btree ("org_id","status");--> statement-breakpoint
CREATE INDEX "statement_file_org_period_idx" ON "statement_file" USING btree ("org_id","period_start","period_end");--> statement-breakpoint
CREATE INDEX "statement_file_source_idx" ON "statement_file" USING btree ("org_id","source_account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "statement_format_fingerprint_scope_key" ON "statement_format" USING btree ("header_fingerprint","scope","org_id","version");--> statement-breakpoint
CREATE INDEX "statement_format_lookup_idx" ON "statement_format" USING btree ("header_fingerprint");--> statement-breakpoint
CREATE INDEX "statement_format_source_idx" ON "statement_format" USING btree ("source_key");--> statement-breakpoint
CREATE UNIQUE INDEX "statement_line_file_line_key" ON "statement_line" USING btree ("statement_file_id","line_no");--> statement-breakpoint
CREATE INDEX "statement_line_review_idx" ON "statement_line" USING btree ("org_id","match_status") WHERE match_status IN ('unmatched', 'needs_review');--> statement-breakpoint
CREATE INDEX "statement_line_isrc_idx" ON "statement_line" USING btree ("org_id","reported_isrc");--> statement-breakpoint
CREATE INDEX "statement_line_source_track_idx" ON "statement_line" USING btree ("org_id","reported_source_track_id");--> statement-breakpoint
CREATE INDEX "statement_line_recording_period_idx" ON "statement_line" USING btree ("org_id","matched_recording_id","period_start");--> statement-breakpoint
CREATE INDEX "statement_line_work_period_idx" ON "statement_line" USING btree ("org_id","matched_work_id","period_start");--> statement-breakpoint
CREATE INDEX "detection_run_org_idx" ON "detection_run" USING btree ("org_id","started_at");--> statement-breakpoint
CREATE UNIQUE INDEX "issue_fingerprint_key" ON "issue" USING btree ("org_id","fingerprint");--> statement-breakpoint
CREATE INDEX "issue_org_status_severity_idx" ON "issue" USING btree ("org_id","status","severity");--> statement-breakpoint
CREATE INDEX "issue_subject_idx" ON "issue" USING btree ("org_id","subject_type","subject_id");--> statement-breakpoint
CREATE INDEX "issue_rule_idx" ON "issue" USING btree ("org_id","rule_key");--> statement-breakpoint
CREATE INDEX "recommendation_org_status_idx" ON "recommendation" USING btree ("org_id","status");--> statement-breakpoint
CREATE INDEX "recommendation_issue_idx" ON "recommendation" USING btree ("issue_id");--> statement-breakpoint
CREATE INDEX "recommendation_ranking_idx" ON "recommendation" USING btree ("org_id","impact_band","effort");
--> statement-breakpoint
-- ============================================================================
-- COMMENT ON — the "why" behind non-obvious columns, so it travels with the
-- schema and shows up in psql \d+, DBeaver, and any introspection tool.
-- Only columns whose purpose a competent developer could plausibly misread are
-- documented; self-evident ones are left alone. See docs/domain/glossary.md.
-- ============================================================================

COMMENT ON COLUMN "work"."title_norm" IS
  'Normalised title maintained by the application (see @source/domain normalizeTitle). Trigram-indexed; the matching engine''s fuzzy tier reads this column and its GIN index.';--> statement-breakpoint
COMMENT ON COLUMN "work"."share_completeness" IS
  'Whether the recorded shares are believed to be the COMPLETE set. Gates the split-sum rule: without this, every partially-entered work generates a false "splits do not add up" issue and users learn to ignore the rules.';--> statement-breakpoint
COMMENT ON COLUMN "work"."origin" IS
  'How this row entered the system. statement_inferred means it was created because a statement mentioned it and no human has confirmed it — must be visually distinct in the UI from a deliberate entry.';--> statement-breakpoint

COMMENT ON TABLE "recording" IS
  'One specific recorded performance. Deliberately has NO work_id column: recordings arrive from statements before anyone knows which composition they embody, and a medley embodies several. The relationship lives in work_recording (many-to-many).';--> statement-breakpoint
COMMENT ON COLUMN "recording"."version_label" IS
  'What distinguishes recordings sharing a title: "Radio Edit", "Live at X", "Sped Up". Losing this is how a live version''s revenue gets attributed to the studio recording.';--> statement-breakpoint

COMMENT ON COLUMN "work_recording"."confirmed_at" IS
  'NULL means this work-to-recording link has never been confirmed by a human — it is a hypothesis, not a fact, and must render differently in the UI.';--> statement-breakpoint

COMMENT ON TABLE "release" IS
  'An album/EP/single as a PRODUCT. Exists because many distributor statements key on UPC + track number and carry no ISRC, so releases are the only path from those lines to a recording (matching tier T3).';--> statement-breakpoint
COMMENT ON COLUMN "release"."gtin" IS
  'Normalised to GTIN-14 by zero-padding, so UPC-12, EAN-13 and GTIN-14 forms of one product are a single comparable value. Padding preserves the GS1 check digit.';--> statement-breakpoint

COMMENT ON COLUMN "party"."is_self" IS
  'Does this party represent the organisation itself? Required by the self_party_absent rule, which answers "am I even recorded as having an interest in this work?" — uncomputable without knowing which parties are "us".';--> statement-breakpoint

COMMENT ON TABLE "party_affiliation" IS
  'A party''s society membership OVER TIME. Time-scoped because writers change PROs: a 2023 statement must be read against the affiliation in force in 2023, not today''s.';--> statement-breakpoint

COMMENT ON TABLE "work_share" IS
  'A share in a composition. The most domain-sensitive table in the schema — every column below exists to prevent a specific class of wrong finding. Read docs/domain/glossary.md before changing it.';--> statement-breakpoint
COMMENT ON COLUMN "work_share"."share_basis" IS
  'Which 100% universe this share belongs to. Performing rights are conventionally writer_side totalling 100% AND publisher_side totalling 100% — two separate universes; mechanical is usually a single total. Without this discriminator, a naive "shares must sum to 100" check fires a false positive on EVERY correctly-entered work.';--> statement-breakpoint
COMMENT ON COLUMN "work_share"."ownership_pct" IS
  'What this party OWNS. Distinct from collection_pct: a publisher may own 50% while collecting 100% under an administration deal. Conflating the two produces false "under-collecting" findings.';--> statement-breakpoint
COMMENT ON COLUMN "work_share"."collection_pct" IS
  'What this party COLLECTS, which may legitimately exceed what it owns under an administration agreement. See ownership_pct.';--> statement-breakpoint
COMMENT ON COLUMN "work_share"."territory_excludes" IS
  'Carve-outs, e.g. {US} for "World except US" — the single most common real-world expression of territory. A flat country list would be tidier but loses the intent the paperwork states.';--> statement-breakpoint
COMMENT ON COLUMN "work_share"."term_end" IS
  'Shares are interval data and reversion happens. Deliberately NOT protected by an exclusion constraint: real catalogs contain overlapping terms, and blocking the insert would prevent recording the truth. Overlaps surface via the split_overlap_conflict rule instead.';--> statement-breakpoint

COMMENT ON COLUMN "registration"."source" IS
  'How we know this status. Phase 1 has NO write access to any registry, so every row is user-asserted, inferred from a statement''s existence, or read from a public search. Rendered on every registration row so the user knows how much to trust it.';--> statement-breakpoint

COMMENT ON TABLE "statement_format" IS
  'A learned file layout, recognised by a hash of its sorted normalised header tokens. The answer to format sprawl: a renamed column produces a NEAR match, so the user sees a pre-filled diff rather than a blank mapping screen. Starts org-scoped and can be promoted to global.';--> statement-breakpoint
COMMENT ON COLUMN "statement_format"."sensitive_fields" IS
  'Columns dropped AT PARSE TIME, before anything is persisted (payee bank details, tax IDs, addresses). PII minimisation is the cheapest compliance win available. Consequence: these columns cannot be recovered by a reparse. Deliberate.';--> statement-breakpoint

COMMENT ON COLUMN "statement_file"."status" IS
  'Governs TRUST across the whole system: nothing outside the statement detail screen reads lines whose file is not committed. This is why there is no separate staging table — one table plus a status gate beats two schemas that can drift.';--> statement-breakpoint
COMMENT ON COLUMN "statement_file"."reported_total" IS
  'The total the FILE ITSELF declares. Compared against parsed_total to catch OUR OWN parser bugs before the user sees a wrong number — the highest-value check in the system. A mismatch blocks the commit.';--> statement-breakpoint
COMMENT ON COLUMN "statement_file"."parsed_total" IS
  'The total WE computed by summing parsed lines. See reported_total.';--> statement-breakpoint
COMMENT ON COLUMN "statement_file"."storage_key" IS
  'S3 key, format {org_id}/{uuid}. Never the original filename, which leaks artist and release names into object keys.';--> statement-breakpoint
COMMENT ON COLUMN "statement_file"."committed_at" IS
  'The human commit gate. Set only by an explicit user action, and audited. Until set, this file feeds no rollup, no matching and no issue detection.';--> statement-breakpoint

COMMENT ON TABLE "statement_line" IS
  'One row of one statement. Hot, high-volume table — hence a bigint identity key rather than a uuid, for index locality. Every normalised column is nullable because every source omits something: a PRO statement has no ISRC, a distributor statement has no writer.';--> statement-breakpoint
COMMENT ON COLUMN "statement_line"."raw" IS
  'The source row VERBATIM, forever, minus columns marked sensitive at parse time. Every normalised column is derived from this and can be recomputed, so a parser bug is a bug rather than an incident.';--> statement-breakpoint
COMMENT ON COLUMN "statement_line"."reported_source_track_id" IS
  'The source''s own track identifier. Gold for matching: stable across periods, so one confirmed alias auto-matches every future statement from that source. This column is why month two is nearly free.';--> statement-breakpoint
COMMENT ON COLUMN "statement_line"."is_reversal" IS
  'A correction of an earlier overpayment. Must be excluded from revenue tiles and shown explicitly — silently netting reversals into revenue hides the reason for a drop the user can see on their own statement.';--> statement-breakpoint
COMMENT ON COLUMN "statement_line"."match_candidates" IS
  'Top candidates with scores and the reason each scored what it did. The "why" behind a match: powers the review UI and makes a bad match debuggable months later.';--> statement-breakpoint

COMMENT ON TABLE "match_alias" IS
  'A confirmed mapping from a source''s identifier to one of our entities. The compounding-value mechanic of the product: confirming a match writes a row here and the review queue never asks again, including next month. This is why the matching exit criterion is measured on the SECOND statement from a source.';--> statement-breakpoint

COMMENT ON TABLE "issue" IS
  'A finding, always produced by a DETERMINISTIC rule and never by a model. See docs/adr/0010-deterministic-rules-not-ai.md.';--> statement-breakpoint
COMMENT ON COLUMN "issue"."evidence" IS
  'The exact rows, fields and ids that triggered this. NOT NULL because a finding without evidence is not actionable — the user may contact a society or correct a split on the strength of it.';--> statement-breakpoint
COMMENT ON COLUMN "issue"."value_is_estimate" IS
  'False ONLY when the figure is copied verbatim from a statement (we are quoting the source). True for anything we computed. Drives which UI component renders it.';--> statement-breakpoint
COMMENT ON COLUMN "issue"."estimate_basis" IS
  'Plain-language derivation, shown to the user. Required whenever estimated_value is present, enforced by the issue_value_requires_basis constraint. COMPLIANCE CONTROL: a monetary figure cannot be persisted without recording how it was derived.';--> statement-breakpoint
COMMENT ON COLUMN "issue"."fingerprint" IS
  'Stable dedupe key across detection runs, so re-running the rules updates an existing issue rather than creating a duplicate every time.';--> statement-breakpoint

COMMENT ON COLUMN "recommendation"."impact_band" IS
  'Ranking band, deliberately NOT a dollar figure: lets us order "do this first" without minting a number that would require an estimate basis and a compliance caveat.';--> statement-breakpoint

COMMENT ON TABLE "audit_event" IS
  'Append-only audit trail. Enforced at the GRANT level: the application role gets INSERT and SELECT, with UPDATE and DELETE revoked. Not overhead — the audit layer is part of the product.';--> statement-breakpoint
