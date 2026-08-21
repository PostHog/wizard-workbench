import { NextResponse } from 'next/server';
import { posthog } from '../../../lib/posthog';

const PAYMENT_URL = 'https://httpbin.org/status/200';

let orderCount = 0;

export async function POST(req: Request) {
  const start = Date.now();
  posthog?.metrics.count('http.requests', 1, { attributes: { route: '/api/checkout', method: 'POST' } });

  const payload = await req.json();
  orderCount += 1;

  try {
    const paymentStart = Date.now();
    await fetch(PAYMENT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderCount, ...payload }),
    });
    posthog?.metrics.histogram('payment.request.duration', Date.now() - paymentStart, { unit: 'ms', attributes: { outcome: 'success' } });
    posthog?.metrics.count('payment.requests', 1, { attributes: { outcome: 'success' } });
  } catch {
    posthog?.metrics.count('payment.requests', 1, { attributes: { outcome: 'unreachable' } });
    posthog?.metrics.histogram('http.request.duration', Date.now() - start, { unit: 'ms', attributes: { route: '/api/checkout', status: '502' } });
    return NextResponse.json(
      { id: orderCount, status: 'payment-unreachable' },
      { status: 502 },
    );
  }

  posthog?.metrics.count('orders.placed', 1);
  posthog?.metrics.histogram('http.request.duration', Date.now() - start, { unit: 'ms', attributes: { route: '/api/checkout', status: '200' } });
  return NextResponse.json({ id: orderCount, status: 'paid' });
}
