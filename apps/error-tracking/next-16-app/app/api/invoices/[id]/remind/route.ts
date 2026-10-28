import { findInvoice, queueReminder } from '@/lib/invoices';
import { posthogServer } from '@/lib/posthog-server';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = findInvoice(id);
  if (!invoice) return Response.json({ error: 'not_found' }, { status: 404 });
  await queueReminder(invoice);
  posthogServer().capture({ distinctId: invoice.customerId, event: 'reminder_queued', properties: { invoice: invoice.id } });
  return Response.json({ queued: true });
}
