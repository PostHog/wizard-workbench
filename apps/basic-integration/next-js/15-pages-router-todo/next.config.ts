import type { NextConfig } from 'next';

const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const posthogAssetsHost = posthogHost?.replace('.i.', '-assets.i.');

const nextConfig: NextConfig = {
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
        destination: `${posthogHost}/array/:path*`,
      },
      {
        source: '/ingest/:path*',
        destination: `${posthogHost}/:path*`,
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
