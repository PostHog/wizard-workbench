'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import useSWR from 'swr';
import { User } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function PostHogUserIdentify() {
  const { data: user } = useSWR<User>('/api/user', fetcher);

  useEffect(() => {
    if (user?.email) {
      posthog.identify(user.email, {
        email: user.email,
        name: user.name ?? undefined,
      });
    }
  }, [user?.email]);

  return null;
}
