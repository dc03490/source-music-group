/* Identifier normalisation and validation.

   Every external identifier enters the system through one of these `parse*`
   functions, which return either a canonical form or null. Storing an
   unnormalised identifier is the root cause of most match failures: the same
   ISRC written `US-ABC-24-00001` and `usabc2400001` must be one value, and the
   same album as UPC-12 and GTIN-14 must be one product.

   What each identifier identifies — the distinction that matters most:
     ISRC  → a recording   (one specific recorded performance)
     ISWC  → a composition (the underlying song)
     IPI   → a party       (a writer or publisher)
     GTIN  → a release     (an album/single as a product)

   See docs/domain/glossary.md. */

export { formatIsrc, isValidIsrc, normalizeIsrc, parseIsrc } from "./isrc";
export { formatIswc, isValidIswc, normalizeIswc, parseIswc } from "./iswc";
export { isValidIpi, normalizeIpi, parseIpi } from "./ipi";
export { isValidGtin, normalizeGtin, parseGtin } from "./gtin";
export {
  artistSimilarity,
  artistTokens,
  jaccardSimilarity,
  normalizeArtist,
  normalizeText,
  normalizeTitle,
  parseTitle,
  splitArtistNames,
  type TitleParts,
} from "./text";
