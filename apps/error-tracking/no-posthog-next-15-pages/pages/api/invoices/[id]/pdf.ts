import type { NextApiRequest, NextApiResponse } from 'next';
import { findInvoice, renderPdf } from '@/lib/invoices';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = String(req.query.id);
  const invoice = findInvoice(id);
  if (!invoice) return res.status(404).json({ error: 'not_found' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${id}.pdf"`);
  res.send(renderPdf(invoice));
}
