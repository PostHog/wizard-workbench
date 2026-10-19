import { createInvoice } from "../actions";

export default function NewInvoicePage() {
  return (
    <>
      <h1>New invoice</h1>
      <form action={createInvoice}>
        <label>
          Customer
          <input name="customer" placeholder="Acme Corp" />
        </label>
        <label>
          Amount (USD)
          <input name="amount" type="number" step="0.01" placeholder="250.00" />
        </label>
        <button type="submit">Create invoice</button>
      </form>
    </>
  );
}
