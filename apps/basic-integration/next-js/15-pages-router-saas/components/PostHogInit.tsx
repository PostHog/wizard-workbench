'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!projectToken || !host) {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      `${!projectToken ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN' : 'NEXT_PUBLIC_POSTHOG_HOST'} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!projectToken ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN' : 'NEXT_PUBLIC_POSTHOG_HOST'} is configured`,
    );
  }
} else {
  posthog.init(projectToken, {
    api_host: host,
    defaults: '2026-01-30',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development',
  });
}

export default function PostHogInit() {
  useEffect(() => {
    if (!projectToken || !host) {
      return;
    }

    async function identifyAuthenticatedUser() {
      const response = await fetch('/api/user');
      if (!response.ok) {
        return;
      }

      const user = await response.json();
      if (user?.id !== undefined && user?.id !== null) {
        posthog.identify(String(user.id), {
          email: user.email,
          name: user.name,
          role: user.role
        });
      }
    }

    void identifyAuthenticatedUser();
  }, []);

  return null;
}
