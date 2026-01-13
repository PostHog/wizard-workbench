import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { useRouter } from 'next/router';
import posthog from 'posthog-js';

export default function NotFound() {
  const router = useRouter();

  // Track 404 page view using ref to ensure single capture per mount
  const hasTrackedView = useRef(false);
  if (!hasTrackedView.current && typeof window !== 'undefined') {
    hasTrackedView.current = true;
    posthog.capture('error_page_viewed', {
      error_type: '404',
      attempted_url: router.asPath,
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Button asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
