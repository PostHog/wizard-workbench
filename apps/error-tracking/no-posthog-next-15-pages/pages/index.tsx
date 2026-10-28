import Link from 'next/link';
import { formatMoney, listInvoices } from '@/lib/invoices';

export default function InvoicesPage() {
  const invoices = listInvoices();
  return (
    <>
      <h1>Invoices</h1>
      <table>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>
                <Link href={`/invoices/${invoice.id}`}>{invoice.id}</Link>
              </td>
              <td>{invoice.issuedOn}</td>
              <td>{invoice.status}</td>
              <td>{formatMoney(invoice.totalCents)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
