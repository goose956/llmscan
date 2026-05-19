/**
 * Run once to create the scans table in your PostgreSQL database.
 *
 * Usage:
 *   DATABASE_URL=postgres://... npm run db:setup
 *   or
 *   cp .env.local.example .env.local && npm run db:setup
 */

import { Pool } from 'pg';

const DDL = `
  CREATE TABLE IF NOT EXISTS scans (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url           TEXT NOT NULL,
    domain        TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'processing'
                  CHECK (status IN ('processing', 'complete', 'error')),
    score         INTEGER CHECK (score >= 0 AND score <= 100),
    band          TEXT CHECK (band IN ('green', 'amber', 'red')),
    signals       JSONB,
    findings      JSONB,
    competitor_data JSONB,
    metadata      JSONB,
    email         TEXT,
    error_message TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS scans_status_idx      ON scans (status);
  CREATE INDEX IF NOT EXISTS scans_email_idx       ON scans (email) WHERE email IS NOT NULL;
  CREATE INDEX IF NOT EXISTS scans_created_at_idx  ON scans (created_at DESC);
  CREATE INDEX IF NOT EXISTS scans_domain_idx      ON scans (domain);

  CREATE TABLE IF NOT EXISTS settings (
    key        TEXT PRIMARY KEY,
    value      TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

export async function setupDatabase(connectionString?: string): Promise<void> {
  const cs = connectionString ?? process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!cs) throw new Error('DATABASE_URL is not set.');
  const pool = new Pool({ connectionString: cs, ssl: { rejectUnauthorized: false } });
  try {
    await pool.query(DDL);
  } finally {
    await pool.end();
  }
}

// ── Standalone CLI entry-point ────────────────────────────────────────────────

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('❌  DATABASE_URL (or POSTGRES_URL) is not set.');
  console.error('   Copy .env.local.example to .env.local and fill in your database URL.');
  process.exit(1);
}

console.log('🔧  Setting up database schema…');
setupDatabase(connectionString)
  .then(() => {
    console.log('✅  Table "scans" created (or already exists).');
    console.log('   You can now start the app with: npm run dev');
  })
  .catch((err) => {
    console.error('❌  Setup failed:', err.message);
    process.exit(1);
  });

