import Anthropic from '@anthropic-ai/sdk';
import type { CompetitorProbeResult, CompetitorProbePrompt } from './types';

const MODEL = 'claude-sonnet-4-5';

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set.');
  return new Anthropic({ apiKey });
}

function buildPrompts(category: string, pageTitle: string): string[] {
  // Extract a price band from the title if present
  const priceMatch = pageTitle.match(/[£$€]\s*(\d+)/);
  const priceBand = priceMatch ? `under ${priceMatch[0]}` : 'mid-range';

  // Derive a common use case from the title
  const useCase = pageTitle.toLowerCase().includes('for ')
    ? pageTitle.split(/for /i)[1]?.split(/[,(]/)[0]?.trim() ?? 'everyday use'
    : 'everyday use';

  return [
    `What are the best ${category} in 2026?`,
    `I need ${category} for ${useCase}`,
    `Compare top ${category} ${priceBand}`,
  ];
}

// ─── Web-search-backed probe (requires beta web search feature) ───────────────

async function probeWithWebSearch(
  client: Anthropic,
  prompt: string,
  domain: string
): Promise<CompetitorProbePrompt> {
  try {
    // @ts-ignore — web_search_20250305 is a beta tool type
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 512,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [
        {
          role: 'user',
          content: `Search for this buying query and tell me which brands/websites appear in the AI-generated answer or top results: "${prompt}"\n\nRespond ONLY with valid JSON: {"brandsCited": ["brand1", "brand2"], "domainsCited": ["domain1.com", "domain2.com"]}`,
        },
      ],
    });

    // Extract the final text response (after tool use)
    const textBlock = response.content.find((b: { type: string }) => b.type === 'text');
    const text = textBlock && 'text' in textBlock ? (textBlock as { text: string }).text.trim() : '';

    let brandsCited: string[] = [];
    let domainsCited: string[] = [];
    try {
      const parsed = JSON.parse(text);
      brandsCited = parsed.brandsCited ?? [];
      domainsCited = parsed.domainsCited ?? [];
    } catch {
      // Extract domains/brands from free text
      const domainRegex = /\b([a-z0-9-]+\.(com|co\.uk|io|net|org))\b/gi;
      let match: RegExpExecArray | null;
      while ((match = domainRegex.exec(text)) !== null) domainsCited.push(match[1]);
    }

    const brandCited = domainsCited.some((d) => d.includes(domain)) ||
      brandsCited.some((b) => b.toLowerCase().includes(domain.split('.')[0].toLowerCase()));

    return {
      prompt,
      brandCited,
      competitorsCited: brandsCited.filter(
        (b) => !b.toLowerCase().includes(domain.split('.')[0].toLowerCase())
      ),
      citedDomains: domainsCited.filter((d) => !d.includes(domain)),
    };
  } catch {
    return fallbackProbe(prompt, domain);
  }
}

// ─── Fallback: Claude general knowledge ──────────────────────────────────────

function fallbackProbe(prompt: string, domain: string): CompetitorProbePrompt {
  return {
    prompt,
    brandCited: false,
    competitorsCited: [],
    citedDomains: [],
  };
}

async function probeWithKnowledge(
  client: Anthropic,
  prompt: string,
  domain: string
): Promise<CompetitorProbePrompt> {
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: `If a shopper asked an AI assistant: "${prompt}" — which brands or websites would typically appear in the answer based on your training knowledge? List 2-3 well-known ones.

Is "${domain}" likely to be cited?

Respond ONLY with valid JSON: {"brandsCited": ["brand1", "brand2"], "domainsCited": ["domain1.com"], "domainLikelyCited": false}`,
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
    try {
      const parsed = JSON.parse(text);
      const brandCited: boolean = parsed.domainLikelyCited ?? false;
      return {
        prompt,
        brandCited,
        competitorsCited: parsed.brandsCited ?? [],
        citedDomains: parsed.domainsCited ?? [],
      };
    } catch {
      return fallbackProbe(prompt, domain);
    }
  } catch {
    return fallbackProbe(prompt, domain);
  }
}

// ─── Main competitor probe ────────────────────────────────────────────────────

export async function probeCompetitors(
  category: string,
  pageTitle: string,
  domain: string = ''
): Promise<CompetitorProbeResult> {
  const client = getClient();
  const prompts = buildPrompts(category, pageTitle);

  // Try web search first, fall back to knowledge-based probing
  const results = await Promise.all(
    prompts.map(async (prompt) => {
      try {
        return await probeWithWebSearch(client, prompt, domain);
      } catch {
        return probeWithKnowledge(client, prompt, domain);
      }
    })
  );

  // Find the most-cited competitor
  const competitorCount = new Map<string, number>();
  for (const result of results) {
    for (const c of [...result.competitorsCited, ...result.citedDomains]) {
      competitorCount.set(c, (competitorCount.get(c) ?? 0) + 1);
    }
  }

  const sorted = [...competitorCount.entries()].sort((a, b) => b[1] - a[1]);
  const topCompetitor = sorted[0]?.[0] ?? null;
  const topCount = sorted[0]?.[1] ?? 0;

  const citedCount = results.filter((r) => r.brandCited).length;

  let analysis: string;
  if (citedCount === 3) {
    analysis = `Your brand was cited in all 3 test queries — a strong signal that you already have some LLM visibility in this category.`;
  } else if (citedCount > 0) {
    analysis = `Your brand was cited in ${citedCount} of 3 queries. ${topCompetitor ? `${topCompetitor} appears more consistently — they likely have stronger schema, more FAQ content, and more off-site mentions.` : ''}`;
  } else if (topCompetitor) {
    analysis = `Your brand wasn't cited in any of the 3 test queries. ${topCompetitor} was cited in ${topCount} of 3 answers — they are your primary LLM competitor for this category. The full audit maps all ${30}+ prompt variants.`;
  } else {
    analysis = `We tested 3 buying prompts in your category. Your brand wasn't cited. The full audit identifies which competitors are winning visibility and how they've structured their content.`;
  }

  return {
    category,
    prompts: results,
    topCompetitor,
    analysis,
  };
}
