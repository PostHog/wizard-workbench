import type { Route } from "./+types/api.sync";
import { syncInventoryBatch } from "../lib/inventory.server";

export async function action({ request }: Route.ActionArgs) {
  const { batch } = (await request.json()) as { batch: string };
  void syncInventoryBatch(batch);
  return Response.json({ accepted: batch }, { status: 202 });
}
