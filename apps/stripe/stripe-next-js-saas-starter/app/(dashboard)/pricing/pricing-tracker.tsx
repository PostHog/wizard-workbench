'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export function PricingPageTracker() {
  useEffect(() => {
    posthog.capture('pricing_viewed');
  }, []);

  return null;
}
