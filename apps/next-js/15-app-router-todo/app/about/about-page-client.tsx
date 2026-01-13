// QUACK QUACK IM A BIG FLUFFY DOG
'use client';

import Link from 'next/link';
import posthog from 'posthog-js';

export function AboutPageClient() {
  const handleBackClick = () => {
    // Track navigation back to todos
    posthog.capture('back_to_todos_clicked', {
      from_page: 'about',
    });
  };

  return (
    <div className="flex justify-center">
      <Link
        href="/"
        onClick={handleBackClick}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
      >
        Back to Todos
      </Link>
    </div>
  );
}

export function AboutPageViewTracker() {
  // Track about page view on mount - using event handler pattern
  // This will be called when the component renders
  if (typeof window !== 'undefined') {
    posthog.capture('about_page_viewed', {
      referrer: document.referrer || 'direct',
    });
  }

  return null;
}
