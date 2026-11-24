import { useLoaderData } from "react-router";

import { warehouseSyncStatus } from "../lib/inventory";

export async function warehouseSyncLoader() {
  return { status: await warehouseSyncStatus() };
}

export function WarehouseSync() {
  const { status } = useLoaderData<typeof warehouseSyncLoader>();
  return (
    <main>
      <h1>Warehouse sync</h1>
      <p>Last run {status.lastRun}, {status.pending} batches pending.</p>
    </main>
  );
}
