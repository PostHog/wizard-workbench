'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

type PostHogUserIdentifyProps = {
  user: {
    id: number;
    email: string | null;
    name: string | null;
    role: string;
  } | null;
};

export function PostHogUserIdentify({ user }: PostHogUserIdentifyProps) {
  useEffect(() => {
    if (!user) {
      return;
    }

    posthog.identify(String(user.id), {
      email: user.email ?? undefined,
      name: user.name ?? undefined,
      role: user.role
    });
  }, [user]);

  return null;
}
