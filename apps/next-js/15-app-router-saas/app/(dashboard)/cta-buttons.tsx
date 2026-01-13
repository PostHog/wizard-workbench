'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import posthog from 'posthog-js';

export function DeployButton() {
  const handleClick = () => {
    posthog.capture('cta_deploy_clicked', {
      destination: 'vercel',
    });
  };

  return (
    <a
      href="https://vercel.com/templates/next.js/next-js-saas-starter"
      target="_blank"
      onClick={handleClick}
    >
      <Button
        size="lg"
        variant="outline"
        className="text-lg rounded-full"
      >
        Deploy your own
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </a>
  );
}

export function ViewCodeButton() {
  const handleClick = () => {
    posthog.capture('cta_view_code_clicked', {
      destination: 'github',
    });
  };

  return (
    <a
      href="https://github.com/nextjs/saas-starter"
      target="_blank"
      onClick={handleClick}
    >
      <Button
        size="lg"
        variant="outline"
        className="text-lg rounded-full"
      >
        View the code
        <ArrowRight className="ml-3 h-6 w-6" />
      </Button>
    </a>
  );
}
