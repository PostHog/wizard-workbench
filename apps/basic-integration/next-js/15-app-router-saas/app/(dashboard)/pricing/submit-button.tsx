'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import posthog from '@/app/instrumentation-client';

export function SubmitButton() {
  const { pending } = useFormStatus();

  const handleSubmitAnalytics = () => {
    try {
      posthog.capture('pricing_checkout_started', {
        source: 'client',
      });
    } catch (err) {
      console.error('PostHog capture failed', err);
    }
  };

  return (
    <Button
      type="submit"
      disabled={pending}
      variant="outline"
      className="w-full rounded-full"
      onClick={handleSubmitAnalytics}
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          Loading...
        </>
      ) : (
        <>
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}
