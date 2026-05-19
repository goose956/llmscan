import { Pool } from 'pg';
import path from 'path';
import fs from 'fs/promises';

// ── Managed key definitions ───────────────────────────────────────────────────

export type ManagedKeyInfo = {
  label: string;
  description: string;
  hint: string;
  secret: boolean;
};

export const MANAGED_KEYS: Record<string, ManagedKeyInfo> = {
  ANTHROPIC_API_KEY: {
    label: 'Anthropic API Key',
    description: 'Powers AI scoring, finding generation, and competitor analysis.',
    hint: 'sk-ant-api03-…',
    secret: true,
  },
  FIRECRAWL_API_KEY: {
    label: 'Firecrawl API Key',
    description: 'Crawls ecommerce product pages to extract content and schema data.',
    hint: 'fc-…',
    secret: true,
  },
  RESEND_API_KEY: {
    label: 'Resend API Key',
    description: 'Sends the PDF report to the user\'s email address.',
    hint: 're_…',
    secret: true,
  },
  RESEND_FROM_EMAIL: {
    label: 'From Email Address',
    description: 'The sender address used in outgoing report emails.',
    hint: 'reports@yourdomain.com',
    secret: false,
  },
  NEXT_PUBLIC_CALENDLY_URL: {
    label: 'Calendly Booking URL',
    description: 'Your Calendly link shown in the upsell CTA section.',
    hint: 'https://calendly.com/your-name',
    secret: false,
  },
};

// ── DB pool (lazy singleton) ──────────────────────────────────────────────────

let _pool: Pool | null = null;

function getSettingsPool(): Pool | null {
  const cs = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!cs) return null;
  if (!_pool) {
    _pool = new Pool({ connectionString: cs, ssl: { rejectUnauthorized: false } });
  }
  return _pool;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Called at startup (instrumentation.ts) to load DB settings into process.env.
 * Skips keys that are already set via environment variables so env vars always win.
 */
export async function loadSettingsIntoEnv(): Promise<void> {
  const pool = getSettingsPool();
  if (!pool) return;
  try {
    const result = await pool.query('SELECT key, value FROM settings');
    for (const row of result.rows) {
      if (!process.env[row.key]) {
        process.env[row.key] = row.value as string;
      }
    }
  } catch {
    // Settings table may not exist yet — non-fatal
  }
}

/**
 * Save a setting. Updates process.env immediately so it takes effect without restart.
 * Persists to DB if available, otherwise falls back to .env.local.
 */
export async function saveSetting(key: string, value: string): Promise<void> {
  if (!Object.keys(MANAGED_KEYS).includes(key)) {
    throw new Error(`Unknown setting key: ${key}`);
  }

  // Apply immediately to the current process
  process.env[key] = value;

  const pool = getSettingsPool();
  if (pool) {
    await pool.query(
      `INSERT INTO settings (key, value, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
      [key, value],
    );
  } else {
    await writeToEnvLocal(key, value);
  }
}

/**
 * Returns the display status of each managed key (whether it's set, and where).
 */
export type SettingStatus = ManagedKeyInfo & {
  key: string;
  isSet: boolean;
};

export function getSettingStatuses(): SettingStatus[] {
  return Object.entries(MANAGED_KEYS).map(([key, info]) => ({
    key,
    isSet: Boolean(process.env[key]),
    ...info,
  }));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function writeToEnvLocal(key: string, value: string): Promise<void> {
  const envPath = path.join(process.cwd(), '.env.local');
  let content = '';
  try {
    content = await fs.readFile(envPath, 'utf-8');
  } catch {
    // File doesn't exist yet
  }
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) {
    content = content.replace(regex, `${key}=${value}`);
  } else {
    content = content.trimEnd() + `\n${key}=${value}\n`;
  }
  await fs.writeFile(envPath, content, 'utf-8');
}
