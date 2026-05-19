'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Loader2 } from 'lucide-react';
import type { ScanEvent } from '@/lib/types';

interface ProgressState {
  message: string;
  step: number;
  total: number;
}

export function ScanInput() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    // Normalize: prepend https:// if no scheme provided
    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

    setIsScanning(true);
    setError(null);
    setProgress({ message: 'Starting scan…', step: 0, total: 6 });

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalized }),
        signal: abort.signal,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? `Server error ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          let event: ScanEvent;
          try {
            event = JSON.parse(line.slice(6)) as ScanEvent;
          } catch {
            continue;
          }

          if (event.type === 'progress') {
            setProgress({ message: event.message, step: event.step, total: event.total });
          } else if (event.type === 'complete') {
            router.push(`/scan/${event.scanId}`);
            return;
          } else if (event.type === 'error') {
            throw new Error(event.message);
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Scan failed. Please try again.');
      setIsScanning(false);
      setProgress(null);
    }
  };

  const progressPercent = progress ? Math.round((progress.step / (progress.total || 6)) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2 shadow-lg rounded-xl overflow-hidden border border-border bg-white p-1.5">
          <Input
            type="url"
            placeholder="https://your-store.com/products/best-seller"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isScanning}
            className="flex-1 border-0 shadow-none focus-visible:ring-0 text-base h-12 bg-transparent"
            autoComplete="url"
            spellCheck={false}
          />
          <Button
            type="submit"
            disabled={isScanning || !url.trim()}
            size="lg"
            className="shrink-0 h-12 px-6"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Scanning…</span>
              </>
            ) : (
              <>
                <span>Scan my page</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Progress state */}
      {isScanning && progress && (
        <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Progress value={progressPercent} className="h-1.5" />
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
            <span className="font-medium">{progress.message}</span>
            <span className="ml-auto tabular-nums text-xs">{progress.step}/{progress.total}</span>
          </div>
          <div className="text-xs text-muted-foreground/70 pl-6 space-y-0.5">
            {progress.step >= 2 && <div className="animate-in fade-in">✓ Page crawled via Firecrawl</div>}
            {progress.step >= 3 && <div className="animate-in fade-in">✓ Schema and content extracted</div>}
            {progress.step >= 4 && <div className="animate-in fade-in">✓ AI scoring in progress</div>}
            {progress.step >= 5 && <div className="animate-in fade-in">✓ Competitor probe running</div>}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-in fade-in">
          {error}
        </div>
      )}
    </div>
  );
}
