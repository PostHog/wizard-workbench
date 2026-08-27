// Fulfillment queue: pending orders drain to an external API in the background.
const FULFILLMENT_URL = 'https://httpbin.org/status/200';

const pending = [];

export function submitOrder(order) {
  pending.push(order);
}

export function pendingCount() {
  return pending.length;
}

export async function fulfillPending() {
  while (pending.length > 0) {
    const order = pending.shift();
    try {
      await fetch(FULFILLMENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
    } catch {
      // Fulfillment API unreachable: drop the order for this toy app.
    }
  }
}
