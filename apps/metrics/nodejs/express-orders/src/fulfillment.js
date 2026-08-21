// Fulfillment queue: pending orders drain to an external API in the background.
const FULFILLMENT_URL = 'https://httpbin.org/status/200';

let _posthog = null;
export function initMetrics(client) { _posthog = client; }

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
    const t0 = Date.now();
    try {
      await fetch(FULFILLMENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      if (_posthog) _posthog.metrics.count('fulfillment.calls', 1, { attributes: { outcome: 'success' } });
    } catch {
      // Fulfillment API unreachable: drop the order for this toy app.
      if (_posthog) _posthog.metrics.count('fulfillment.calls', 1, { attributes: { outcome: 'error' } });
    }
    if (_posthog) _posthog.metrics.histogram('fulfillment.duration', Date.now() - t0, { unit: 'ms' });
  }
}
