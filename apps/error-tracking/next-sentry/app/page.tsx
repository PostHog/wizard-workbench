import { formatCents, invoices } from "@/lib/invoices";

export default function Home() {
  return (
    <>
      <h1>Invoices</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Issued</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.customer}</td>
              <td>{formatCents(invoice.amountCents)}</td>
              <td>{invoice.status}</td>
              <td>{invoice.issuedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
