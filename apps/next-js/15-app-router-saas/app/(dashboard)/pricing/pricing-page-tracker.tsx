'use client';

import { useEffect, useRef } from 'react';
import posthog from 'posthog-js';

export function PricingPageTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      posthog.capture('pricing_page_viewed', {
        source: 'organic',
      });
      tracked.current = true;
    }
  }, []);

  return null;
}
