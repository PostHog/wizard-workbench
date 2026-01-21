'use client';

import { useEffect, useRef } from 'react';
import posthog from 'posthog-js';

export function PricingPageTracker() {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!hasTracked.current) {
      posthog.capture('pricing_page_viewed');
      hasTracked.current = true;
    }
  }, []);

  return null;
}
