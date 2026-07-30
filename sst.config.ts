/// <reference path="./.sst/platform/config.d.ts" />

/* SST configuration for the Source Royalty console and its AWS infrastructure.
 *
 * STATUS: never deployed. These definitions typecheck against the SST platform
 * types but have not been applied to an AWS account, so treat the first
 * `sst deploy` as a debugging session rather than a formality.
 *
 * Scope note: this stack covers the PRODUCT only. The four marketing sites
 * (apps/web, apps/royalty, apps/publishing, apps/label) stay on Vercel with
 * their existing manual deploy flow — see docs/runbooks/deploy.md.
 *
 * Resource definitions live in infra/, one file per concern, because each
 * carries enough reasoning that a single file would bury it:
 *   infra/network.ts   VPC, and why there is no NAT gateway
 *   infra/database.ts  Aurora Serverless v2, RDS Proxy, why not the Data API
 *   infra/storage.ts   S3 for raw statements, KMS, TLS-only policy
 *   infra/auth.ts      Cognito as identity only, with authorization in Aurora
 *
 * Not yet defined, because apps/console does not exist yet:
 *   - sst.aws.Nextjs for the console (needs the app to point at)
 *   - sst.aws.StepFunctions for the ingestion pipeline (needs the Lambdas)
 *   - sst.aws.Email for SES (invitations, deletion receipts)
 * Those arrive with the app itself rather than being stubbed here.
 */

export default $config({
  app(input) {
    return {
      name: "source-royalty",
      home: "aws",
      /* Retain production resources on stack removal. Aurora holding real
         royalty data must not be destroyable by an errant `sst remove`. */
      removal: input?.stage === "production" ? "retain" : "remove",
      /* Guards against `sst deploy --stage production` run casually. */
      protect: input?.stage === "production",
      providers: {
        aws: {
          region: "us-east-1",
          defaultTags: {
            tags: {
              Project: "source-royalty",
              Stage: input?.stage ?? "unknown",
              ManagedBy: "sst",
            },
          },
        },
      },
    };
  },

  async run() {
    /* Imported for side effects: each module constructs its resources. Ordering
       is expressed through imports between them (database imports the vpc). */
    const network = await import("./infra/network");
    const database = await import("./infra/database");
    const storage = await import("./infra/storage");
    const auth = await import("./infra/auth");

    /* Outputs are what `sst deploy` prints. Deliberately no secrets: the
       database password does not exist (IAM authentication), and the bucket is
       reached only via presigned URLs issued server-side. */
    return {
      vpc: network.vpc.id,
      databaseHost: database.database.host,
      databasePort: database.database.port,
      statementBucket: storage.statementBucket.name,
      userPool: auth.userPool.id,
      userPoolClient: auth.userPoolClient.id,
    };
  },
});
