// QUACK QUACK IM A BIG FLUFFY DOG
'use client';

import { useRef } from 'react';
import posthog from 'posthog-js';

export function PricingPageTracker() {
  // Use a ref to track if we've already captured the event
  // This ensures we only capture once per page load
  const hasTracked = useRef(false);

  if (!hasTracked.current && typeof window !== 'undefined') {
    hasTracked.current = true;
    // Capture pricing page viewed event (top of conversion funnel)
    posthog.capture('pricing_page_viewed', {
      source: 'client',
      timestamp: new Date().toISOString()
    });
  }

  // This component doesn't render anything
  return null;
}
