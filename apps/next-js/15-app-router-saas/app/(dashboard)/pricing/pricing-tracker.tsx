'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export function PricingTracker() {
  useEffect(() => {
    posthog.capture('pricing_page_viewed');
  }, []);

  return null;
}
