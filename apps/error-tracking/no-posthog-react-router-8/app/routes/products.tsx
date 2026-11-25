import { Link, useFetcher } from "react-router";

import type { Route } from "./+types/products";
import { listProducts, type Product } from "../lib/inventory.server";
import { toCsv } from "../lib/csv";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Products · Shelfwise" }];
}

export function loader() {
  return { products: listProducts() };
}

function ReorderButton({ product }: { product: Product }) {
  const fetcher = useFetcher<{ orderId: string }>();
  if (fetcher.data?.orderId) {
    return <span>Ordered ({fetcher.data.orderId})</span>;
  }
  return (
    <button
      type="button"
      disabled={fetcher.state !== "idle"}
      onClick={() =>
        fetcher.submit(null, { method: "post", action: `/products/${product.sku}/reorder` })
      }
    >
      Reorder {product.sku}
    </button>
  );
}

export default function Products({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;

  function exportCsv() {
    const rows = products.map((product) => ({
      sku: product.sku,
      name: product.name,
      onHand: product.onHand,
      supplier: product.supplier,
      reorderPoint: product.reorderPoint,
    }));
    const csv = toCsv(["sku", "name", "onHand", "supplier"], rows);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "products.csv";
    link.click();
  }

  return (
    <main>
      <h1>Products</h1>
      <p>
        <button type="button" onClick={exportCsv}>Export CSV</button>
      </p>
      <table>
        <thead>
          <tr><th>SKU</th><th>Name</th><th>On hand</th><th>Supplier</th><th /></tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.sku}>
              <td><Link to={`/products/${product.sku}`}>{product.sku}</Link></td>
              <td>{product.name}</td>
              <td>{product.onHand}</td>
              <td>{product.supplier}</td>
              <td>{product.onHand < product.reorderPoint && <ReorderButton product={product} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
