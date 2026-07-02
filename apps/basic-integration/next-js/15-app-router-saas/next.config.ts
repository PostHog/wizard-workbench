import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Required for PostHog ingestion endpoints that may include trailing slashes
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
