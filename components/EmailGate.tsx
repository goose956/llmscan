'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, FileText } from 'lucide-react';

interface EmailGateProps {
  scanId: string;
  domain: string;
  score: number;
}

const STORAGE_KEY = (scanId: string) => `llmscan_captured_${scanId}`;

export function EmailGate({ scanId, domain, score }: EmailGateProps) {
  const [visible, setVisible] = useState(false); // start hidden to avoid flash
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const captured = localStorage.getItem(STORAGE_KEY(scanId));
    if (!captured) {
      // Small delay so results are partially visible before gate appears (creates intrigue)
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, [scanId]);

  if (!visible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/email-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId, email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? 'Submission failed.');
      }

      localStorage.setItem(STORAGE_KEY(scanId), email.trim());
      setVisible(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    // Fixed overlay — blurs the content beneath
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 backdrop-blur-md bg-background/70 animate-in fade-in duration-500">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        {/* Score preview */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Your score is ready
            </p>
            <h2 className="font-display text-3xl font-semibold text-foreground">
              {score}
              <span className="text-muted-foreground text-lg font-normal">/100</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{domain}</p>
          </div>
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-7 w-7 text-primary" />
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Email form */}
        <div className="space-y-3">
          <p className="text-sm text-foreground font-medium">
            Where should we send your PDF report?
          </p>
          <p className="text-xs text-muted-foreground">
            You&apos;ll get a full breakdown of your score, 3 specific findings, and a competitor benchmark.
            No spam — just your report.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="you@yourstore.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              autoFocus
            />

            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending your report…
                </>
              ) : (
                'Show my report & email PDF'
              )}
            </Button>
          </form>
        </div>

        <p className="text-[11px] text-muted-foreground text-center">
          By submitting, you agree to receive your report and occasional updates from us.
          Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
