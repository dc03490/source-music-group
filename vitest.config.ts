import { defineConfig } from "vitest/config";

/* Single root Vitest config for the whole monorepo.

   One config and one process rather than per-package configs: the backend
   packages (db/domain/ingest) are plain TypeScript with no DOM, so they share
   the same `node` environment and there is nothing to vary. If UI component
   tests are added later they need jsdom, and that is the point to split this
   into `test.projects`.

   `passWithNoTests` is deliberately NOT set — a glob that stops matching should
   fail loudly rather than report a green run over zero tests. */

export default defineConfig({
  test: {
    include: ["packages/*/src/**/*.test.ts", "apps/*/**/*.test.ts", "tools/**/*.test.ts"],
    environment: "node",
    /* Money and identifier logic is pure and fast; no long timeouts needed. */
    testTimeout: 10_000,
  },
});
