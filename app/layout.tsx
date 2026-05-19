import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'LLM Scan — Is your ecommerce store visible to AI?',
    template: '%s | LLM Scan',
  },
  description:
    'Find out how visible your ecommerce store is when shoppers ask ChatGPT, Perplexity, or Google AI Mode for product recommendations. Free LLM-readiness score in under 30 seconds.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://llmscan.app'),
  openGraph: {
    type: 'website',
    siteName: 'LLM Scan',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        {/* Top nav */}
        <header className="border-b border-border/60 bg-background/95 backdrop-blur sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <a href="/" className="font-display text-lg font-semibold text-foreground hover:text-primary transition-colors">
              LLM Scan
            </a>
            <span className="text-xs text-muted-foreground hidden sm:block">
              LLM-Readiness Pre-Scan for Ecommerce
            </span>
          </div>
        </header>

        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-border/60 mt-24 py-8 text-center text-xs text-muted-foreground">
          <div className="max-w-6xl mx-auto px-4 space-y-1">
            <p>LLM Scan — a GEO consultancy lead-gen tool</p>
            <p className="opacity-60">
              ~$0.07 per scan (Firecrawl + Claude) · Results stored for 30 days
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
