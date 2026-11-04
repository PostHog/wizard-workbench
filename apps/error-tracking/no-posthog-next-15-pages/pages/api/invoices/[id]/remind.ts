import type { NextApiRequest, NextApiResponse } from 'next';
import { findInvoice, queueReminder } from '@/lib/invoices';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const invoice = findInvoice(String(req.query.id));
  if (!invoice) return res.status(404).json({ error: 'not_found' });
  await queueReminder(invoice);
  res.json({ queued: true });
}
