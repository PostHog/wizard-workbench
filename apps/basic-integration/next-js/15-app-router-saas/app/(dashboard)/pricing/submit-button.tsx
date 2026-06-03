'use client';

import posthog from 'posthog-js';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.closest('form');
    const priceId = form?.querySelector<HTMLInputElement>('input[name="priceId"]')?.value;
    posthog.capture('checkout_started', { price_id: priceId });
  }

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
