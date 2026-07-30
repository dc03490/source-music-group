/// <reference path="../.sst/platform/config.d.ts" />

import { isProduction } from "./network";

/* Raw statement file storage.

   Holds the original uploaded statements, which are the source of truth that
   makes reparsing possible (docs/adr/0008-raw-immutable-normalized-derived.md).
   They contain earnings data AND third parties' PII — co-writers' names and IPIs
   from people who never signed up for this product. That makes this the most
   sensitive bucket in the system.

   Object keys are `{org_id}/{uuid}`, never the original filename: filenames leak
   artist and release names into object keys, which then appear in logs, metrics
   and access records.

   Access is `private` (the SST default) — no public read, ever. Downloads go
   through a route handler that re-verifies org ownership, issues a short-lived
   presigned GET, and writes an audit_event. */

export const statementBucket = new sst.aws.Bucket("StatementFiles", {
  /* Versioning in production only. It is a genuine safety net against a bad
     delete or an overwrite, but it also means "deleted" objects persist as
     noncurrent versions — which interacts with the hard-delete obligation in
     the data policy. The retention job must delete ALL versions, not just
     current ones. Non-production skips it to keep cleanup simple. */
  versioning: isProduction,

  transform: {
    bucket: (args) => {
      /* Server-side encryption with KMS. This is what lets the data policy
         honestly say "encrypted at rest using AWS KMS" — a claim that must not
         be made without it. `aws:kms` with the S3-managed key is sufficient
         here; a customer-managed CMK would be required only if we needed key
         rotation control or cross-account grants, and claiming
         customer-managed keys without configuring one would be false. */
      args.serverSideEncryptionConfiguration = {
        // `rule` is singular — a single object, not a list.
        rule: {
          applyServerSideEncryptionByDefault: { sseAlgorithm: "aws:kms" },
          /* S3 Bucket Keys cut KMS request costs substantially on a bucket that
             will hold many small objects. */
          bucketKeyEnabled: true,
        },
      };
    },

    policy: (args) => {
      /* Reject any non-TLS request outright. Without this, a misconfigured
         client could transmit an earnings statement over plaintext HTTP and
         nothing would object. */
      args.policy = $jsonStringify({
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "DenyInsecureTransport",
            Effect: "Deny",
            Principal: "*",
            Action: "s3:*",
            Resource: [$interpolate`${args.bucket}`, $interpolate`${args.bucket}/*`],
            Condition: { Bool: { "aws:SecureTransport": "false" } },
          },
        ],
      });
    },
  },
});
