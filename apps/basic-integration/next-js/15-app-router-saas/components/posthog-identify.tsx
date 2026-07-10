'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import useSWR from 'swr';
import { User } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function PostHogIdentify() {
  const { data: user } = useSWR<User>('/api/user', fetcher);

  useEffect(() => {
    if (user?.id) {
      posthog.identify(String(user.id), {
        name: user.name ?? undefined,
        role: user.role,
      });
    }
  }, [user?.id]);

  return null;
}
