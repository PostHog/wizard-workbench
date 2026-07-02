'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export default function PlanViewed() {
  useEffect(() => {
    posthog.capture('plan_viewed');
  }, []);
  return null;
}
