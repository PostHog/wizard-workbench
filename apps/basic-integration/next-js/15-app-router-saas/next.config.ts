import type { NextConfig } from 'next';

const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const posthogAssetHost = posthogHost?.replace('i.', 'assets.i.');

const nextConfig: NextConfig = {
  async rewrites() {
    if (!posthogHost || !posthogAssetHost) {
      return [];
    }

    return [
      {
        source: '/ingest/static/:path*',
        destination: `${posthogAssetHost}/static/:path*`
      },
      {
        source: '/ingest/array/:path*',
        destination: `${posthogAssetHost}/array/:path*`
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
