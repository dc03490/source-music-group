# 0005 — Ingest statement files; do not design around royalty APIs

- **Status:** Accepted
- **Date:** 2026-07-21

## Context

The product vision describes "connectors" to Amuse, Spotify for Artists, Apple Music, The MLC,
SoundExchange, ASCAP, BMI, SESAC, YouTube, and TikTok — positioning Source Royalty as the layer
every other dashboard feeds into.

The problem is that **almost none of these expose a third-party API for royalty data**:

- **Spotify for Artists** — no public API. The Spotify Web API returns catalog metadata, not earnings.
- **SoundExchange, ASCAP, BMI, SESAC** — no public royalty APIs.
- **Amuse, DistroKid, TuneCore** — no public statement APIs.
- **The MLC** — a public API exists, but for **work search**, not for a member's royalty statements.
- **Apple Music** — the API is catalog metadata; earnings live in Apple Music for Artists.

What every one of these *does* provide is a **downloadable statement** (CSV, XLSX, or PDF) that
the rights holder is entitled to export.

## Decision

Ingestion is **statement-file-first**. The pipeline is built around parsing files the user
already has the right to download, normalised into one model.

Real third-party APIs are used only where they genuinely exist and only for **metadata
enrichment** — MLC public work search, Spotify Web API for catalog metadata, MusicBrainz. Never
presented as a royalty data source.

No architecture is built speculatively for royalty APIs that do not exist.

## Consequences

**Buys:**

- The product works today, with no partnership, contract, or API access as a prerequisite.
- No dependency on a counterparty's roadmap or willingness.
- The hard part becomes normalisation and matching — which is the actual defensible asset, and
  is where a competitor cannot shortcut.

**Costs:**

- **Format sprawl is the permanent cost of this product.** Every distributor and PRO has a
  different layout and changes it without notice. This never ends. It is contained by header
  fingerprinting, a user-facing column mapper, and golden fixtures — but it is ongoing manual work.
  A runbook for this (`runbooks/add-statement-format.md`) is an M2 deliverable.

## First target format

Duka's catalog is distributed through **Amuse**, so the Amuse royalty export is the first format
taken end to end (confirmed 2026-07-21). Note what it does and does not cover:

| | Amuse provides | Still needed from elsewhere |
| --- | --- | --- |
| Side of the song | Master / recording | Publishing (composition) |
| Keyed on | ISRC, or UPC + track no. | ISWC; work title + IPI with no ISRC at all |
| Royalty types | Distributor revenue from DSPs | Performance (PRO), mechanical (The MLC), neighbouring (SoundExchange) |

Amuse alone therefore cannot exercise work-side matching, ISWC keying, or the writer-side vs
publisher-side share model. A PRO statement and an MLC statement are required before the matching
ladder and the split rules can be considered tested — which is why the plan calls for a
**structurally different** second source rather than a second distributor.
- **User friction is the biggest product risk.** The user has to find and export their
  statements. Many artists do not know their distributor login. This is a plausible way the
  product fails, and it must be tested with real people during M2 rather than assumed.
- PDF-only statements (common from PROs) need a separate extraction path and are deferred to
  Phase 2.
- The marketing word "connect" must not imply an automated integration that does not exist.

## Alternatives considered

**Build the connector layer now with stubs, swap in real APIs later.** Rejected. It designs the
system around access that may never materialise, and the stubs would encode assumptions about
response shapes nobody can verify. It also invites marketing copy describing integrations that do
not exist.

**Treat official data access as a gating dependency and pursue partnerships first.** Rejected as
a sequencing choice: it blocks all engineering on business development with an uncertain timeline,
and even a successful partnership would not remove the need to parse files from everyone else.

**Screen-scrape the portals.** Rejected. Fragile, and generally prohibited by terms of service.

**Ask users to forward statement emails.** Considered as a lower-friction intake and not rejected
outright — it is a plausible Phase 2 convenience on top of this same parsing pipeline, since the
attachment is the same file.
