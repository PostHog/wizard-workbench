import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuration for stable Next.js 15
  // To enable experimental features like PPR, upgrade to canary:
  // pnpm add next@canary
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: `${process.env.NEXT_PUBLIC_POSTHOG_ASSETS_HOST}/static/:path*`
      },
      {
        source: '/ingest/array/:path*',
        destination: `${process.env.NEXT_PUBLIC_POSTHOG_ASSETS_HOST}/array/:path*`
      },
      {
        source: '/ingest/:path*',
        destination: `${process.env.NEXT_PUBLIC_POSTHOG_HOST}/:path*`
      }
    ];
  },
  skipTrailingSlashRedirect: true
};

export default nextConfig;
