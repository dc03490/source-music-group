/* @source/domain — pure, dependency-free domain logic.

   This package holds the parts of Source Royalty that must be correct and
   testable in isolation: identifier normalisation, the matching scorer, the
   deterministic issue rules, and the compliance lexicon. It has no database
   client, no AWS SDK, and no React — so every export here is trivially unit
   testable and safe to import from anywhere, including tooling. */

export * from "./compliance";
export * from "./identifiers";
