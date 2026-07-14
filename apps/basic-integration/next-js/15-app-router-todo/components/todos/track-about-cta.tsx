'use client';

import type { ReactNode } from 'react';
import posthog from 'posthog-js';

interface TrackAboutCtaProps {
  children: ReactNode;
}

export function TrackAboutCta({ children }: TrackAboutCtaProps) {
  return (
    <div
      onClick={() => {
        posthog.capture('about_page_cta_clicked', {
          destination: 'home',
        });
      }}
    >
      {children}
    </div>
  );
}
