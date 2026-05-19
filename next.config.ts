import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // @react-pdf/renderer and pg use native Node.js APIs — must not be bundled
  serverExternalPackages: ['@react-pdf/renderer', 'pg', 'pg-native', 'canvas'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
