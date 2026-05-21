import { getAllScans } from '@/lib/db';
import type { ScanRecord } from '@/lib/types';
import { LogOut, RefreshCw, ExternalLink, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function ScoreBadge({ score, band }: { score: number | null; band: string | null }) {
  if (score === null) return <span className="text-muted-foreground text-sm">—</span>;
  const colors =
    band === 'green' ? 'bg-score-green-bg text-score-green-fg' :
    band === 'amber' ? 'bg-score-amber-bg text-score-amber-fg' :
    'bg-score-red-bg text-score-red-fg';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold tabular-nums ${colors}`}>
      {score}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    complete: 'bg-score-green-bg text-score-green-fg',
    processing: 'bg-score-amber-bg text-score-amber-fg',
    error: 'bg-score-red-bg text-score-red-fg',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] ?? 'bg-muted text-muted-foreground'}`}>
      {status}
    </span>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-foreground font-display tabular-nums">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function LogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <LogOut className="w-3.5 h-3.5" />
        Sign out
      </button>
    </form>
  );
}

export default async function AdminPage() {
  const scans = await getAllScans();

  // Compute stats
  const total = scans.length;
  const complete = scans.filter((s) => s.status === 'complete');
  const withEmail = scans.filter((s) => s.email).length;
  const today = new Date().toDateString();
  const todayCount = scans.filter((s) => new Date(s.createdAt).toDateString() === today).length;
  const avgScore =
    complete.length > 0
      ? Math.round(complete.reduce((acc, s) => acc + (s.score ?? 0), 0) / complete.length)
      : null;

  const bandCounts = { green: 0, amber: 0, red: 0 };
  for (const s of complete) {
    if (s.band) bandCounts[s.band]++;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">cited.shop Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Scans" value={total} />
          <StatCard label="Emails Captured" value={withEmail} sub={total ? `${Math.round((withEmail / total) * 100)}% conversion` : undefined} />
          <StatCard label="Avg Score" value={avgScore !== null ? avgScore : '—'} sub={`${complete.length} complete scans`} />
          <StatCard label="Scans Today" value={todayCount} />
        </div>

        {/* Band breakdown */}
        {complete.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Score Distribution</h2>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-score-green-fg inline-block" />
                <span className="text-muted-foreground">Highly Visible</span>
                <span className="font-bold text-foreground">{bandCounts.green}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-score-amber-fg inline-block" />
                <span className="text-muted-foreground">Partially Visible</span>
                <span className="font-bold text-foreground">{bandCounts.amber}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-score-red-fg inline-block" />
                <span className="text-muted-foreground">Invisible</span>
                <span className="font-bold text-foreground">{bandCounts.red}</span>
              </span>
            </div>
          </div>
        )}

        {/* Scans table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">All Scans</h2>
            <span className="text-sm text-muted-foreground">{total} total</span>
          </div>

          {scans.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              No scans yet. Run a scan from the{' '}
              <Link href="/" className="text-primary underline underline-offset-2">homepage</Link>.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left">
                    <th className="px-4 py-3 font-medium text-muted-foreground">Domain</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Score</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Band</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Email</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Scanned</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {scans.map((scan: ScanRecord) => (
                    <tr key={scan.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{scan.domain}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{scan.url}</div>
                      </td>
                      <td className="px-4 py-3">
                        <ScoreBadge score={scan.score} band={scan.band} />
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-muted-foreground text-xs">
                          {scan.band === 'green' ? 'Highly Visible' :
                           scan.band === 'amber' ? 'Partially Visible' :
                           scan.band === 'red' ? 'Invisible' : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={scan.status} />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {scan.email ? (
                          <span className="text-foreground">{scan.email}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs whitespace-nowrap">
                        {formatDate(scan.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        {scan.status === 'complete' && (
                          <Link
                            href={`/scan/${scan.id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
