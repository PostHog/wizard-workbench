'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import posthog from 'posthog-js';

export function SubmitButton() {
  const { pending } = useFormStatus();

  const handleCheckout = () => {
    posthog.capture('checkout_initiated', {
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <Button
      type="submit"
      disabled={pending}
      variant="outline"
      className="w-full rounded-full"
      onClick={handleCheckout}
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
