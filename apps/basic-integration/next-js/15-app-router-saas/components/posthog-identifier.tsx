'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import posthog from 'posthog-js';
import type { User } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function getDistinctId(user: Pick<User, 'id'>) {
  return `user:${user.id}`;
}

export default function PostHogIdentifier() {
  const { data: user } = useSWR<User | null>('/api/user', fetcher);

  useEffect(() => {
    if (!user) {
      posthog.reset();
      return;
    }

    posthog.identify(getDistinctId(user), {
      email: user.email,
      name: user.name ?? undefined,
      role: user.role
    });
  }, [user]);

  return null;
}
