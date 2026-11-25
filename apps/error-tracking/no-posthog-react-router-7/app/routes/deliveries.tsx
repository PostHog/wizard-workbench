import { data } from "react-router";

import type { Route } from "./+types/deliveries";
import { carrierFeedAvailable, inboundDeliveries } from "../lib/inventory.server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Deliveries · Shelfwise" }];
}

export function loader() {
  if (!carrierFeedAvailable()) {
    throw data("Carrier tracking is temporarily unavailable", { status: 503 });
  }
  return { deliveries: inboundDeliveries() };
}

export default function Deliveries({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>Inbound deliveries</h1>
      <ul>
        {loaderData.deliveries.map((delivery) => (
          <li key={delivery.carrier}>{delivery.carrier} — {delivery.eta}</li>
        ))}
      </ul>
    </main>
  );
}
