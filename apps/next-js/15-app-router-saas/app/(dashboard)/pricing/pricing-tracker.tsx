'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export default function PricingPageTracker() {
  useEffect(() => {
    posthog.capture('pricing_page_viewed');
  }, []);

  return null;
}
