# 0004 — Use Cognito for identity, with our own organisation model

- **Status:** Accepted
- **Date:** 2026-07-21

## Context

The product is multi-tenant from the first user: a manager or label has several people who need
scoped access to a catalog, with roles (owner, admin, analyst, viewer), invitations, and the
ability to revoke access.

Cognito is the AWS-native option and is very cheap. But Cognito models **users and groups**, not
business organisations. It has no first-class concept of "an organisation you can be invited to,
with a role scoped to it".

## Decision

**Cognito is the identity provider only** — authentication, password/MFA handling, session
issuance. Its `sub` is stored as `user_id`.

**Authorization is ours.** `organization`, `membership`, and `invitation` tables in Aurora are the
authority for who can do what. Role checks are made server-side against `membership`, never from a
client-supplied value or a token claim.

## Consequences

**Buys:**

- Cheap, and one less vendor and DPA.
- TOTP MFA, password policy, and session revocation without building them.
- Authorization is enforceable **in SQL**, including via row-level security, because membership is
  a table rather than a remote API call. A managed org provider would require mirroring its state
  into the database via webhooks anyway — this skips that synchronisation problem and its failure
  modes entirely.
- No dependency on a third party's org model matching ours as requirements grow (roster access,
  client sub-accounts).

**Costs:**

- **Invitations, role management, and member removal are code we own**, on the most
  security-sensitive surface in the product. This is real work and it lands in M0 — it must be
  budgeted, not discovered later.
- Every one of those flows needs its own tests and audit-log coverage.
- Email delivery for invitations becomes our problem (SES).
- If enterprise SSO/SAML is needed later, Cognito's story is weaker than a dedicated provider's,
  and this decision may need superseding.

## Alternatives considered

**A managed auth provider with built-in organisations (e.g. Clerk Organizations).** Genuinely
attractive: orgs, invitations, roles, and MFA all work out of the box, removing weeks of work.
Rejected on two grounds. First, it is a paid tier and an additional vendor holding user data,
against an explicit preference for consolidating on AWS ([0002](0002-aws-over-managed-vercel-backend.md)).
Second, authorization state would still need mirroring into Aurora so that RLS and SQL-level
checks can use it — so the `membership` table gets built either way, and the provider adds a
synchronisation path that can drift. Given the table exists regardless, owning the flows around
it is a smaller increment than it first appears.

**Cognito groups as organisations.** Rejected. Groups are flat, global, and not designed for
per-tenant role scoping; expressing "viewer in org A, admin in org B" is awkward and the
authorization check ends up in token claims, which are client-visible and stale until refresh.

**Roll our own authentication too.** Rejected without much deliberation. Password storage, MFA,
and session management are solved problems with catastrophic failure modes.
