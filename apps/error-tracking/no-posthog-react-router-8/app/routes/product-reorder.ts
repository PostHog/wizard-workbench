import { data } from "react-router";

import type { Route } from "./+types/product-reorder";
import { getProduct, requestReorder } from "../lib/inventory.server";

export function action({ params }: Route.ActionArgs) {
  const product = getProduct(params.sku);
  if (!product) {
    throw data("Product not found", { status: 404 });
  }
  return requestReorder(product);
}
