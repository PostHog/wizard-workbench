'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

type PlanInfo = {
  name: string;
  priceId?: string;
  unitAmount: number;
  interval: string;
};

export function PricingPageTracker({ plans }: { plans: PlanInfo[] }) {
  useEffect(() => {
    posthog.capture('pricing_page_viewed', {
      plans: plans.map((p) => ({
        name: p.name,
        price_id: p.priceId,
        unit_amount: p.unitAmount,
        interval: p.interval,
      })),
    });
  }, []);

  return null;
}
