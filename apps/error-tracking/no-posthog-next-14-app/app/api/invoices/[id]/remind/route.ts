import { findInvoice, queueReminder } from '@/lib/invoices';

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const invoice = findInvoice(id);
  if (!invoice) return Response.json({ error: 'not_found' }, { status: 404 });
  await queueReminder(invoice);
  return Response.json({ queued: true });
}
