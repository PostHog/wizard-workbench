import { data } from "react-router";

import type { Route } from "./+types/api.label";
import { getProduct, renderLabel } from "../lib/inventory.server";

export function loader({ params }: Route.LoaderArgs) {
  const product = getProduct(params.sku);
  if (!product) {
    throw data("Product not found", { status: 404 });
  }
  return new Response(renderLabel(product), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
