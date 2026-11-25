import { data, useLoaderData } from "react-router";

import { carrierFeedAvailable, inboundDeliveries } from "../lib/inventory";

export async function deliveriesLoader() {
  if (!(await carrierFeedAvailable())) {
    throw data("Carrier tracking is temporarily unavailable", { status: 503 });
  }
  return { deliveries: inboundDeliveries() };
}

export function Deliveries() {
  const { deliveries } = useLoaderData<typeof deliveriesLoader>();
  return (
    <main>
      <h1>Inbound deliveries</h1>
      <ul>
        {deliveries.map((delivery) => (
          <li key={delivery.carrier}>{delivery.carrier} — {delivery.eta}</li>
        ))}
      </ul>
    </main>
  );
}
