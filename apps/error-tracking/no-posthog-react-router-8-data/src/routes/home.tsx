import { useState } from "react";
import { Link, useLoaderData } from "react-router";

import { listProducts, syncInventoryBatch } from "../lib/inventory";

export async function homeLoader() {
  const products = await listProducts();
  return {
    lowStock: products.filter((product) => product.onHand < product.reorderPoint),
    total: products.length,
  };
}

export function Home() {
  const { lowStock, total } = useLoaderData<typeof homeLoader>();
  const [syncing, setSyncing] = useState(false);

  function syncNow() {
    setSyncing(true);
    void syncInventoryBatch("EX-77");
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>
        {total} products tracked.{" "}
        <button type="button" onClick={syncNow} disabled={syncing}>
          {syncing ? "Sync started" : "Sync warehouse"}
        </button>
      </p>
      <p><Link to="/warehouse-sync">Warehouse sync status</Link></p>
      <h2>Below reorder point</h2>
      <ul>
        {lowStock.map((product) => (
          <li key={product.sku}>
            <Link to={`/products/${product.sku}`}>{product.sku}</Link> — {product.name} ({product.onHand} on hand)
          </li>
        ))}
      </ul>
    </main>
  );
}
