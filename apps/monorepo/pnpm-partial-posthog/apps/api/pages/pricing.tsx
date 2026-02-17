import { GetServerSideProps } from 'next';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/router';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { User, TeamDataWithMembers } from '@/lib/db/schema';

interface Price {
  id: string;
  productId: string;
  unitAmount: number;
  interval: string;
  trialPeriodDays: number;
}

interface Product {
  id: string;
  name: string;
}

interface PricingPageProps {
  prices: Price[];
  products: Product[];
  fallback: {
    '/api/user': User | null;
    '/api/team': TeamDataWithMembers | null;
  };
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button
      type="submit"
      disabled={isPending}
      variant="outline"
      className="w-full rounded-full"
    >
      {isPending ? (
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

function PricingCard({
  name,
  price,
  interval,
  trialDays,
  features,
  priceId
}: {
  name: string;
  price: number;
  interval: string;
  trialDays: number;
  features: string[];
  priceId?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      try {
        const response = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ priceId })
        });

        const result = await response.json();

        if (result.redirectTo) {
          router.push(result.redirectTo);
        } else if (result.url) {
          window.location.href = result.url;
        }
      } catch (err) {
        console.error('Checkout error:', err);
      }
    });
  }

  return (
    <div className="pt-6">
      <h2 className="text-2xl font-medium text-gray-900 mb-2">{name}</h2>
      <p className="text-sm text-gray-600 mb-4">
        with {trialDays} day free trial
      </p>
      <p className="text-4xl font-medium text-gray-900 mb-6">
        ${price / 100}{' '}
        <span className="text-xl font-normal text-gray-600">
          per user / {interval}
        </span>
      </p>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="priceId" value={priceId} />
        <SubmitButton isPending={isPending} />
      </form>
    </div>
  );
}

export default function PricingPage({
  prices,
  products,
  fallback
}: PricingPageProps) {
  const basePlan = products.find((product) => product.name === 'Base');
  const plusPlan = products.find((product) => product.name === 'Plus');

  const basePrice = prices.find((price) => price.productId === basePlan?.id);
  const plusPrice = prices.find((price) => price.productId === plusPlan?.id);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
          <PricingCard
            name={basePlan?.name || 'Base'}
            price={basePrice?.unitAmount || 800}
            interval={basePrice?.interval || 'month'}
            trialDays={basePrice?.trialPeriodDays || 7}
            features={[
              'Unlimited Usage',
              'Unlimited Workspace Members',
              'Email Support'
            ]}
            priceId={basePrice?.id}
          />
          <PricingCard
            name={plusPlan?.name || 'Plus'}
            price={plusPrice?.unitAmount || 1200}
            interval={plusPrice?.interval || 'month'}
            trialDays={plusPrice?.trialPeriodDays || 7}
            features={[
              'Everything in Base, and:',
              'Early Access to New Features',
              '24/7 Support + Slack Access'
            ]}
            priceId={plusPrice?.id}
          />
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const sessionCookie = context.req.cookies.session;
  const [prices, products, user] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
    getUser(sessionCookie)
  ]);

  const team = user ? await getTeamForUser(sessionCookie) : null;

  return {
    props: {
      prices,
      products,
      fallback: {
        '/api/user': user ? JSON.parse(JSON.stringify(user)) : null,
        '/api/team': team ? JSON.parse(JSON.stringify(team)) : null
      }
    }
  };
};
