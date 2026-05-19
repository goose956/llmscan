// ─────────────────────────────────────────────────────────────────────────────
// Shared TypeScript types for the LLM Scan application
// ─────────────────────────────────────────────────────────────────────────────

export interface CrawlData {
  url: string;
  markdown: string;
  html: string;
  links: string[];
  metadata: PageMetadata;
  schemas: JsonLdSchema[];
  schemaTypes: string[];
  wordCount: number;
}

export interface PageMetadata {
  title: string;
  description: string;
  ogImage: string;
  language: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonLdSchema = Record<string, any>;

export interface SignalScore {
  raw: number;      // 0–10
  weighted: number; // raw × weight / 10  (contribution to 100-pt total)
  explanation: string;
}

export interface ScoringResult {
  signals: {
    productSchema: SignalScore;
    faqSchema: SignalScore;
    intentAlignment: SignalScore;
    specificity: SignalScore;
    reviewSignals: SignalScore;
  };
  total: number;       // 0–100
  band: ScoreBand;
  category: string;    // product category identified by Claude
}

export type ScoreBand = 'green' | 'amber' | 'red';
export type EffortLevel = 'low' | 'medium' | 'high';

export interface Finding {
  signal: string;       // key: productSchema | faqSchema | intentAlignment | specificity | reviewSignals
  signalName: string;   // human-readable name
  score: number;        // 0–10
  issue: string;        // one sentence
  whyItMatters: string; // one paragraph with research citation
  specificFix: string;  // concrete, page-specific advice
  effort: EffortLevel;
}

export interface CompetitorProbePrompt {
  prompt: string;
  brandCited: boolean;
  competitorsCited: string[];
  citedDomains: string[];
}

export interface CompetitorProbeResult {
  category: string;
  prompts: CompetitorProbePrompt[];
  topCompetitor: string | null;
  analysis: string;
}

export interface ScanRecord {
  id: string;
  url: string;
  domain: string;
  status: ScanStatus;
  score: number | null;
  band: ScoreBand | null;
  signals: ScoringResult['signals'] | null;
  findings: Finding[] | null;
  competitorData: CompetitorProbeResult | null;
  metadata: PageMetadata | null;
  email: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ScanStatus = 'processing' | 'complete' | 'error';

// SSE event shapes sent from /api/scan
export type ScanEvent =
  | { type: 'progress'; message: string; step: number; total: number }
  | { type: 'complete'; scanId: string }
  | { type: 'error'; message: string };
