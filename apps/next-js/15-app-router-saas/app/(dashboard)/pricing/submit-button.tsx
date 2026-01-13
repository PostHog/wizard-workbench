'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import posthog from 'posthog-js';

export function SubmitButton({ planName, priceId }: { planName?: string; priceId?: string }) {
  const { pending } = useFormStatus();

  const handleClick = () => {
    // PostHog: Track checkout started event client-side
    posthog.capture('checkout_started', {
      planName: planName,
      priceId: priceId,
    });
  };

  return (
    <Button
      type="submit"
      disabled={pending}
      variant="outline"
      className="w-full rounded-full"
      onClick={handleClick}
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
