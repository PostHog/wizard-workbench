import type { NextConfig } from 'next';

const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const posthogAssetsHost = posthogHost?.replace(
  '.i.posthog.com',
  '-assets.i.posthog.com'
);

const nextConfig: NextConfig = {
  async rewrites() {
    if (!posthogHost || !posthogAssetsHost) {
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
