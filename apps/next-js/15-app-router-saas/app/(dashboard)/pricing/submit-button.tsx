'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import posthog from 'posthog-js';

export function SubmitButton() {
  const { pending } = useFormStatus();

  const handleClick = () => {
    // PostHog: Track pricing plan selection on client side
    // Note: priceId is captured from the form's hidden input by the server action
    posthog.capture('pricing_plan_selected', {
      source: 'client'
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
