import { data, Form, redirect, useSearchParams } from "react-router";

import type { Route } from "./+types/product";
import { getProduct, recordAdjustment, stockLedger } from "../lib/inventory.server";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `${params.sku} · Shelfwise` }];
}

export function loader({ params }: Route.LoaderArgs) {
  const product = getProduct(params.sku);
  if (!product) {
    throw data("Product not found", { status: 404 });
  }
  return { product, ledger: stockLedger(product) };
}

export async function action({ request, params }: Route.ActionArgs) {
  const product = getProduct(params.sku);
  if (!product) {
    throw data("Product not found", { status: 404 });
  }
  const form = await request.formData();
  const quantity = Number(form.get("quantity"));
  const reason = String(form.get("reason") ?? "received");
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw data("Quantity must be a positive whole number", { status: 400 });
  }
  recordAdjustment(product, quantity, reason);
  throw redirect(`/products/${product.sku}?adjusted=${quantity}`);
}

export default function ProductPage({ loaderData }: Route.ComponentProps) {
  const { product, ledger } = loaderData;
  const [searchParams] = useSearchParams();
  const adjusted = searchParams.get("adjusted");

  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.sku} · {product.onHand} on hand · supplier {product.supplier}</p>
      {adjusted && <p>Stock updated: +{adjusted}</p>}
      <h2>Ledger</h2>
      <ul>
        {ledger.map((entry, index) => (
          <li key={index}>{entry > 0 ? `+${entry}` : entry}</li>
        ))}
      </ul>
      <h2>Adjust stock</h2>
      <Form method="post">
        <label>
          Quantity <input name="quantity" type="number" defaultValue={1} />
        </label>{" "}
        <label>
          Reason{" "}
          <select name="reason" defaultValue="received">
            <option value="received">Received</option>
            <option value="recount">Recount</option>
            <option value="returned">Returned</option>
          </select>
        </label>{" "}
        <button type="submit">Save adjustment</button>
      </Form>
    </main>
  );
}
