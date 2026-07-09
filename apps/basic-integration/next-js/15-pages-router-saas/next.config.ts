import type { NextConfig } from 'next';

const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const posthogAssetsHost = posthogHost?.includes('eu.i.posthog.com')
  ? 'https://eu-assets.i.posthog.com'
  : 'https://us-assets.i.posthog.com';

const nextConfig: NextConfig = {
  // Configuration for stable Next.js 15
  // To enable experimental features like PPR, upgrade to canary:
  // pnpm add next@canary
  async rewrites() {
    if (!posthogHost) {
      return [];
    }

    return [
      {
        source: '/ingest/static/:path*',
        destination: `${posthogAssetsHost}/static/:path*`
      },
      {
        source: '/ingest/array/:path*',
        destination: `${posthogAssetsHost}/array/:path*`
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
