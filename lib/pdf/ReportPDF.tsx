import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';
import type { ScanRecord } from '../types';

// ─── Styles ───────────────────────────────────────────────────────────────────

const BLUE = '#1B3A6B';
const OFF_WHITE = '#FAFAF8';
const LIGHT_GREY = '#F0EBE3';
const MID_GREY = '#6B6560';
const BORDER = '#E8E3DC';

const bandColor = (band: string | null) => {
  if (band === 'green') return '#166534';
  if (band === 'amber') return '#92400E';
  return '#991B1B';
};

const bandBg = (band: string | null) => {
  if (band === 'green') return '#DCFCE7';
  if (band === 'amber') return '#FEF3C7';
  return '#FEE2E2';
};

const bandLabel = (band: string | null) => {
  if (band === 'green') return 'LLM-Ready';
  if (band === 'amber') return 'Partially Visible';
  return 'Invisible to AI';
};

const effortColor = (effort: string) => {
  if (effort === 'low') return '#166534';
  if (effort === 'medium') return '#92400E';
  return '#991B1B';
};

const styles = StyleSheet.create({
  // ─── Cover page ────────────────────────────────────────────────────────────
  coverPage: {
    backgroundColor: BLUE,
    padding: 60,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  coverLogo: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF80',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  coverScore: {
    fontSize: 120,
    fontFamily: 'Times-Bold',
    color: '#FFFFFF',
    lineHeight: 1,
  },
  coverScoreLabel: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: '#FFFFFF80',
    marginTop: 8,
  },
  coverBand: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  coverDivider: {
    height: 1,
    backgroundColor: '#FFFFFF30',
    marginVertical: 32,
  },
  coverUrl: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#FFFFFFB0',
  },
  coverDate: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#FFFFFF60',
    marginTop: 4,
  },

  // ─── Content pages ──────────────────────────────────────────────────────────
  page: {
    backgroundColor: OFF_WHITE,
    padding: 56,
    fontFamily: 'Helvetica',
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  pageHeaderLeft: {
    fontSize: 9,
    color: MID_GREY,
    fontFamily: 'Helvetica',
  },
  pageHeaderRight: {
    fontSize: 9,
    color: MID_GREY,
    fontFamily: 'Helvetica',
  },

  // ─── Section headings ──────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Times-Bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: MID_GREY,
    fontFamily: 'Helvetica',
    marginBottom: 24,
    lineHeight: 1.5,
  },

  // ─── Score breakdown ───────────────────────────────────────────────────────
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  scoreLabel: {
    width: 200,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1A1A1A',
  },
  scoreBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: LIGHT_GREY,
    borderRadius: 3,
    marginHorizontal: 12,
  },
  scoreBarFill: {
    height: 6,
    borderRadius: 3,
  },
  scoreValue: {
    width: 30,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1A1A1A',
    textAlign: 'right',
  },
  scoreExplanation: {
    fontSize: 9,
    color: MID_GREY,
    fontFamily: 'Helvetica',
    marginBottom: 14,
    marginLeft: 212,
    lineHeight: 1.4,
  },

  // ─── Finding cards ─────────────────────────────────────────────────────────
  findingCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    padding: 24,
    marginBottom: 20,
  },
  findingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  findingTitle: {
    fontSize: 13,
    fontFamily: 'Times-Bold',
    color: '#1A1A1A',
    flex: 1,
  },
  findingScoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 12,
  },
  findingScoreText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  findingIssue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  findingLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: MID_GREY,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
    marginTop: 12,
  },
  findingText: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#3D3D3D',
    lineHeight: 1.55,
  },
  effortBadge: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  effortLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: MID_GREY,
    marginRight: 6,
  },
  effortValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },

  // ─── Competitor section ────────────────────────────────────────────────────
  competitorCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    padding: 20,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  competitorPromptText: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1A1A1A',
    flex: 1,
    lineHeight: 1.5,
  },
  citedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 12,
  },

  // ─── CTA page ──────────────────────────────────────────────────────────────
  ctaPage: {
    backgroundColor: BLUE,
    padding: 60,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  ctaTitle: {
    fontSize: 32,
    fontFamily: 'Times-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  ctaBody: {
    fontSize: 13,
    fontFamily: 'Helvetica',
    color: '#FFFFFFB0',
    lineHeight: 1.6,
    marginBottom: 24,
  },
  ctaPrice: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ctaFeature: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#FFFFFFB0',
    marginBottom: 6,
    paddingLeft: 12,
  },
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function PageHeader({ domain, scanId }: { domain: string; scanId: string }) {
  return (
    <View style={styles.pageHeader}>
      <Text style={styles.pageHeaderLeft}>LLM-Readiness Report · {domain}</Text>
      <Text style={styles.pageHeaderRight}>cited.shop/scan/{scanId}</Text>
    </View>
  );
}

function ScoreBar({ raw, band }: { raw: number; band: string | null }) {
  const color = bandColor(band);
  return (
    <View style={styles.scoreBarTrack}>
      <View style={[styles.scoreBarFill, { width: `${raw * 10}%`, backgroundColor: color }]} />
    </View>
  );
}

// ─── Main PDF document ────────────────────────────────────────────────────────

interface ReportPDFProps {
  scan: ScanRecord;
}

export function ReportPDF({ scan }: ReportPDFProps) {
  const signals = scan.signals;
  const findings = scan.findings ?? [];
  const competitor = scan.competitorData;
  const formattedDate = scan.createdAt
    ? new Date(scan.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const signalRows = signals
    ? [
        { label: 'Product Schema Completeness', key: 'productSchema', weight: '×25' },
        { label: 'FAQPage Schema & Quote-Ready Answers', key: 'faqSchema', weight: '×20' },
        { label: 'Intent-Aligned Title & Introduction', key: 'intentAlignment', weight: '×20' },
        { label: 'Technical Specificity & Measurable Claims', key: 'specificity', weight: '×20' },
        { label: 'Review & Rating Signals', key: 'reviewSignals', weight: '×15' },
      ]
    : [];

  return (
    <Document title={`AI Visibility Report — ${scan.domain}`} author="cited.shop">
      {/* ── Cover page ──────────────────────────────────────────────────────── */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverLogo}>cited.shop</Text>

        <View>
          <Text style={styles.coverScore}>{scan.score ?? '—'}</Text>
          <Text style={styles.coverScoreLabel}>LLM-Readiness Score  ·  out of 100</Text>
          <Text style={[styles.coverBand, { color: bandBg(scan.band) }]}>
            {bandLabel(scan.band)}
          </Text>
        </View>

        <View>
          <View style={styles.coverDivider} />
          <Text style={styles.coverUrl}>{scan.url}</Text>
          <Text style={styles.coverDate}>Scanned {formattedDate}</Text>
        </View>
      </Page>

      {/* ── Score breakdown ──────────────────────────────────────────────────── */}
      {signals && (
        <Page size="A4" style={styles.page}>
          <PageHeader domain={scan.domain} scanId={scan.id} />
          <Text style={styles.sectionTitle}>Score Breakdown</Text>
          <Text style={styles.sectionSubtitle}>
            Five signals determine how visible your page is to ChatGPT, Perplexity, and Google AI Mode.
            Each signal is weighted by its impact on LLM citation likelihood.
          </Text>

          {signalRows.map(({ label, key, weight }) => {
            const signal = signals[key as keyof typeof signals];
            return (
              <View key={key}>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>
                    {label}{' '}
                    <Text style={{ color: MID_GREY, fontSize: 9 }}>{weight}</Text>
                  </Text>
                  <ScoreBar raw={signal.raw} band={scan.band} />
                  <Text style={styles.scoreValue}>{signal.raw}/10</Text>
                </View>
                <Text style={styles.scoreExplanation}>{signal.explanation}</Text>
              </View>
            );
          })}
        </Page>
      )}

      {/* ── Findings (one page per finding) ─────────────────────────────────── */}
      {findings.map((finding, i) => (
        <Page key={i} size="A4" style={styles.page}>
          <PageHeader domain={scan.domain} scanId={scan.id} />
          <Text style={styles.sectionTitle}>Finding {i + 1} of {findings.length}</Text>

          <View style={styles.findingCard}>
            <View style={styles.findingHeader}>
              <Text style={styles.findingTitle}>{finding.signalName}</Text>
              <View style={[styles.findingScoreBadge, { backgroundColor: bandBg(finding.score >= 7 ? 'green' : finding.score >= 4 ? 'amber' : 'red') }]}>
                <Text style={[styles.findingScoreText, { color: bandColor(finding.score >= 7 ? 'green' : finding.score >= 4 ? 'amber' : 'red') }]}>
                  {finding.score}/10
                </Text>
              </View>
            </View>

            <Text style={styles.findingLabel}>The Issue</Text>
            <Text style={styles.findingIssue}>{finding.issue}</Text>

            <Text style={styles.findingLabel}>Why It Matters</Text>
            <Text style={styles.findingText}>{finding.whyItMatters}</Text>

            <Text style={styles.findingLabel}>The Fix</Text>
            <Text style={styles.findingText}>{finding.specificFix}</Text>

            <View style={styles.effortBadge}>
              <Text style={styles.effortLabel}>Implementation effort:</Text>
              <Text style={[styles.effortValue, { color: effortColor(finding.effort) }]}>
                {finding.effort.charAt(0).toUpperCase() + finding.effort.slice(1)}
              </Text>
            </View>
          </View>
        </Page>
      ))}

      {/* ── Competitor probe ──────────────────────────────────────────────────── */}
      {competitor && (
        <Page size="A4" style={styles.page}>
          <PageHeader domain={scan.domain} scanId={scan.id} />
          <Text style={styles.sectionTitle}>Competitor Benchmark</Text>
          <Text style={styles.sectionSubtitle}>
            We ran 3 high-intent buying prompts in your product category ("{competitor.category}") and recorded which brands were cited.
          </Text>

          {competitor.prompts.map((p, i) => (
            <View key={i} style={styles.competitorCard}>
              <Text style={styles.competitorPromptText}>"{p.prompt}"</Text>
              <View
                style={[
                  styles.citedBadge,
                  { backgroundColor: p.brandCited ? '#DCFCE7' : '#FEE2E2' },
                ]}
              >
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: p.brandCited ? '#166534' : '#991B1B' }}>
                  {p.brandCited ? '✓ Cited' : '✗ Not cited'}
                </Text>
              </View>
            </View>
          ))}

          <View style={{ backgroundColor: '#F0EBE3', borderRadius: 8, padding: 20, marginTop: 8 }}>
            <Text style={{ fontSize: 11, fontFamily: 'Helvetica', color: '#1A1A1A', lineHeight: 1.6 }}>
              {competitor.analysis}
            </Text>
          </View>
        </Page>
      )}

      {/* ── Next steps / CTA ──────────────────────────────────────────────────── */}
      <Page size="A4" style={styles.ctaPage}>
        <Text style={styles.ctaTitle}>Ready to become the brand AI engines recommend?</Text>
        <Text style={styles.ctaBody}>
          This pre-scan covered one page against 5 signals. The full-site audit covers 50–100 pages,
          30+ buying intent prompts, a complete competitor map, and an implementation backlog your
          dev team can work from immediately.
        </Text>

        <Text style={styles.ctaPrice}>Full-Site Audit · £497</Text>
        {[
          '50–100 pages scored across your entire store',
          '30+ buying intents tested across 4 AI engines',
          'Full competitor citation map',
          'Off-site signal analysis (Reddit, YouTube, review sites)',
          'Priority implementation backlog',
          '48-hour turnaround',
        ].map((feature, i) => (
          <Text key={i} style={styles.ctaFeature}>
            — {feature}
          </Text>
        ))}

        <View style={{ marginTop: 40 }}>
          <Text style={{ fontSize: 11, color: '#FFFFFFB0', fontFamily: 'Helvetica' }}>
            Book a call or order at{' '}
            <Link src={process.env.NEXT_PUBLIC_APP_URL ?? 'https://cited.shop'} style={{ color: '#FFFFFF' }}>
              {(process.env.NEXT_PUBLIC_APP_URL ?? 'https://cited.shop').replace('https://', '')}
            </Link>
          </Text>
        </View>
      </Page>
    </Document>
  );
}
