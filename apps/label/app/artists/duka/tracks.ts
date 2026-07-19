/* Duka catalog — single source of truth for every Spotify-derived fact.
   All 10 track titles + URLs verified on July 19, 2026 against the live Spotify
   artist embed (open.spotify.com/embed/artist/0oxAY1bzauffvCA5m6tsBZ) and
   cross-checked per track via the Spotify oEmbed endpoint (title match).
   Credits: the embed lists "Johnson, Duka" for Min Type and "Duka, Rose the
   Healer" for Lifetime — both rendered; no other credits are verifiable.
   Titles + links only — release dates and artwork are not verifiable without
   invention; artwork appears via Spotify's own embeds.
   Only list tracks that can be verified — never invent releases. */

export const SPOTIFY_ARTIST = "https://open.spotify.com/artist/0oxAY1bzauffvCA5m6tsBZ";

export type Track = {
  title: string;
  url: string;
  /** Verified co-credited artist (from the Spotify embed credit line). */
  credit?: string;
};

const MIN_TYPE: Track = {
  title: "Min Type",
  url: "https://open.spotify.com/track/78bd60KzEPQun7OXVEwNmQ",
  credit: "Johnson",
};

export const TRACKS: Track[] = [
  { title: "Toxic", url: "https://open.spotify.com/track/6yQbpdfFNGP5Q2SOxyxlVY" },
  MIN_TYPE,
  { title: "Confidential", url: "https://open.spotify.com/track/3PnjEgXyfksI9UJQGs3wj9" },
  { title: "Lonely AF", url: "https://open.spotify.com/track/3CbxrNna6DagX57heYMZDr" },
  { title: "No Love In Atlanta", url: "https://open.spotify.com/track/6Cnt2jfxyrSxH7hdYWUB5a" },
  { title: "Neww", url: "https://open.spotify.com/track/50DGuABXbG78h47GCootFY" },
  {
    title: "Lifetime",
    url: "https://open.spotify.com/track/2hV2435q6Ce9C0piDhwzf2",
    credit: "Rose the Healer",
  },
  { title: "Spin", url: "https://open.spotify.com/track/6o7ZlBqsxm6IyHr6yudvVL" },
  { title: "Broken", url: "https://open.spotify.com/track/2OLSWPqv6MUJUxlFQ49Ud1" },
  {
    title: "No Love In Atlanta (Pt. II)",
    url: "https://open.spotify.com/track/0hiaL12aZ10VUlVYUp6wrd",
  },
];

/* LATEST — verified on July 19, 2026: the Spotify artist page shows a
   "Latest Release • Single" card for Min Type with <time datetime="2026">.
   Year is the only date granularity present in the dump — do not invent
   a month or day. */
export const LATEST = {
  track: MIN_TYPE, // Min Type (with Johnson)
  year: "2026",
};
