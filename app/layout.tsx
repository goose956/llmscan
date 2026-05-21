import type { Metadata } from 'next';
import './globals.css';
import { Logo } from '@/components/Logo';

export const metadata: Metadata = {
  title: {
    default: 'cited.shop — Is your ecommerce store visible to AI?',
    template: '%s | cited.shop',
  },
  description:
    'Find out if your Shopify store gets cited when shoppers ask ChatGPT, Perplexity, or Google AI Mode for product recommendations. Free AI-visibility score in under 30 seconds.',
  metadataBase: new URL((() => { const u = process.env.NEXT_PUBLIC_APP_URL ?? 'https://cited.shop'; return u.startsWith('http') ? u : `https://${u}`; })()),
  openGraph: {
    type: 'website',
    siteName: 'cited.shop',
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
            <a href="/" className="hover:opacity-80 transition-opacity">
              <Logo />
            </a>
            <span className="text-xs text-muted-foreground hidden sm:block">
              AI Visibility for Shopify Stores
            </span>
          </div>
        </header>

        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-border/60 mt-24 py-8 text-center text-xs text-muted-foreground">
          <div className="max-w-6xl mx-auto px-4 space-y-1">
            <p>cited.shop — AI visibility for ecommerce</p>
            <p className="opacity-60">
              ~$0.07 per scan (Firecrawl + Claude) · Results stored for 30 days
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
