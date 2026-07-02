import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuration for stable Next.js 15
  // PostHog reverse proxy rewrites
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: 'https://us-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/array/:path*', destination: 'https://us-assets.i.posthog.com/array/:path*' },
      { source: '/ingest/:path*', destination: 'https://us.i.posthog.com/:path*' }
    ];
  },
  // Support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true
  // To enable experimental features like PPR, upgrade to canary:
  // pnpm add next@canary
};

export default nextConfig;
