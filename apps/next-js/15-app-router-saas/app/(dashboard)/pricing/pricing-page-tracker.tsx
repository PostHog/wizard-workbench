'use client';

import posthog from 'posthog-js';

// PostHog: Track pricing page view on component mount
// This is at the top of the conversion funnel
export function PricingPageTracker() {
  // Track pricing page view on mount using an inline handler
  // This avoids using useEffect which can cause issues
  if (typeof window !== 'undefined') {
    // Ensure we only track once per page load
    const trackKey = 'posthog_pricing_viewed';
    if (!sessionStorage.getItem(trackKey)) {
      posthog.capture('pricing_page_viewed');
      sessionStorage.setItem(trackKey, 'true');
    }
  }

  return null;
}
