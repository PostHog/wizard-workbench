'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

type PostHogUserIdentifyProps = {
  userId: number | null;
  email: string | null;
  name: string | null;
  role: string | null;
};

export function PostHogUserIdentify({
  userId,
  email,
  name,
  role
}: PostHogUserIdentifyProps) {
  useEffect(() => {
    if (!userId) {
      return;
    }

    posthog.identify(String(userId), {
      email: email ?? undefined,
      name: name ?? undefined,
      role: role ?? undefined
    });
  }, [email, name, role, userId]);

  return null;
}
