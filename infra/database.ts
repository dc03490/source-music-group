/// <reference path="../.sst/platform/config.d.ts" />

import { isProduction, vpc } from "./network";

/* Aurora Serverless v2 PostgreSQL.

   PostgreSQL rather than DynamoDB is a hard requirement, not a preference: the
   matching engine's fuzzy tier generates candidates with a pg_trgm GIN index and
   similarity(). See docs/adr/0003-postgres-not-dynamodb.md.

   The pg_trgm extension itself is created by migration 0000, not here —
   drizzle-kit does not emit CREATE EXTENSION, so it was added to the migration
   by hand. Without it the three trigram indexes fail on a fresh database. */

export const database = new sst.aws.Aurora("Database", {
  engine: "postgres",
  /* Pinned rather than floating. A major-version jump is a migration event for a
     schema holding financial data, not something to inherit silently. */
  version: "16.6",
  database: "source_royalty",

  /* Inside the VPC, private subnets only — no public endpoint. */
  vpc,

  /* RDS Proxy. Lambda without connection pooling exhausts Postgres connections
     under any real concurrency: each cold container opens its own. The proxy
     also lets IAM database authentication work cleanly, which is what removes
     the database password entirely. */
  proxy: true,

  scaling: isProduction
    ? {
        /* Production does not scale to zero. A cold Aurora resume adds seconds
           to the first request, which is not acceptable on a signed-in
           dashboard. 0.5 ACU is the practical floor. */
        min: "0.5 ACU",
        max: "8 ACU",
      }
    : {
        /* Non-production scales to zero after inactivity, which is the main
           reason to use Serverless v2 for staging and dev at all. Accept the
           resume latency here. */
        min: "0 ACU",
        max: "2 ACU",
        pauseAfter: "10 minutes",
      },

  /* The Data API is deliberately NOT enabled. It exists to reach Aurora from
     outside a VPC over HTTPS — precisely the pattern this architecture rejected
     (see ADR 0002). Enabling it would quietly re-open the access path the VPC
     isolation is meant to close. It also has result-size limits that a
     statement-line query would hit. */
  dataApi: false,
});
