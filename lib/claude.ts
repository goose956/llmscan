import Anthropic from '@anthropic-ai/sdk';
import type { Finding, ScoringResult, CrawlData } from './types';

// ─── Client ───────────────────────────────────────────────────────────────────

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set. Please add it to your .env.local file.');
  }
  return new Anthropic({ apiKey });
}

const MODEL = 'claude-sonnet-4-5';

// ─── Intent alignment (Signal 3) ──────────────────────────────────────────────

export async function scoreIntentAlignment(
  title: string,
  h1: string,
  firstParagraph: string
): Promise<{ raw: number; explanation: string }> {
  const client = getClient();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `You are an expert in Generative Engine Optimization (GEO). Analyse this ecommerce page's title and intro for LLM intent alignment — meaning, how well it matches the way a real shopper would phrase a buying question to ChatGPT, Perplexity, or Google AI Mode.

Title: ${title}
H1: ${h1 || '(not found)'}
First ~150 words: ${firstParagraph.slice(0, 600)}

A 10/10 title sounds like "Standing Desk for Small Apartments (Under 48 inches)" — specific, buyer-intent-heavy.
A 0/10 title sounds like "The Compact Desk" — brand-centric and vague.

Respond ONLY with valid JSON (no markdown fences): {"score": <integer 0-10>, "explanation": "<one concise sentence explaining the score>"}`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
  try {
    const parsed = JSON.parse(text);
    return { raw: Math.min(10, Math.max(0, Math.round(parsed.score))), explanation: parsed.explanation };
  } catch {
    return { raw: 5, explanation: 'Could not parse intent alignment score from AI response.' };
  }
}

// ─── Specificity / technical density (Signal 4) ───────────────────────────────

export async function scoreSpecificity(markdown: string): Promise<{ raw: number; explanation: string }> {
  const client = getClient();
  // Truncate to ~3000 words to stay within token limits
  const sample = markdown.slice(0, 12000);

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `You are evaluating an ecommerce page for LLM citation potential. LLMs prefer pages with measurable, specific claims.

Count the specific, measurable claims on this page — dimensions, materials, weights, numbered features, certifications, performance stats, time or money savings backed by numbers.

Page content:
---
${sample}
---

Score 0-10: 10 = 15+ specific measurable claims (e.g. "48-inch surface, 28–47" height range, 50kg load capacity"). 0 = pure marketing copy with no concrete specs.

Respond ONLY with valid JSON (no markdown fences): {"score": <integer 0-10>, "explanation": "<one sentence naming 2-3 specific claims found or stating why none were found>"}`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
  try {
    const parsed = JSON.parse(text);
    return { raw: Math.min(10, Math.max(0, Math.round(parsed.score))), explanation: parsed.explanation };
  } catch {
    return { raw: 3, explanation: 'Could not parse specificity score from AI response.' };
  }
}

// ─── Product category identification ─────────────────────────────────────────

export async function identifyCategory(
  title: string,
  markdown: string
): Promise<string> {
  const client = getClient();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 64,
    messages: [
      {
        role: 'user',
        content: `Based on this ecommerce page title and content snippet, identify the product category in 3-6 words that a shopper would type into ChatGPT. Be specific (e.g. "men's waterproof hiking boots under £150", not "footwear").

Title: ${title}
Content snippet: ${markdown.slice(0, 800)}

Respond with ONLY the category phrase, no punctuation.`,
      },
    ],
  });

  return response.content[0].type === 'text'
    ? response.content[0].text.trim().replace(/[".]/g, '')
    : 'products in this category';
}

// ─── Finding card generation ──────────────────────────────────────────────────

interface SignalInfo {
  key: string;
  signalName: string;
  raw: number;
  explanation: string;
  weight: number;
}

export async function generateFinding(signal: SignalInfo, crawlData: CrawlData): Promise<Finding> {
  const client = getClient();
  const pageSnippet = crawlData.markdown.slice(0, 3000);

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    messages: [
      {
        role: 'user',
        content: `You are writing a finding card for an LLM-Readiness audit report. The finding is about "${signal.signalName}" which scored ${signal.raw}/10. This is for the page: ${crawlData.url}

Current assessment: ${signal.explanation}

Page snippet:
---
${pageSnippet}
---

Write a finding card. Respond ONLY with valid JSON (no markdown fences):
{
  "issue": "<one sentence stating the specific problem on THIS page — not generic>",
  "whyItMatters": "<one paragraph (50-80 words) citing relevant research about LLM citation behaviour — reference real findings e.g. Surfient research, or generally accepted GEO practices>",
  "specificFix": "<2-4 concrete sentences with a specific fix for THIS page. Do NOT give complete code — describe the fix, show a partial example structure only. Hint at depth held back for the paid audit.>",
  "effort": "<low|medium|high>"
}`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
  try {
    const parsed = JSON.parse(text);
    return {
      signal: signal.key,
      signalName: signal.signalName,
      score: signal.raw,
      issue: parsed.issue,
      whyItMatters: parsed.whyItMatters,
      specificFix: parsed.specificFix,
      effort: parsed.effort as Finding['effort'],
    };
  } catch {
    return {
      signal: signal.key,
      signalName: signal.signalName,
      score: signal.raw,
      issue: signal.explanation,
      whyItMatters: 'LLMs consistently favour pages that optimise for this signal when selecting results to cite in shopping recommendations.',
      specificFix: 'Address the issues identified above to improve your LLM readiness score for this signal. Contact us for a detailed implementation plan.',
      effort: 'medium',
    };
  }
}

export async function generateFindings(
  signals: ScoringResult['signals'],
  crawlData: CrawlData
): Promise<Finding[]> {
  const signalList: SignalInfo[] = [
    { key: 'productSchema', signalName: 'Product Schema Completeness', weight: 25, raw: signals.productSchema.raw, explanation: signals.productSchema.explanation },
    { key: 'faqSchema', signalName: 'FAQPage Schema & Quote-Ready Answers', weight: 20, raw: signals.faqSchema.raw, explanation: signals.faqSchema.explanation },
    { key: 'intentAlignment', signalName: 'Intent-Aligned Title & Introduction', weight: 20, raw: signals.intentAlignment.raw, explanation: signals.intentAlignment.explanation },
    { key: 'specificity', signalName: 'Technical Specificity & Measurable Claims', weight: 20, raw: signals.specificity.raw, explanation: signals.specificity.explanation },
    { key: 'reviewSignals', signalName: 'Review & Rating Signals', weight: 15, raw: signals.reviewSignals.raw, explanation: signals.reviewSignals.explanation },
  ];

  // Generate findings for the 3 lowest-scoring signals
  const worst3 = [...signalList].sort((a, b) => a.raw - b.raw).slice(0, 3);
  return Promise.all(worst3.map((s) => generateFinding(s, crawlData)));
}
