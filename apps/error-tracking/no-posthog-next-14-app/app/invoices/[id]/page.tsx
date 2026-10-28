import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { customerName, findInvoice, formatMoney, reconcileTotals } from '@/lib/invoices';
import { InvoiceActions } from './invoice-actions';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const invoice = findInvoice(id);
  if (!invoice) return { title: 'Invoice not found' };
  return { title: `${invoice.id} · ${customerName(invoice)}` };
}

export default async function InvoicePage({ params }: Props) {
  const { id } = params;
  const invoice = findInvoice(id);
  if (!invoice) notFound();
  const total = reconcileTotals(invoice);

  return (
    <>
      <h1>{invoice.id}</h1>
      <p>
        Customer {invoice.customerId} · issued {invoice.issuedOn} · {invoice.status}
      </p>
      <table>
        <tbody>
          {invoice.lines.map((line, i) => (
            <tr key={i}>
              <td>{line.description}</td>
              <td>{formatMoney(line.amountCents)}</td>
            </tr>
          ))}
          <tr>
            <th>Total</th>
            <th>{formatMoney(total)}</th>
          </tr>
        </tbody>
      </table>
      <InvoiceActions invoice={invoice} />
    </>
  );
}
