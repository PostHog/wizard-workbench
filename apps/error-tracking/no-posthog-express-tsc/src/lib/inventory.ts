import { setTimeout as delay } from 'node:timers/promises';
import type { Product } from './catalog.js';

export type Reservation = {
  id: string;
  sku: string;
  quantity: number;
  expiresAt: string;
};

export async function reserveStock(
  product: Product,
  quantity: number,
): Promise<Reservation> {
  // Simulates the round trip to the warehouse service.
  await delay(20);

  if (product.stock < quantity) {
    throw new Error(
      `Inventory service refused reservation for ${product.sku}: requested ${quantity}, available ${product.stock}`,
    );
  }

  return {
    id: crypto.randomUUID(),
    sku: product.sku,
    quantity,
    expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
  };
}
