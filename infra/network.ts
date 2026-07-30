/// <reference path="../.sst/platform/config.d.ts" />

/* Network foundation.

   The decisive property of this whole architecture: Aurora has NO public
   endpoint and is reachable only from inside this VPC. That is the reason the
   console is hosted on AWS rather than Vercel — see
   docs/adr/0002-aws-over-managed-vercel-backend.md.

   NAT is deliberately NOT enabled by default. A NAT gateway is a standing
   monthly charge (roughly $32/month per AZ plus data processing) that routinely
   surprises people on serverless VPC architectures. Lambdas here need to reach
   S3, Secrets Manager and KMS — all of which are reachable via VPC endpoints,
   which is cheaper (the S3 gateway endpoint is free). NAT becomes necessary only
   when something must call the public internet, which in Phase 2 will be the
   external metadata lookups (MLC public search, MusicBrainz). Turn it on then,
   deliberately, rather than paying for it from day one. */

/** True only for the production stage, for retention and sizing decisions. */
export const isProduction = $app.stage === "production";

export const vpc = new sst.aws.Vpc("Vpc", {
  /* Two AZs: Aurora requires a subnet group spanning at least two, and it is
     the minimum for any meaningful availability. */
  az: 2,

  /* No NAT gateway. See the note above before changing this — it is a cost
     decision, not an oversight. */
  nat: undefined,

  /* A bastion is how a developer reaches Aurora locally without giving the
     database a public endpoint. Non-production only: production database access
     should be an audited, deliberate act, not a convenience. */
  bastion: !isProduction,
});
