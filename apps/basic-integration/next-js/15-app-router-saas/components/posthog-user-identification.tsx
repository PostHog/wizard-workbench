'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import useSWR from 'swr';
import type { User } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export function PostHogUserIdentification() {
  const { data: user } = useSWR<User>('/api/user', fetcher);

  useEffect(() => {
    if (!user) {
      return;
    }

    posthog.identify(`user_${user.id}`, {
      email: user.email,
      name: user.name,
      role: user.role
    });
  }, [user]);

  return null;
}
