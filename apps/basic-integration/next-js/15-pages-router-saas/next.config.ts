import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuration for stable Next.js 15
  // To enable experimental features like PPR, upgrade to canary:
  // pnpm add next@canary
  async rewrites() {
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!posthogHost) {
      return [];
    }

    const posthogAssetsUrl = new URL(posthogHost);
    posthogAssetsUrl.hostname = posthogAssetsUrl.hostname.replace(
      /^([^.]+)/,
      '$1-assets'
    );

    return [
      {
        source: '/ingest/static/:path*',
        destination: `${posthogAssetsUrl.origin}/static/:path*`
      },
      {
        source: '/ingest/array/:path*',
        destination: `${posthogAssetsUrl.origin}/array/:path*`
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
