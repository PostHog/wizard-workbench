'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import posthog from 'posthog-js';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      variant="outline"
      className="w-full rounded-full"
      onClick={(e) => {
        const form = (e.currentTarget as HTMLButtonElement).closest('form');
        const priceId = (form?.elements.namedItem('priceId') as HTMLInputElement)?.value;
        posthog.capture('pricing_cta_clicked', { price_id: priceId });
      }}
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
