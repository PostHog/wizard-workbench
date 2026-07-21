'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import useSWR from 'swr';
import { User } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export function PostHogIdentity() {
  const { data: user } = useSWR<User | null>('/api/user', fetcher);

  useEffect(() => {
    if (user) {
      posthog.identify(String(user.id), {
        email: user.email,
        name: user.name,
        role: user.role
      });
    }
  }, [user]);

  return null;
}
