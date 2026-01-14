'use client';

import Link from 'next/link';
import posthog from 'posthog-js';

interface TrackedLinkProps {
  href: string;
  eventName: string;
  eventProperties?: Record<string, unknown>;
  className?: string;
  children: React.ReactNode;
}

export function TrackedLink({ href, eventName, eventProperties, className, children }: TrackedLinkProps) {
  const handleClick = () => {
    posthog.capture(eventName, eventProperties);
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
