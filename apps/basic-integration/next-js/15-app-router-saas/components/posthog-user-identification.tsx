'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import useSWR from 'swr';
import type { User } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function PostHogUserIdentification() {
  const { data: user } = useSWR<User | null>('/api/user', fetcher);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    posthog.identify(String(user.id), {
      email: user.email,
      name: user.name,
      role: user.role
    });
  }, [user?.email, user?.id, user?.name, user?.role]);

  return null;
}
