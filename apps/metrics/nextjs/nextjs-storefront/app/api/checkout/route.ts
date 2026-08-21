import { NextResponse } from 'next/server';
import { PostHog } from 'posthog-node';

const PAYMENT_URL = 'https://httpbin.org/status/200';

let orderCount = 0;

function createPostHogClient() {
  const token = process.env.POSTHOG_PROJECT_TOKEN;
  if (!token) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured',
      );
    }
    return null;
  }

  return new PostHog(token, {
    host: process.env.POSTHOG_HOST,
    metrics: { serviceName: 'nextjs-storefront' },
  });
}

export async function POST(req: Request) {
  const posthog = createPostHogClient();
  const payload = await req.json();
  orderCount += 1;
  const paymentStartedAt = performance.now();
  try {
    await fetch(PAYMENT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderCount, ...payload }),
    });
  } catch {
    posthog?.metrics.count('payment.requests', 1, {
      attributes: { outcome: 'unreachable' },
    });
    posthog?.metrics.histogram(
      'payment.request.duration',
      performance.now() - paymentStartedAt,
      { unit: 'ms', attributes: { outcome: 'unreachable' } },
    );
    await posthog?.shutdown();
    return NextResponse.json(
      { id: orderCount, status: 'payment-unreachable' },
      { status: 502 },
    );
  }
  posthog?.metrics.count('payment.requests', 1, {
    attributes: { outcome: 'success' },
  });
  posthog?.metrics.histogram(
    'payment.request.duration',
    performance.now() - paymentStartedAt,
    { unit: 'ms', attributes: { outcome: 'success' } },
  );
  posthog?.metrics.count('orders.placed');
  await posthog?.shutdown();
  return NextResponse.json({ id: orderCount, status: 'paid' });
}
