import type { NextConfig } from 'next';

const assetsHost = process.env.NEXT_PUBLIC_POSTHOG_ASSETS_HOST;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

const nextConfig: NextConfig = {
  // Configuration for stable Next.js 15
  // To enable experimental features like PPR, upgrade to canary:
  // pnpm add next@canary
  async rewrites() {
    if (!assetsHost || !posthogHost) {
      return [];
    }

    return [
      {
        source: '/ingest/static/:path*',
        destination: `${assetsHost}/static/:path*`
      },
      {
        source: '/ingest/array/:path*',
        destination: `${assetsHost}/array/:path*`
      },
      {
        source: '/ingest/:path*',
        destination: `${posthogHost}/:path*`
      }
    ];
  },
  skipTrailingSlashRedirect: true
};

export default nextConfig;
