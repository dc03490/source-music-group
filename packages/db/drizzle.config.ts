import { defineConfig } from "drizzle-kit";

/* Drizzle Kit configuration.

   `db:generate` diffs the schema against the committed migrations and writes a
   new .sql file. It does NOT need a database connection, which is why the
   schema and its migrations can be developed and reviewed before Aurora exists.

   `db:migrate` does need a connection, supplied via DATABASE_URL. In every
   deployed environment that URL is built from an IAM auth token rather than a
   password — there is no database password to store. See
   docs/runbooks/migrations.md. */

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/index.ts",
  out: "./migrations",
  /* Plain .sql migrations, reviewed like any other code. For a schema that is a
     designated Protected Area, reviewable SQL beats an opaque migration engine. */
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/placeholder",
  },
});
