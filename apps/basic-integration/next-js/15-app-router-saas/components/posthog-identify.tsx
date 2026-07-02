'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export function PostHogIdentify({
  userId,
  email,
  name,
}: {
  userId: string;
  email: string;
  name?: string | null;
}) {
  useEffect(() => {
    posthog.identify(userId, {
      email,
      name: name ?? undefined,
    });
  }, [userId, email, name]);

  return null;
}
