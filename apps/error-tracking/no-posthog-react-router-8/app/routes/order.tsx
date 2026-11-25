import type { Route } from "./+types/order";

class OrderCacheError extends Error {
  name = "OrderCacheError";
}

type CachedOrder = { id: string; customer: string; lines: { sku: string; qty: number }[] | null };

const recentOrders: Record<string, CachedOrder> = {
  "ORD-7730": { id: "ORD-7730", customer: "Riverside Joinery", lines: [{ sku: "SKU-1001", qty: 40 }] },
  "ORD-7731": { id: "ORD-7731", customer: "Northgate Cabinets", lines: null },
};

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `${params.id} · Shelfwise` }];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const order = recentOrders[params.id];
  if (!order) {
    return { order: null };
  }
  if (!order.lines) {
    throw new OrderCacheError(`Cached order ${order.id} is missing its line items (OC31)`);
  }
  return { order: { ...order, lines: order.lines } };
}

export function HydrateFallback() {
  return <main><p>Loading order…</p></main>;
}

export default function OrderPage({ loaderData }: Route.ComponentProps) {
  const { order } = loaderData;
  if (!order) {
    return <main><h1>Order not found</h1></main>;
  }
  return (
    <main>
      <h1>{order.id}</h1>
      <p>{order.customer}</p>
      <ul>
        {order.lines.map((line) => (
          <li key={line.sku}>{line.sku} × {line.qty}</li>
        ))}
      </ul>
    </main>
  );
}
