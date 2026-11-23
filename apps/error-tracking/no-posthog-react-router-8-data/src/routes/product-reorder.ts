import { data, type ActionFunctionArgs } from "react-router";

import { getProduct, requestReorder } from "../lib/inventory";

export async function reorderAction({ params }: ActionFunctionArgs) {
  const product = await getProduct(params.sku);
  if (!product) {
    throw data("Product not found", { status: 404 });
  }
  return requestReorder(product);
}
