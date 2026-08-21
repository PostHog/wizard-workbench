// Fulfillment queue: pending orders drain to an external API in the background.
const FULFILLMENT_URL = 'https://httpbin.org/status/200';

const pending = [];

export function submitOrder(order) {
  pending.push(order);
}

export function pendingCount() {
  return pending.length;
}

export async function fulfillPending(posthog) {
  while (pending.length > 0) {
    const order = pending.shift();
    const startedAt = performance.now();
    let outcome = 'success';
    try {
      const response = await fetch(FULFILLMENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      outcome = response.ok ? 'success' : 'error';
    } catch {
      outcome = 'error';
      // Fulfillment API unreachable: drop the order for this toy app.
    } finally {
      const attributes = { dependency: 'fulfillment_api', outcome };
      posthog?.metrics.count('external.requests', 1, { attributes });
      posthog?.metrics.histogram('external.request.duration', performance.now() - startedAt, {
        unit: 'ms',
        attributes,
      });
    }
  }
}
