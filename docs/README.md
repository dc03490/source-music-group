# Source engineering docs

Start here. These docs cover **why** things are built the way they are, **how data flows**
across boundaries, and **how to operate** the system. They deliberately do not restate what
the code already says — no type dumps, no per-function API reference. That material rots and
then misleads.

## Start-here paths

### New developer, first day

1. [domain/glossary.md](domain/glossary.md) — read this first. The music-rights domain is
   genuinely arcane, and most expensive mistakes here come from assuming a term means what it
   sounds like. In particular: a recording and a composition are different things with
   different identifiers, different owners, and different money.
2. [architecture/overview.md](architecture/overview.md) — what the pieces are.
3. [adr/](adr/) — read `0001`–`0010` in order. This is why the system looks like it does,
   including the stacks we chose *against*.
4. [architecture/environments.md](architecture/environments.md) — get it running.

### Adding support for a new statement format (the most common ongoing task)

- `runbooks/add-statement-format.md` — *not yet written (M2). It is written by mapping the second
  real format and recording what actually happened, rather than from theory.*

### Working on the database schema

1. [domain/schema.md](domain/schema.md) — the reasoning, especially the decisions that look wrong
   until you know the domain.
2. [domain/schema.generated.md](domain/schema.generated.md) — the structural reference, generated
   from the Drizzle schema.
3. [runbooks/migrations.md](runbooks/migrations.md) — how to change it safely.

### Working on matching or issue rules

- `domain/matching.md` *(M3)*, then `domain/rules.generated.md` *(M4, generated from the rule
  registry)*

### Writing any user-facing copy

- [compliance/claims-lexicon.md](compliance/claims-lexicon.md) — non-optional. CI fails on
  prohibited claims, including in these docs.

### Operating / on call

- [runbooks/](runbooks/) — deploy, migrations, restore, incident response.

## Layout

| Path | Contents |
| --- | --- |
| `architecture/` | System shape, data flow, security model, environments |
| `adr/` | Architecture Decision Records — immutable once accepted |
| `domain/` | The music-rights domain: glossary, schema, matching, rules |
| `runbooks/` | Operational procedures |
| `compliance/` | Language rules and data-handling policy |

## Conventions

- **Markdown in the repo, reviewed in the same PR as the code it describes.** A doc that lands
  a week later does not land.
- **Diagrams are [Mermaid](https://mermaid.js.org/)**, so they are diffable text and render on
  GitHub. No binary image assets — they rot invisibly.
- **`*.generated.md` files are generated.** Never hand-edit them; run `pnpm docs:generate`.
  CI fails if they are stale, which is what stops a new rule shipping undocumented.
- **ADRs are immutable.** To change a decision, add a new ADR that supersedes the old one and
  link both ways. Do not edit history — the reasoning behind a rejected option is often the
  most useful thing in the repo.

## Status

This documentation set is being built alongside Phase 1 (the data foundation). Files listed in
the plan but not yet present belong to a later milestone; each milestone ships its own docs.
