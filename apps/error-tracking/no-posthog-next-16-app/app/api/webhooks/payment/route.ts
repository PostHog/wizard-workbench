import { after } from 'next/server';
import { reconcilePayment } from '@/lib/invoices';

type PaymentEvent = { id: string; invoice: string };

export async function POST(request: Request) {
  const event = (await request.json()) as PaymentEvent;
  // Acknowledge the provider right away; reconciliation runs after the response.
  after(() => reconcilePayment(event.id, event.invoice));
  return Response.json({ received: true });
}
