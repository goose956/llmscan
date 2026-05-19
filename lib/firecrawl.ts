import type { CrawlData, JsonLdSchema } from './types';

// ─── JSON-LD extraction ───────────────────────────────────────────────────────

export function extractJsonLd(html: string): JsonLdSchema[] {
  const schemas: JsonLdSchema[] = [];
  const regex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      // Flatten @graph arrays
      if (parsed['@graph'] && Array.isArray(parsed['@graph'])) {
        schemas.push(...parsed['@graph']);
      } else if (Array.isArray(parsed)) {
        schemas.push(...parsed);
      } else {
        schemas.push(parsed);
      }
    } catch {
      // Ignore malformed JSON-LD
    }
  }
  return schemas;
}

function getSchemaTypes(schemas: JsonLdSchema[]): string[] {
  const types = new Set<string>();
  for (const schema of schemas) {
    const t = schema['@type'];
    if (Array.isArray(t)) t.forEach((x: string) => types.add(x));
    else if (typeof t === 'string') types.add(t);
  }
  return Array.from(types);
}

// ─── Firecrawl client ─────────────────────────────────────────────────────────

export async function crawlPage(url: string): Promise<CrawlData> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY is not set. Please add it to your .env.local file.');
  }

  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: ['markdown', 'html', 'links'],
      onlyMainContent: false,
      waitFor: 2000,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Firecrawl API error ${response.status}: ${body.slice(0, 200)}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Firecrawl returned an error response');
  }

  const { markdown = '', html = '', links = [], metadata = {} } = data.data ?? {};
  const schemas = extractJsonLd(html);
  const schemaTypes = getSchemaTypes(schemas);
  const wordCount = markdown
    .replace(/[#*_`\[\]()>~]/g, '')
    .split(/\s+/)
    .filter(Boolean).length;

  return {
    url,
    markdown,
    html,
    links: Array.isArray(links) ? links.map((l: { url?: string } | string) =>
      typeof l === 'string' ? l : l?.url ?? ''
    ).filter(Boolean) : [],
    metadata: {
      title: metadata.title ?? '',
      description: metadata.description ?? '',
      ogImage: metadata.ogImage ?? '',
      language: metadata.language ?? 'en',
    },
    schemas,
    schemaTypes,
    wordCount,
  };
}
