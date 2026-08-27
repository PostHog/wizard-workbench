import { PRICE_IDS, type PlanId } from '@/lib/stripe';

export interface CartLine {
  plan: PlanId;
  quantity: number;
}

/** Turn a cart into the line items Stripe Checkout expects. */
export function toLineItems(lines: CartLine[]) {
  return lines
    .filter((line) => line.quantity > 0)
    .map((line) => ({ price: PRICE_IDS[line.plan], quantity: line.quantity }));
}
