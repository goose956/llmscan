'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Loader2, Eye, EyeOff, Settings } from 'lucide-react';
import type { SettingStatus } from '@/lib/settings';

// ── Individual key row ────────────────────────────────────────────────────────

function SettingRow({
  setting,
  onSaved,
}: {
  setting: SettingStatus;
  onSaved: (key: string) => void;
}) {
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!value.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: setting.key, value: value.trim() }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? 'Save failed.');
      }
      setSaved(true);
      setValue('');
      onSaved(setting.key);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-5 py-5 space-y-3">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground">{setting.label}</span>
          {setting.isSet ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-score-green-fg">
              <span className="w-1.5 h-1.5 rounded-full bg-score-green-fg" />
              Set
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
              Not set
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{setting.description}</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={setting.secret && !show ? 'password' : 'text'}
            placeholder={
              setting.isSet
                ? '••••••••  (enter new value to update)'
                : setting.hint
            }
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="w-full px-3 py-2 pr-10 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono transition-colors"
          />
          {setting.secret && (
            <button
              type="button"
              onClick={() => setShow(!show)}
              aria-label={show ? 'Hide value' : 'Show value'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={!value.trim() || saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : saved ? (
            <Check className="w-3.5 h-3.5" />
          ) : null}
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
        </button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data: SettingStatus[]) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => {
        setFetchError(true);
        setLoading(false);
      });
  }, []);

  const handleSaved = (key: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, isSet: true } : s)),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link
            href="/admin"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Settings className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">Settings</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">API Keys &amp; Configuration</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your API keys here. Changes take effect immediately — no restart needed.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
          {loading && (
            <div className="py-16 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {fetchError && (
            <div className="py-12 text-center text-sm text-destructive">
              Failed to load settings. Try refreshing.
            </div>
          )}

          {!loading && !fetchError && settings.map((setting) => (
            <SettingRow key={setting.key} setting={setting} onSaved={handleSaved} />
          ))}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Keys are stored in your database (or in <code className="font-mono">.env.local</code> when running locally).
          Environment variables set at the infrastructure level always take precedence.
        </p>
      </main>
    </div>
  );
}
