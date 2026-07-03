'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import posthog from 'posthog-js';

export function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const query = searchParams.toString();

    posthog.capture('$pageview', {
      current_url: query ? `${pathname}?${query}` : pathname
    });
  }, [pathname, searchParams]);

  return null;
}
