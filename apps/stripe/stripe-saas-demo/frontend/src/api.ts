const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export function createCustomer(email: string, name: string, posthogDistinctId?: string) {
  return request<{ user: any; customerId: string }>("/api/customers", {
    email,
    name,
    posthogDistinctId,
  });
}

export function createSubscription(customerId: string, priceId: string, userId?: string) {
  return request<{ subscriptionId: string; clientSecret: string; status: string }>(
    "/api/subscriptions",
    { customerId, priceId, userId }
  );
}

export function createCheckoutSession(priceId: string, userId?: string, customerEmail?: string) {
  return request<{ url: string }>("/api/checkout", { priceId, userId, customerEmail });
}
