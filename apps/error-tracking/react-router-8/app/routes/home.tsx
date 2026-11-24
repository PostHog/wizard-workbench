import { Link } from "react-router";

import type { Route } from "./+types/home";
import { listProducts } from "../lib/inventory.server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Shelfwise" }];
}

export function loader() {
  const products = listProducts();
  return {
    lowStock: products.filter((product) => product.onHand < product.reorderPoint),
    total: products.length,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>Dashboard</h1>
      <p>{loaderData.total} products tracked.</p>
      <h2>Below reorder point</h2>
      <ul>
        {loaderData.lowStock.map((product) => (
          <li key={product.sku}>
            <Link to={`/products/${product.sku}`}>{product.sku}</Link> — {product.name} ({product.onHand} on hand)
          </li>
        ))}
      </ul>
      <p><Link to="/warehouse-sync">Warehouse sync status</Link></p>
      <h2>Recent orders</h2>
      <ul>
        <li><Link to="/orders/ORD-7730">ORD-7730</Link> — Riverside Joinery</li>
        <li><Link to="/orders/ORD-7731">ORD-7731</Link> — Northgate Cabinets</li>
      </ul>
    </main>
  );
}
