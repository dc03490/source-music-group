/// <reference path="../.sst/platform/config.d.ts" />

/* Cognito — identity ONLY.

   Cognito authenticates users. It does NOT decide what they can do. There is no
   concept of a business organisation in Cognito, so `organization`, `membership`
   and `invitation` in Aurora are the authority for authorization, checked
   server-side on every request and never read from a token claim.

   That trade is recorded in docs/adr/0004-cognito-with-owned-org-model.md: we
   own invitations and role management (real work, on the most security-sensitive
   surface in the product), and in exchange authorization is enforceable in SQL
   and by row-level security without a network call.

   Practical consequence for anyone adding a feature: a Cognito group is NOT a
   role. Do not add one and treat it as authorization. */

export const userPool = new sst.aws.CognitoUserPool("UserPool", {
  /* Sign in with email rather than a separate username. One fewer credential
     for the user to lose, and the invitation flow is email-based anyway. */
  usernames: ["email"],

  /* TOTP multi-factor. Required for owner and admin roles — enforced in
     application code, since Cognito's `optional` setting only makes the
     mechanism available. SMS is deliberately not offered: SIM-swap is a real
     attack against accounts that control financial data. */
  mfa: "optional",
  softwareToken: true,
});

export const userPoolClient = userPool.addClient("Console");
