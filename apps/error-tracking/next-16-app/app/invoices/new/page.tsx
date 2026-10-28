import { createInvoice } from './actions';

export default function NewInvoicePage() {
  return (
    <>
      <h1>New invoice</h1>
      <form action={createInvoice}>
        <p>
          <label>
            Customer ID <input name="customer" placeholder="ACME-0007" required />
          </label>
        </p>
        <p>
          <label>
            Amount (USD) <input name="amount" type="number" defaultValue="1200" />
          </label>
        </p>
        <button type="submit">Create invoice</button>
      </form>
    </>
  );
}
