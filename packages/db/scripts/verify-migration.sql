-- Post-migration verification.
--
-- Run this after applying migration 0000 to confirm the things that could
-- plausibly have gone wrong. `drizzle-kit migrate` exiting 0 proves the
-- statements ran; it does not prove the RESULT is what we intended.
--
--   psql "$DATABASE_URL" -f packages/db/scripts/verify-migration.sql
--
-- Every row of output should read PASS. Anything else is a real problem.

\echo '=== 1. Table count (expect 27) ==='
SELECT
  CASE WHEN count(*) = 27 THEN 'PASS' ELSE 'FAIL' END AS result,
  count(*) AS actual,
  27 AS expected
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

\echo ''
\echo '=== 2. pg_trgm extension installed ==='
-- Without this the three trigram indexes could not have been created, so a
-- failure here means the fuzzy matching tier has no index to read.
SELECT
  CASE WHEN count(*) = 1 THEN 'PASS' ELSE 'FAIL' END AS result,
  count(*) AS found
FROM pg_extension
WHERE extname = 'pg_trgm';

\echo ''
\echo '=== 3. Trigram indexes exist and use GIN (expect 3) ==='
SELECT
  CASE WHEN count(*) = 3 THEN 'PASS' ELSE 'FAIL' END AS result,
  count(*) AS actual,
  string_agg(indexname, ', ' ORDER BY indexname) AS indexes
FROM pg_indexes
WHERE schemaname = 'public' AND indexdef LIKE '%gin_trgm_ops%';

\echo ''
\echo '=== 4. Compliance CHECK constraints on issue (expect 2) ==='
-- These are the controls that make it impossible to store a monetary figure
-- without recording how it was derived. See docs/compliance/claims-lexicon.md.
SELECT
  CASE WHEN count(*) = 2 THEN 'PASS' ELSE 'FAIL' END AS result,
  count(*) AS actual,
  string_agg(conname, ', ' ORDER BY conname) AS constraints
FROM pg_constraint
WHERE conrelid = 'issue'::regclass
  AND contype = 'c'
  AND conname LIKE 'issue_value_requires%';

\echo ''
\echo '=== 5. The compliance CHECK actually rejects a bad row ==='
-- The single most important assertion in this file: prove the constraint bites
-- rather than merely existing. Expect PASS, meaning the insert was refused.
DO $$
DECLARE
  org uuid;
  refused boolean := false;
BEGIN
  INSERT INTO organization (created_by_user_id, name, slug)
  VALUES ('verify-script', 'Verify Co', 'verify-' || substr(md5(random()::text), 1, 8))
  RETURNING id INTO org;

  BEGIN
    -- A dollar figure with no estimate_basis and no confidence must be refused.
    INSERT INTO issue (
      org_id, rule_key, ruleset_version, severity, subject_type,
      title, evidence, estimated_value, estimated_currency, fingerprint
    ) VALUES (
      org, 'verify_probe', 'v0', 'low', 'organization',
      'probe', '{}'::jsonb, 1234.56, 'USD', 'verify-probe-' || org::text
    );
  EXCEPTION WHEN check_violation THEN
    refused := true;
  END;

  IF refused THEN
    RAISE NOTICE 'PASS  unexplained monetary value was rejected';
  ELSE
    RAISE WARNING 'FAIL  an unexplained monetary value was ACCEPTED';
  END IF;

  -- Clean up regardless of outcome.
  DELETE FROM issue WHERE org_id = org;
  DELETE FROM organization WHERE id = org;
END $$;

\echo ''
\echo '=== 6. COMMENT ON statements landed (expect >= 30) ==='
SELECT
  CASE WHEN count(*) >= 30 THEN 'PASS' ELSE 'FAIL' END AS result,
  count(*) AS comments_found
FROM pg_description d
JOIN pg_class c ON c.oid = d.objoid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public';

\echo ''
\echo '=== 7. Partial unique indexes on soft-deletable tables (expect >= 5) ==='
-- A non-partial unique index would make re-creating a soft-deleted row collide
-- with a row the user believes is gone.
SELECT
  CASE WHEN count(*) >= 5 THEN 'PASS' ELSE 'FAIL' END AS result,
  count(*) AS actual
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexdef LIKE '%UNIQUE%'
  AND indexdef LIKE '%deleted_at IS NULL%';

\echo ''
\echo '=== 8. Money columns are numeric(18,6) (expect 0 offenders) ==='
SELECT
  CASE WHEN count(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS result,
  count(*) AS offenders,
  coalesce(string_agg(table_name || '.' || column_name, ', '), 'none') AS detail
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name IN (
    'reported_total', 'parsed_total', 'gross_amount',
    'net_amount', 'amount_base', 'estimated_value'
  )
  AND NOT (numeric_precision = 18 AND numeric_scale = 6);

\echo ''
\echo '=== 9. Every table except organization has org_id (expect 0 offenders) ==='
SELECT
  CASE WHEN count(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS result,
  count(*) AS offenders,
  coalesce(string_agg(t.table_name, ', '), 'none') AS detail
FROM information_schema.tables t
WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
  AND t.table_name <> 'organization'
  AND t.table_name NOT LIKE '\_\_drizzle%'
  AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns c
    WHERE c.table_schema = 'public'
      AND c.table_name = t.table_name
      AND c.column_name = 'org_id'
  );

\echo ''
\echo 'Done. Every result column above should read PASS.'
