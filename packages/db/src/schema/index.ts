/* The Source Royalty domain schema.

   Read in this order — each layer depends on the one above:
     enums     the domain's vocabulary
     columns   shared column conventions (money, ids, soft delete)
     tenancy   organisations, membership, invitations, audit
     catalog   works, recordings, releases, identifiers, links
     parties   parties, ownership shares, registrations
     ingest    statement files, lines, formats, match aliases
     analysis  issues and recommendations

   Before changing anything in `parties`, or the value columns in `analysis`,
   read docs/domain/glossary.md and docs/compliance/claims-lexicon.md. Several
   fields exist specifically to prevent a plausible simplification that would
   produce confidently wrong findings. */

export * from "./enums";
export * from "./columns";
export * from "./tenancy";
export * from "./catalog";
export * from "./parties";
export * from "./ingest";
export * from "./analysis";
