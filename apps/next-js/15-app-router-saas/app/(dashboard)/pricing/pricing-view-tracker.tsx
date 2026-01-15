'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export function PricingViewTracker() {
  useEffect(() => {
    posthog.capture('pricing_viewed');
  }, []);

  return null;
}
