'use client';

import posthog from 'posthog-js';
import { useEffect } from 'react';

export function PricingPageTracker() {
  useEffect(() => {
    posthog.capture('pricing_page_viewed');
  }, []);

  return null;
}
