import {
  bigint,
  index,
  inet,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import {
  createdAt,
  deletedAt,
  notDeleted,
  primaryId,
  sha256Hex,
  updatedAt,
  userRef,
} from "./columns";
import { invitationStatus, orgRole } from "./enums";

/* Tenancy and audit.

   Cognito is the identity provider ONLY. It has no concept of a business
   organisation, so `organization` + `membership` here are the authority for
   authorization — checked server-side, never from a token claim. That is a
   deliberate trade recorded in docs/adr/0004-cognito-with-owned-org-model.md:
   we own invitations and role management, and in exchange authorization is
   enforceable in SQL (and by row-level security) without a network call. */

export const organization = pgTable(
  "organization",
  {
    id: primaryId(),
    /** Cognito `sub` of the user who created the org. */
    createdByUserId: userRef("created_by_user_id").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    /**
     * How long statement files are retained after the account goes inactive.
     * A real number, because the data policy must state one rather than say
     * "as long as necessary".
     */
    retentionMonths: integer("retention_months").notNull().default(24),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [uniqueIndex("organization_slug_key").on(t.slug).where(notDeleted())],
);

/**
 * Who may act within an organisation, and as what.
 *
 * The authorization source of truth. `viewer` cannot commit a statement or edit
 * a share; those checks read this table server-side.
 */
export const membership = pgTable(
  "membership",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    /** Cognito `sub`. Not an FK — the user record lives in Cognito. */
    userId: userRef("user_id").notNull(),
    role: orgRole("role").notNull(),
    createdAt: createdAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    uniqueIndex("membership_org_user_key").on(t.orgId, t.userId).where(notDeleted()),
    index("membership_user_idx").on(t.userId),
  ],
);

/**
 * Pending invitations.
 *
 * Ours to build because Cognito has no org model. The token is stored HASHED:
 * an invitation token is a bearer credential, and a leaked backup must not hand
 * out organisation access.
 */
export const invitation = pgTable(
  "invitation",
  {
    id: primaryId(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: orgRole("role").notNull(),
    /** SHA-256 of the invitation token. Never store the token itself. */
    tokenHash: sha256Hex("token_hash").notNull(),
    status: invitationStatus("status").notNull().default("pending"),
    invitedByUserId: userRef("invited_by_user_id").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    acceptedByUserId: userRef("accepted_by_user_id"),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("invitation_token_hash_key").on(t.tokenHash),
    index("invitation_org_status_idx").on(t.orgId, t.status),
    index("invitation_email_idx").on(t.email),
  ],
);

/**
 * Append-only audit trail.
 *
 * Not overhead: the long-term positioning of this product is "the
 * normalisation, matching and audit layer", so this table IS part of the
 * product. Enforced append-only at the GRANT level — the application database
 * role gets INSERT and SELECT, with UPDATE and DELETE revoked. That is a
 * schema-level guarantee rather than a convention someone can forget.
 *
 * `bigint` identity rather than a uuid: high write volume, never joined on by
 * id, always read in time order.
 */
export const auditEvent = pgTable(
  "audit_event",
  {
    id: bigint("id", { mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
    /** Nullable so an org can be hard-deleted without destroying its audit history. */
    orgId: uuid("org_id").references(() => organization.id, { onDelete: "set null" }),
    actorUserId: userRef("actor_user_id"),
    /** Dotted action name, e.g. `statement_file.committed`. */
    action: text("action").notNull(),
    entityType: text("entity_type"),
    entityId: text("entity_id"),
    ip: inet("ip"),
    userAgent: text("user_agent"),
    /** Action-specific detail. Must NEVER contain statement rows or PII. */
    metadata: jsonb("metadata"),
    createdAt: createdAt(),
  },
  (t) => [
    index("audit_event_org_created_idx").on(t.orgId, t.createdAt),
    index("audit_event_entity_idx").on(t.entityType, t.entityId),
    index("audit_event_action_idx").on(t.action),
  ],
);
