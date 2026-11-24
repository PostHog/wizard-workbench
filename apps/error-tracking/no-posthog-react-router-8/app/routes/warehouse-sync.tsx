import type { Route } from "./+types/warehouse-sync";
import { warehouseSyncStatus } from "../lib/inventory.server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Warehouse sync · Shelfwise" }];
}

export async function loader() {
  return { status: await warehouseSyncStatus() };
}

export default function Sync({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>Warehouse sync</h1>
      <p>Last run {loaderData.status.lastRun}, {loaderData.status.pending} batches pending.</p>
    </main>
  );
}
