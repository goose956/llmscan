export type ScoreBand = 'green' | 'amber' | 'red';
export type Engine = 'ChatGPT' | 'Perplexity' | 'Google AI Mode' | 'Claude';

export interface AuditMeta {
  brand: string;
  domain: string;
  scannedAt: string;
  pagesScanned: number;
  promptsTested: number;
  enginesProbed: Engine[];
  preparedBy: string;
  reportId: string;
}

export interface PageAudit {
  url: string;
  title: string;
  type: 'product' | 'collection' | 'blog' | 'home' | 'policy' | 'other';
  score: number;
  band: ScoreBand;
  topIssues: string[];
  inboundLinks: number;
}

export interface PromptResult {
  engine: Engine;
  status: 'cited' | 'competitor-cited' | 'neither';
  citedBrand?: string;
  excerpt?: string;
}

export interface BuyingPrompt {
  id: string;
  prompt: string;
  intent: 'best-for' | 'comparison' | 'price-anchored' | 'use-case' | 'what-is';
  results: PromptResult[];
}

export interface Competitor {
  brand: string;
  domain: string;
  citationsAcrossPrompts: number;
  topAdvantage: string;
  pageFormats: string[];
  knowledgeGraphStrength: 'strong' | 'medium' | 'weak';
}

export interface OffSiteSignal {
  platform: string;
  icon: string;
  mentions: number;
  topCompetitorMentions: number;
  gap: 'critical' | 'significant' | 'minor' | 'closed';
  notes: string;
}

export interface BacklogPage {
  id: string;
  suggestedTitle: string;
  targetPrompts: string[];
  template: 'buyer-guide' | 'comparison' | 'use-case' | 'faq-hub' | 'what-is';
  estimatedEffort: 'low' | 'medium' | 'high';
  estimatedLift: 'low' | 'medium' | 'high';
  rationale: string;
  priority: 1 | 2 | 3;
}

export interface QuickWin {
  id: string;
  title: string;
  timeToImplement: string;
  impact: 'high' | 'medium' | 'low';
  instructions: string;
  codeSnippet?: string;
}

export interface NewPage {
  id: string;
  title: string;
  slug: string;
  template: 'buyer-guide' | 'comparison' | 'use-case' | 'faq-hub' | 'what-is';
  targetQueries: string[];
  linkedProducts: string[];
  citationPotential: 'high' | 'medium' | 'low';
  priority: 1 | 2 | 3;
  wordCount: number;
  briefSummary: string;
}

export interface PlanItem {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'content' | 'offsite' | 'tracking';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
}

export interface PlanPhase {
  id: string;
  title: string;
  subtitle: string;
  timeline: string;
  color: string;
  items: PlanItem[];
}

export interface AuditReport {
  meta: AuditMeta;
  overallScore: number;
  band: ScoreBand;
  headlineFinding: string;
  topThreeFindings: string[];
  revenueAtStake: string;
  pages: PageAudit[];
  buyingPrompts: BuyingPrompt[];
  competitors: Competitor[];
  offSiteSignals: OffSiteSignal[];
  backlog: BacklogPage[];
  quickWins: QuickWin[];
  newPages: NewPage[];
  plan: PlanPhase[];
}
