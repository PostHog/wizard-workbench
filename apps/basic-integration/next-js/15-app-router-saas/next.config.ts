import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuration for stable Next.js 15
  // To enable experimental features like PPR, upgrade to canary:
  // pnpm add next@canary
  skipTrailingSlashRedirect: true
};

export default nextConfig;
