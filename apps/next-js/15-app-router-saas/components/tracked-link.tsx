'use client';

import posthog from 'posthog-js';

interface TrackedLinkProps {
  href: string;
  eventName: string;
  eventProperties?: Record<string, unknown>;
  children: React.ReactNode;
  className?: string;
  target?: string;
}

export function TrackedLink({
  href,
  eventName,
  eventProperties = {},
  children,
  className,
  target,
}: TrackedLinkProps) {
  const handleClick = () => {
    posthog.capture(eventName, {
      ...eventProperties,
      href,
    });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      target={target}
    >
      {children}
    </a>
  );
}
