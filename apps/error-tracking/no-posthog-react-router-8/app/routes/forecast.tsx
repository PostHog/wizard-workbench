import { Suspense } from "react";
import { Await } from "react-router";

import type { Route } from "./+types/forecast";
import { forecastDemand } from "../lib/inventory.server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Demand forecast · Shelfwise" }];
}

export function loader({ request }: Route.LoaderArgs) {
  const region = new URL(request.url).searchParams.get("region") ?? "eu-1";
  return { region, forecast: forecastDemand(region) };
}

export default function Forecast({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>Demand forecast — {loaderData.region}</h1>
      <Suspense fallback={<p>Calculating forecast…</p>}>
        <Await resolve={loaderData.forecast}>
          {(rows) => (
            <table>
              <thead>
                <tr><th>Week</th><th>Units</th></tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.week}><td>{row.week}</td><td>{row.units}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </Await>
      </Suspense>
    </main>
  );
}
