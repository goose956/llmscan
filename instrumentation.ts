export async function register() {
  // Only run in Node.js runtime (not Edge), and only when a DB is configured
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
      const { setupDatabase } = await import('./scripts/setup-db');
      await setupDatabase().catch((err: Error) =>
        console.error('[startup] DB migration failed (non-fatal):', err.message)
      );

      const { loadSettingsIntoEnv } = await import('./lib/settings');
      await loadSettingsIntoEnv().catch((err: Error) =>
        console.error('[startup] Failed to load settings from DB (non-fatal):', err.message)
      );
    }
  }
}
