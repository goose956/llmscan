import { Pool } from 'pg';
import type { ScanRecord, ScanStatus, ScoreBand, SignalScore, Finding, CompetitorProbeResult, PageMetadata } from './types';

// ─── Connection pool ──────────────────────────────────────────────────────────

let pool: Pool | null = null;

function getPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    return null;
  }
  if (!pool) {
    pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  }
  return pool;
}

// ─── In-memory fallback (development / demo) ─────────────────────────────────

// Persist across Next.js hot reloads in dev by attaching to global
const g = global as typeof global & {
  __llmscan_memStore?: Map<string, ScanRecord>;
  __llmscan_warnedMemory?: boolean;
};
if (!g.__llmscan_memStore) g.__llmscan_memStore = new Map<string, ScanRecord>();
const memoryStore = g.__llmscan_memStore;
let warnedAboutMemory = g.__llmscan_warnedMemory ?? false;

function getStore(): 'db' | 'memory' {
  if (getPool()) return 'db';
  if (!warnedAboutMemory) {
    console.warn(
      '⚠️  DATABASE_URL not set — using in-memory scan store. ' +
        'Results will be lost on restart. Set DATABASE_URL for production.'
    );
    warnedAboutMemory = true;
    g.__llmscan_warnedMemory = true;
  }
  return 'memory';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToScanRecord(row: any): ScanRecord {
  return {
    id: row.id,
    url: row.url,
    domain: row.domain,
    status: row.status as ScanStatus,
    score: row.score ?? null,
    band: (row.band as ScoreBand) ?? null,
    signals: row.signals ?? null,
    findings: row.findings ?? null,
    competitorData: row.competitor_data ?? null,
    metadata: row.metadata ?? null,
    email: row.email ?? null,
    errorMessage: row.error_message ?? null,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function createScan(url: string): Promise<string> {
  const id = crypto.randomUUID();
  const domain = (() => {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
  })();
  const now = new Date().toISOString();

  const store = getStore();
  if (store === 'memory') {
    const record: ScanRecord = {
      id, url, domain, status: 'processing',
      score: null, band: null, signals: null, findings: null,
      competitorData: null, metadata: null, email: null, errorMessage: null,
      createdAt: now, updatedAt: now,
    };
    memoryStore.set(id, record);
    return id;
  }

  const db = getPool()!;
  await db.query(
    `INSERT INTO scans (id, url, domain, status, created_at, updated_at)
     VALUES ($1, $2, $3, 'processing', NOW(), NOW())`,
    [id, url, domain]
  );
  return id;
}

interface UpdateScanData {
  status?: ScanStatus;
  score?: number;
  band?: ScoreBand;
  signals?: Record<string, SignalScore>;
  findings?: Finding[];
  competitorData?: CompetitorProbeResult;
  metadata?: PageMetadata;
  email?: string;
  errorMessage?: string;
}

export async function updateScan(id: string, data: UpdateScanData): Promise<void> {
  const store = getStore();
  if (store === 'memory') {
    const existing = memoryStore.get(id);
    if (!existing) return;
    const updated: ScanRecord = {
      ...existing,
      status: data.status ?? existing.status,
      score: data.score ?? existing.score,
      band: data.band ?? existing.band,
      signals: (data.signals as ScanRecord['signals']) ?? existing.signals,
      findings: data.findings ?? existing.findings,
      competitorData: data.competitorData ?? existing.competitorData,
      metadata: data.metadata ?? existing.metadata,
      email: data.email ?? existing.email,
      errorMessage: data.errorMessage ?? existing.errorMessage,
      updatedAt: new Date().toISOString(),
    };
    memoryStore.set(id, updated);
    return;
  }

  const db = getPool()!;
  await db.query(
    `UPDATE scans SET
       status = COALESCE($2, status),
       score = COALESCE($3, score),
       band = COALESCE($4, band),
       signals = COALESCE($5, signals),
       findings = COALESCE($6, findings),
       competitor_data = COALESCE($7, competitor_data),
       metadata = COALESCE($8, metadata),
       email = COALESCE($9, email),
       error_message = COALESCE($10, error_message),
       updated_at = NOW()
     WHERE id = $1`,
    [
      id,
      data.status ?? null,
      data.score ?? null,
      data.band ?? null,
      data.signals ? JSON.stringify(data.signals) : null,
      data.findings ? JSON.stringify(data.findings) : null,
      data.competitorData ? JSON.stringify(data.competitorData) : null,
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.email ?? null,
      data.errorMessage ?? null,
    ]
  );
}

export async function getScan(id: string): Promise<ScanRecord | null> {
  const store = getStore();
  if (store === 'memory') {
    return memoryStore.get(id) ?? null;
  }

  const db = getPool()!;
  const result = await db.query('SELECT * FROM scans WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return rowToScanRecord(result.rows[0]);
}

export async function storeEmail(scanId: string, email: string): Promise<void> {
  return updateScan(scanId, { email });
}

export async function getAllScans(): Promise<ScanRecord[]> {
  const store = getStore();
  if (store === 'memory') {
    return Array.from(memoryStore.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const db = getPool()!;
  const result = await db.query(
    'SELECT * FROM scans ORDER BY created_at DESC LIMIT 1000'
  );
  return result.rows.map(rowToScanRecord);
}
