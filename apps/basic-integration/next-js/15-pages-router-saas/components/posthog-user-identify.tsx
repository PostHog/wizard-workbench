'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import type { User } from '@/lib/db/schema';

export function PostHogUserIdentify({ user }: { user?: User | null }) {
  useEffect(() => {
    if (!user) {
      return;
    }

    posthog.identify(String(user.id), {
      email: user.email,
      name: user.name,
      role: user.role
    });
  }, [user]);

  return null;
}
