import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { InvoiceActions } from '@/components/invoice-actions';
import { findInvoice, formatMoney, reconcileTotals, type Invoice } from '@/lib/invoices';

type Props = { invoice: Invoice; total: number };

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const invoice = findInvoice(String(params?.id));
  if (!invoice) return { notFound: true };
  return { props: { invoice, total: reconcileTotals(invoice) } };
};

export default function InvoicePage({ invoice, total }: Props) {
  return (
    <>
      <Head>
        <title>{`${invoice.id} · Ledgerly`}</title>
      </Head>
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
