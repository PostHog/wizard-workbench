'use client';

import posthog from 'posthog-js';

export function PricingPageTracker() {
  // Track pricing page view when component mounts
  // Using a ref to ensure it only fires once
  if (typeof window !== 'undefined') {
    posthog.capture('pricing_page_viewed');
  }

  return null;
}
