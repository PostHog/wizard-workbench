import { findInvoice, renderPdf } from '@/lib/invoices';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = findInvoice(id);
  if (!invoice) return Response.json({ error: 'not_found' }, { status: 404 });
  return new Response(renderPdf(invoice), {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${id}.pdf"` },
  });
}
