'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import { User } from '@/lib/db/schema';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function PostHogIdentifier() {
  const { data: user } = useSWR<User>('/api/user', fetcher);

  useEffect(() => {
    if (user?.id) {
      posthog.identify(String(user.id), {
        email: user.email,
        name: user.name ?? undefined,
      });
    }
  }, [user?.id]);

  return null;
}
