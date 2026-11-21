import type { NextConfig } from "next";
import { withPostHogConfig } from "@posthog/nextjs-config";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

const personalApiKey = process.env.POSTHOG_API_KEY;
const projectId = process.env.POSTHOG_PROJECT_ID;

export default personalApiKey && projectId
  ? withPostHogConfig(nextConfig, {
      personalApiKey,
      projectId,
      host: process.env.POSTHOG_HOST,
      sourcemaps: {
        enabled: true,
        deleteAfterUpload: true,
      },
    })
  : nextConfig;
