import posthog from "./posthog.client";

export const posthogLogger = {
  productAddedToCart({
    productId,
    category,
    quantity,
    unitPrice,
  }: {
    productId: number;
    category: string;
    quantity: number;
    unitPrice: number;
  }) {
    posthog?.logger.info("product added to cart", {
      product_id: productId,
      category,
      quantity,
      unit_price: unitPrice,
    });
  },

  orderCompleted({
    itemCount,
    orderTotal,
  }: {
    itemCount: number;
    orderTotal: number;
  }) {
    posthog?.logger.info("order completed", {
      item_count: itemCount,
      order_total: orderTotal,
    });
  },
};
