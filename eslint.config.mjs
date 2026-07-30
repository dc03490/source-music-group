import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

/* Root ESLint flat config.

   Before this file existed, `turbo run lint` silently passed because no app
   declared a `lint` script and no config existed anywhere — so the task was a
   no-op that looked green. Everything below is therefore net-new enforcement
   over code that has never been linted.

   Scope is deliberately modest: correctness rules that catch real defects, not
   stylistic preferences. Formatting is not enforced here. */

export default tseslint.config(
  {
    // Build output, vendored code, and the archived pre-monorepo site.
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/.sst/**",
      "**/dist/**",
      "**/coverage/**",
      "**/next-env.d.ts",
      "**/*.tsbuildinfo",
      "archive/**",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      /* Unused vars are a real signal, but leading-underscore is the
         conventional opt-out for deliberately-ignored bindings. */
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
      ],
      /* `any` defeats the point of a strict TS config, but it is a warning
         rather than an error so it never blocks a legitimate escape hatch. */
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  /* React surfaces: the Next.js apps and the shared UI package. `packages/ui`
     is included because it ships React components with hooks and <img>, and it
     already carries inline eslint-disable comments for these exact rules — the
     plugins must be registered here or those comments become errors.
     The backend packages (db/domain/ingest) have no DOM and are excluded. */
  {
    files: ["apps/*/**/*.{ts,tsx}", "packages/ui/**/*.{ts,tsx}"],
    plugins: { "@next/next": nextPlugin, "react-hooks": reactHooks },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      /* App Router only — there is no `pages/` directory to resolve against. */
      "@next/next/no-html-link-for-pages": "off",
    },
  },

  /* Config files at the repo root run in Node and are not part of any app. */
  {
    files: ["*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.node },
  },

  /* SST infrastructure definitions.

     `/// <reference path="./.sst/platform/config.d.ts" />` is not a style choice
     here — it is how SST exposes its globals ($config, sst.aws.*, $interpolate)
     to the type checker. There is no import form, so the triple-slash rule has
     to be off for these files specifically.

     These are also typechecked separately (tsconfig.infra.json), because the
     referenced file only exists after `pnpm sst:install`. */
  {
    files: ["infra/**/*.ts", "sst.config.ts"],
    languageOptions: { globals: globals.node },
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
);
