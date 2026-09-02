/**
 * Stripe Stub Implementation
 *
 * This file provides mock implementations of Stripe API calls for development
 * without requiring real Stripe API keys.
 *
 * To use: Set STRIPE_MODE=stub in your .env file
 */

export interface StubCheckoutSession {
  id: string;
  url: string;
  customer: { id: string };
  subscription: string;
  client_reference_id: string;
  payment_method_types: string[];
  line_items: Array<{ price: string; quantity: number }>;
  mode: string;
  success_url: string;
  cancel_url: string;
  allow_promotion_codes: boolean;
  subscription_data?: { trial_period_days: number };
}

export interface StubBillingPortalSession {
  id: string;
  url: string;
  customer: string;
  return_url: string;
  configuration: string;
}

export interface StubSubscription {
  id: string;
  customer: string;
  status: 'active' | 'trialing' | 'canceled' | 'unpaid' | 'past_due';
  items: {
    data: Array<{
      id: string;
      price: StubPrice;
      plan?: StubPrice;
    }>;
  };
}

export interface StubPrice {
  id: string;
  product: string | StubProduct;
  unit_amount: number;
  currency: string;
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year';
    trial_period_days?: number;
  };
}

export interface StubProduct {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  default_price?: string | StubPrice;
}

export interface StubBillingPortalConfiguration {
  id: string;
  business_profile: { headline: string };
  features: Record<string, unknown>;
}

export interface StubEvent {
  id: string;
  type: string;
  data: {
    object: StubSubscription | Record<string, unknown>;
  };
}

/**
 * Stub Stripe Client
 * Mimics the Stripe SDK structure but returns mock data
 */
export class StripeStub {
  checkout = {
    sessions: {
      create: async (params: Record<string, unknown>): Promise<StubCheckoutSession> => {
        const sessionId = `cs_stub_${Date.now()}`;
        const customerId = (params.customer as string) || `cus_stub_${Date.now()}`;
        const subscriptionId = `sub_stub_${Date.now()}`;

        console.log('[Stripe Stub] Creating checkout session:', params);

        return {
          id: sessionId,
          url: `${params.success_url}`.replace('{CHECKOUT_SESSION_ID}', sessionId),
          customer: { id: customerId },
          subscription: subscriptionId,
          client_reference_id: params.client_reference_id as string,
          payment_method_types: params.payment_method_types as string[],
          line_items: params.line_items as Array<{ price: string; quantity: number }>,
          mode: params.mode as string,
          success_url: params.success_url as string,
          cancel_url: params.cancel_url as string,
          allow_promotion_codes: params.allow_promotion_codes as boolean,
          subscription_data: params.subscription_data as { trial_period_days: number } | undefined,
        };
      },
      retrieve: async (
        sessionId: string,
        options?: { expand?: string[] }
      ): Promise<StubCheckoutSession> => {
        console.log('[Stripe Stub] Retrieving checkout session:', sessionId);

        const customerId = `cus_stub_${Date.now()}`;
        const subscriptionId = `sub_stub_${Date.now()}`;

        return {
          id: sessionId,
          url: `http://localhost:3000/dashboard`,
          customer: { id: customerId },
          subscription: subscriptionId,
          client_reference_id: '1', // Default user ID
          payment_method_types: ['card'],
          line_items: [{ price: 'price_stub_basic', quantity: 1 }],
          mode: 'subscription',
          success_url: 'http://localhost:3000/api/stripe/checkout',
          cancel_url: 'http://localhost:3000/pricing',
          allow_promotion_codes: true,
          subscription_data: { trial_period_days: 14 },
        };
      },
    },
  };

  subscriptions = {
    retrieve: async (
      subscriptionId: string,
      options?: { expand?: string[] }
    ): Promise<StubSubscription> => {
      console.log('[Stripe Stub] Retrieving subscription:', subscriptionId);

      return {
        id: subscriptionId,
        customer: `cus_stub_${Date.now()}`,
        status: 'trialing',
        items: {
          data: [
            {
              id: 'si_stub_1',
              price: {
                id: 'price_stub_basic',
                product: {
                  id: 'prod_stub_basic',
                  name: 'Basic Plan',
                  description: 'Basic tier subscription',
                  active: true,
                },
                unit_amount: 1000,
                currency: 'usd',
                recurring: {
                  interval: 'month',
                  trial_period_days: 14,
                },
              },
            },
          ],
        },
      };
    },
  };

  billingPortal = {
    configurations: {
      list: async (): Promise<{ data: StubBillingPortalConfiguration[] }> => {
        console.log('[Stripe Stub] Listing billing portal configurations');
        return {
          data: [
            {
              id: 'bpc_stub_1',
              business_profile: { headline: 'Manage your subscription' },
              features: {},
            },
          ],
        };
      },
      create: async (params: Record<string, unknown>): Promise<StubBillingPortalConfiguration> => {
        console.log('[Stripe Stub] Creating billing portal configuration:', params);
        return {
          id: `bpc_stub_${Date.now()}`,
          business_profile: params.business_profile as { headline: string },
          features: params.features as Record<string, unknown>,
        };
      },
    },
    sessions: {
      create: async (params: {
        customer: string;
        return_url: string;
        configuration?: string;
      }): Promise<StubBillingPortalSession> => {
        console.log('[Stripe Stub] Creating billing portal session:', params);
        return {
          id: `bps_stub_${Date.now()}`,
          url: `http://localhost:3000/dashboard?stub=billing-portal`,
          customer: params.customer,
          return_url: params.return_url,
          configuration: params.configuration || 'bpc_stub_default',
        };
      },
    },
  };

  products = {
    list: async (params?: {
      active?: boolean;
      expand?: string[];
    }): Promise<{ data: StubProduct[] }> => {
      console.log('[Stripe Stub] Listing products:', params);
      return {
        data: [
          {
            id: 'prod_stub_basic',
            name: 'Basic Plan',
            description: 'Perfect for getting started',
            active: true,
            default_price: 'price_stub_basic_monthly',
          },
          {
            id: 'prod_stub_pro',
            name: 'Pro Plan',
            description: 'For growing teams',
            active: true,
            default_price: 'price_stub_pro_monthly',
          },
          {
            id: 'prod_stub_enterprise',
            name: 'Enterprise Plan',
            description: 'For large organizations',
            active: true,
            default_price: 'price_stub_enterprise_monthly',
          },
        ],
      };
    },
    retrieve: async (productId: string): Promise<StubProduct> => {
      console.log('[Stripe Stub] Retrieving product:', productId);
      return {
        id: productId,
        name: 'Basic Plan',
        description: 'Perfect for getting started',
        active: true,
      };
    },
  };

  prices = {
    list: async (params?: {
      active?: boolean;
      type?: string;
      product?: string;
      expand?: string[];
    }): Promise<{ data: StubPrice[] }> => {
      console.log('[Stripe Stub] Listing prices:', params);
      return {
        data: [
          {
            id: 'price_stub_basic_monthly',
            product: {
              id: 'prod_stub_basic',
              name: 'Basic Plan',
              description: 'Perfect for getting started',
              active: true,
            },
            unit_amount: 1000, // $10.00
            currency: 'usd',
            recurring: {
              interval: 'month',
              trial_period_days: 14,
            },
          },
          {
            id: 'price_stub_pro_monthly',
            product: {
              id: 'prod_stub_pro',
              name: 'Pro Plan',
              description: 'For growing teams',
              active: true,
            },
            unit_amount: 2500, // $25.00
            currency: 'usd',
            recurring: {
              interval: 'month',
              trial_period_days: 14,
            },
          },
          {
            id: 'price_stub_enterprise_monthly',
            product: {
              id: 'prod_stub_enterprise',
              name: 'Enterprise Plan',
              description: 'For large organizations',
              active: true,
            },
            unit_amount: 10000, // $100.00
            currency: 'usd',
            recurring: {
              interval: 'month',
              trial_period_days: 14,
            },
          },
        ],
      };
    },
  };

  webhooks = {
    constructEvent: (
      payload: string,
      signature: string,
      secret: string
    ): StubEvent => {
      console.log('[Stripe Stub] Constructing webhook event');

      // Parse the payload
      const parsedPayload = JSON.parse(payload);

      return {
        id: `evt_stub_${Date.now()}`,
        type: parsedPayload.type || 'customer.subscription.updated',
        data: {
          object: parsedPayload.data?.object || {
            id: `sub_stub_${Date.now()}`,
            customer: `cus_stub_${Date.now()}`,
            status: 'active',
            items: {
              data: [
                {
                  plan: {
                    product: {
                      id: 'prod_stub_basic',
                      name: 'Basic Plan',
                    },
                  },
                },
              ],
            },
          },
        },
      };
    },
  };
}

export const stripeStub = new StripeStub();
