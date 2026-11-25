import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import type { Route } from "./+types/suppliers";
import { SupplierMap } from "../components/supplier-map";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Suppliers · Shelfwise" }];
}

const suppliers = [
  { name: "Harbor Hardware", zone: "south" },
  { name: "Lumen Fittings", zone: "north" },
  { name: "Northwind Timber", zone: "far-north" },
];

export default function Suppliers() {
  const [searchParams] = useSearchParams();
  const [mapReady, setMapReady] = useState(false);
  useEffect(() => setMapReady(true), []);
  const view = searchParams.get("view") ?? "list";

  return (
    <main>
      <h1>Suppliers</h1>
      <ul>
        {suppliers.map((supplier) => (
          <li key={supplier.name}>{supplier.name}</li>
        ))}
      </ul>
      {view === "map" && mapReady && (
        <section>
          <h2>Delivery zones</h2>
          {suppliers.map((supplier) => (
            <SupplierMap key={supplier.name} zone={supplier.zone} />
          ))}
        </section>
      )}
    </main>
  );
}

export function ErrorBoundary() {
  return (
    <main>
      <h1>Suppliers</h1>
      <p className="error">The supplier map could not be shown.</p>
    </main>
  );
}
