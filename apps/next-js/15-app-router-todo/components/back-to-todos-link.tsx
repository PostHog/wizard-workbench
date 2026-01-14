'use client';

import Link from 'next/link';
import posthog from 'posthog-js';

export function BackToTodosLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
      onClick={() => posthog.capture('back_to_todos_clicked')}
    >
      Back to Todos
    </Link>
  );
}
