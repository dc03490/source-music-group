import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createdAt, currencyCode, money, primaryId, updatedAt, userRef } from "./columns";
import {
  estimateConfidence,
  impactBand,
  issueSeverity,
  issueStatus,
  issueSubject,
  recommendationAction,
  recommendationStatus,
} from "./enums";
import { organization } from "./tenancy";

/* Findings and recommended actions.

   Every issue here is produced by a DETERMINISTIC rule in
   `@source/domain`/rules — never by a model. See
   docs/adr/0010-deterministic-rules-not-ai.md for why that constraint is
   permanent rather than a stepping stone. */

/** One execution of the rule set over an org's data. */
export const detectionRun = pgTable(
  "detection_run",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    /** Which version of the rule set ran. Stamped onto every issue it produces. */
    rulesetVersion: text("ruleset_version").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    issuesOpened: integer("issues_opened"),
    issuesClosed: integer("issues_closed"),
    error: jsonb("error"),
  },
  (t) => [index("detection_run_org_idx").on(t.orgId, t.startedAt)],
);

/**
 * A finding: something about the user's data that needs attention.
 *
 * THE COMPLIANCE-CRITICAL TABLE. Read docs/compliance/claims-lexicon.md before
 * changing anything below relating to values.
 *
 * The `issue_value_requires_basis` check constraint is a compliance control
 * expressed in the schema: a dollar figure CANNOT be persisted without also
 * persisting how it was derived and how confident we are. Enforcing this at the
 * storage layer means no code path — including a future one nobody has written
 * yet — can produce an unexplained number.
 *
 * Most rules produce NO value at all, and that is correct. The temptation to
 * attach a figure to every finding is precisely the failure mode this guards
 * against.
 */
export const issue = pgTable(
  "issue",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    detectionRunId: uuid("detection_run_id").references(() => detectionRun.id, {
      onDelete: "set null",
    }),
    /** Stable rule identifier, e.g. `split_sum_mismatch`. */
    ruleKey: text("rule_key").notNull(),
    rulesetVersion: text("ruleset_version").notNull(),
    severity: issueSeverity("severity").notNull(),
    status: issueStatus("status").notNull().default("open"),

    /** Polymorphic subject — a work, recording, party, file, or the whole catalog. */
    subjectType: issueSubject("subject_type").notNull(),
    subjectId: uuid("subject_id"),

    title: text("title").notNull(),
    body: text("body"),
    /**
     * The exact rows, fields and ids that triggered this. Non-null because a
     * finding without evidence is not actionable — the user is going to contact
     * a society or correct a split on the strength of it.
     */
    evidence: jsonb("evidence").notNull(),

    // --- Value, governed by the check constraint below ---
    estimatedValue: money("estimated_value"),
    estimatedCurrency: currencyCode("estimated_currency"),
    /**
     * False only when the figure is copied verbatim from a statement (we are
     * quoting the source). True for anything we computed.
     */
    valueIsEstimate: boolean("value_is_estimate").notNull().default(true),
    /** Plain-language derivation, shown to the user. Required when a value exists. */
    estimateBasis: text("estimate_basis"),
    estimateConfidence: estimateConfidence("estimate_confidence"),

    /**
     * Stable dedupe key across detection runs, so re-running updates an existing
     * issue rather than creating a duplicate every time the rules execute.
     */
    fingerprint: text("fingerprint").notNull(),

    firstDetectedAt: createdAt(),
    lastDetectedAt: timestamp("last_detected_at", { withTimezone: true }).notNull().defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    resolutionNote: text("resolution_note"),
    dismissedReason: text("dismissed_reason"),
    dismissedByUserId: userRef("dismissed_by_user_id"),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("issue_fingerprint_key").on(t.orgId, t.fingerprint),
    index("issue_org_status_severity_idx").on(t.orgId, t.status, t.severity),
    index("issue_subject_idx").on(t.orgId, t.subjectType, t.subjectId),
    index("issue_rule_idx").on(t.orgId, t.ruleKey),

    /* COMPLIANCE CONTROL — do not remove without reading
       docs/compliance/claims-lexicon.md. A monetary figure may not exist
       without a stated basis and a confidence level. */
    check(
      "issue_value_requires_basis",
      sql`estimated_value IS NULL OR (estimate_basis IS NOT NULL AND estimate_confidence IS NOT NULL)`,
    ),
    /* A value without its currency is meaningless and Phase 1 does not convert. */
    check(
      "issue_value_requires_currency",
      sql`estimated_value IS NULL OR estimated_currency IS NOT NULL`,
    ),
  ],
);

/**
 * What to actually do about an issue.
 *
 * Carries an `impactBand` rather than a dollar figure, deliberately: it lets us
 * rank "do this first" without minting a number that would need an estimate
 * basis and a compliance caveat.
 *
 * `actionType` is biased toward self-serve actions. The plan's central product
 * risk is that findings whose only remedy is "contact your PRO and wait six
 * months" feel worthless however correct they are.
 */
export const recommendation = pgTable(
  "recommendation",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    issueId: uuid("issue_id").references(() => issue.id, { onDelete: "cascade" }),
    actionType: recommendationAction("action_type").notNull(),
    title: text("title").notNull(),
    rationale: text("rationale"),
    /** How much work this is for the user. Pairs with impact for ranking. */
    effort: impactBand("effort").notNull().default("unknown"),
    impactBand: impactBand("impact_band").notNull().default("unknown"),
    status: recommendationStatus("status").notNull().default("suggested"),
    assignedToUserId: userRef("assigned_to_user_id"),
    dueDate: date("due_date"),
    evidence: jsonb("evidence"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("recommendation_org_status_idx").on(t.orgId, t.status),
    index("recommendation_issue_idx").on(t.issueId),
    index("recommendation_ranking_idx").on(t.orgId, t.impactBand, t.effort),
  ],
);
