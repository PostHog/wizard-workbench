'use server';

import { redirect } from 'next/navigation';
import { checkCredit, listInvoices } from '@/lib/invoices';
import { posthogServer } from '@/lib/posthog-server';

export async function createInvoice(formData: FormData) {
  const customerId = String(formData.get('customer') ?? '').trim().toUpperCase();
  const amountCents = Math.round(Number(formData.get('amount') ?? 0) * 100);

  const open = listInvoices().find((i) => i.customerId === customerId && i.status !== 'draft');
  if (open) {
    // Customers with an open invoice get their existing invoice instead of a duplicate.
    redirect(`/invoices/${open.id}`);
  }

  checkCredit(customerId, amountCents);
  posthogServer().capture({ distinctId: customerId, event: 'invoice_created', properties: { amount_cents: amountCents } });
  redirect('/?created=1');
}
