import type { JsonLdSchema, CrawlData, SignalScore, ScoringResult, ScoreBand } from './types';
import { scoreIntentAlignment, scoreSpecificity, identifyCategory } from './claude';

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function findSchema(schemas: JsonLdSchema[], type: string): JsonLdSchema | undefined {
  return schemas.find((s) => {
    const t = s['@type'];
    if (Array.isArray(t)) return t.includes(type);
    return t === type;
  });
}

function extractH1(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1] : '';
}

function extractFirstParagraph(markdown: string): string {
  const lines = markdown.split('\n').filter((l) => l.trim() && !l.startsWith('#') && !l.startsWith('!'));
  return lines.slice(0, 5).join(' ');
}

// ─── Signal 1: Product Schema Completeness (×25) ─────────────────────────────

function scoreProductSchema(schemas: JsonLdSchema[]): SignalScore {
  const product = findSchema(schemas, 'Product');

  if (!product) {
    return {
      raw: 0,
      weighted: 0,
      explanation: 'No Product schema found on this page. LLMs cannot reliably identify product details, pricing, or availability.',
    };
  }

  // Locate the Offer — can be nested in product.offers or a standalone Offer schema
  const offer =
    (Array.isArray(product.offers) ? product.offers[0] : product.offers) ??
    findSchema(schemas, 'Offer');

  if (!offer) {
    return {
      raw: 4,
      weighted: 4 * 25 / 10,
      explanation: 'Product schema found but missing Offer details. LLMs cannot determine price, availability, or currency.',
    };
  }

  const recommended = [
    product.brand ?? product.manufacturer,
    product.sku ?? product.gtin8 ?? product.gtin12 ?? product.gtin13 ?? product.gtin,
    offer.priceCurrency,
    offer.availability,
    product.aggregateRating,
    product.review ?? schemas.filter((s) => s['@type'] === 'Review').length > 0,
  ].filter(Boolean).length;

  const required = [product.name, product.image, product.description, offer.price].filter(Boolean).length;

  if (required === 4 && recommended >= 5) {
    return { raw: 10, weighted: 25, explanation: 'Excellent Product+Offer schema with all required fields, brand, identifiers, availability, and ratings.' };
  }
  if (required >= 3 && recommended >= 3) {
    return { raw: 7, weighted: 17.5, explanation: `Product+Offer schema with ${recommended} of 6 recommended fields. Missing some identifiers or rating markup.` };
  }
  if (required >= 2 && recommended >= 1) {
    return { raw: 5, weighted: 12.5, explanation: `Product+Offer schema present but only ${recommended} recommended fields. Missing brand, SKU, or ratings significantly reduces LLM trust.` };
  }
  return {
    raw: 4,
    weighted: 10,
    explanation: 'Product+Offer schema present but very sparse. Core recommended fields (brand, SKU, availability) are missing.',
  };
}

// ─── Signal 2: FAQPage Schema + Quote-ready answers (×20) ────────────────────

function scoreFaqSchema(schemas: JsonLdSchema[], markdown: string): SignalScore {
  const faq = findSchema(schemas, 'FAQPage');

  if (!faq) {
    // Check if there's visible FAQ content in the markdown without schema markup
    const hasFaqContent = /\b(faq|frequently asked|common question|q:|a:)/i.test(markdown);
    return {
      raw: hasFaqContent ? 2 : 0,
      weighted: hasFaqContent ? 4 : 0,
      explanation: hasFaqContent
        ? 'FAQ-style content found on page but no FAQPage schema markup. LLMs cite marked-up FAQ answers 2.8× more often than unmarked text.'
        : 'No FAQPage schema found. Pages with FAQPage schema are cited verbatim by LLMs up to 71% of the time — this is the highest-leverage single fix.',
    };
  }

  const entities: JsonLdSchema[] = Array.isArray(faq.mainEntity) ? faq.mainEntity : [];
  const goodAnswers = entities.filter((q: JsonLdSchema) => {
    const answerText: string = q?.acceptedAnswer?.text ?? q?.suggestedAnswer?.text ?? '';
    const words = answerText.split(/\s+/).filter(Boolean).length;
    return words >= 10 && words <= 100;
  }).length;

  const schemaScore = 5;
  const answerBonus = goodAnswers >= 3 ? 5 : goodAnswers >= 1 ? 2 : 0;
  const raw = schemaScore + answerBonus;

  if (raw === 10) {
    return { raw: 10, weighted: 20, explanation: `FAQPage schema with ${entities.length} questions, ${goodAnswers} in ideal 40–80 word format for direct LLM citation.` };
  }
  if (raw >= 7) {
    return { raw, weighted: raw * 2, explanation: `FAQPage schema found with ${entities.length} questions, but only ${goodAnswers} answers are in the 40–80 word ideal format.` };
  }
  return {
    raw: 5,
    weighted: 10,
    explanation: `FAQPage schema present with ${entities.length} questions but answers are too long or empty. LLMs skip answers over 100 words.`,
  };
}

// ─── Signal 5: Review + rating signals (×15) ─────────────────────────────────

function scoreReviews(schemas: JsonLdSchema[], markdown: string): SignalScore {
  let raw = 0;
  const details: string[] = [];

  // AggregateRating — 5 points
  const aggregateRating =
    findSchema(schemas, 'AggregateRating') ??
    schemas.find((s) => s.aggregateRating)?.aggregateRating;

  if (aggregateRating) {
    raw += 5;
    const rv = aggregateRating.ratingValue ?? aggregateRating.ratingValue;
    const rc = aggregateRating.reviewCount ?? aggregateRating.ratingCount ?? '?';
    details.push(`AggregateRating: ${rv}/5 (${rc} reviews)`);
  }

  // Review schema with text bodies — 3 points
  const reviewSchemas = schemas.filter((s) => {
    const t = s['@type'];
    return t === 'Review' || (Array.isArray(t) && t.includes('Review'));
  });
  const hasReviewBodies = reviewSchemas.some((r) => r.reviewBody || r.description);
  const productHasReviews = schemas.some(
    (s) => s['@type'] === 'Product' && Array.isArray(s.review) && s.review.some((r: JsonLdSchema) => r.reviewBody)
  );

  if (hasReviewBodies || productHasReviews) {
    raw += 3;
    details.push(`${reviewSchemas.length} Review schema${reviewSchemas.length !== 1 ? 's' : ''} with text bodies`);
  }

  // Visible review snippet in body text — 2 points
  const visibleReviews =
    /[★☆⭐]/.test(markdown) ||
    /\b\d(\.\d)?\s*(out of|\/)\s*5\b/i.test(markdown) ||
    /\b(verified (buyer|purchase)|customer review|rated \d)\b/i.test(markdown);

  if (visibleReviews) {
    raw += 2;
    details.push('Review content visible in page body');
  }

  if (raw === 0) {
    return {
      raw: 0,
      weighted: 0,
      explanation: 'No rating or review signals found. AggregateRating schema is one of the strongest LLM trust signals for product pages.',
    };
  }

  return {
    raw,
    weighted: raw * 1.5,
    explanation: details.join('; ') + '.',
  };
}

// ─── Master scoring function ──────────────────────────────────────────────────

export async function scoreAllSignals(crawlData: CrawlData): Promise<ScoringResult> {
  const { schemas, markdown, metadata } = crawlData;

  // Signals 1, 2, 5 are deterministic
  const productSchema = scoreProductSchema(schemas);
  const faqSchema = scoreFaqSchema(schemas, markdown);
  const reviewSignals = scoreReviews(schemas, markdown);

  // Signals 3 and 4 require Claude — run in parallel
  const h1 = extractH1(markdown);
  const firstParagraph = extractFirstParagraph(markdown);

  const [intentResult, specificityResult, category] = await Promise.all([
    scoreIntentAlignment(metadata.title, h1, firstParagraph),
    scoreSpecificity(markdown),
    identifyCategory(metadata.title, markdown),
  ]);

  const intentAlignment: SignalScore = {
    raw: intentResult.raw,
    weighted: intentResult.raw * 2,
    explanation: intentResult.explanation,
  };

  const specificity: SignalScore = {
    raw: specificityResult.raw,
    weighted: specificityResult.raw * 2,
    explanation: specificityResult.explanation,
  };

  // Weighted total = sum of (raw × weight) / 10
  const total = Math.min(
    100,
    Math.round(
      (productSchema.raw * 25 +
        faqSchema.raw * 20 +
        intentAlignment.raw * 20 +
        specificity.raw * 20 +
        reviewSignals.raw * 15) /
        10
    )
  );

  const band: ScoreBand = total >= 70 ? 'green' : total >= 40 ? 'amber' : 'red';

  return {
    signals: { productSchema, faqSchema, intentAlignment, specificity, reviewSignals },
    total,
    band,
    category,
  };
}
