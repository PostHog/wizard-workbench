'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import posthog from 'posthog-js';

type SubmitButtonProps = {
  planName: string;
  billingInterval: string;
};

export function SubmitButton({ planName, billingInterval }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      variant="outline"
      className="w-full rounded-full"
      onClick={() =>
        posthog.capture('checkout_started', {
          plan_name: planName,
          billing_interval: billingInterval
        })
      }
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
