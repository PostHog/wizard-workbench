import type { PostHog } from "posthog-js";

type CheckoutLogAttributes = {
  cartValue: number;
  itemCount: number;
  uniqueProductCount: number;
};

export const checkoutLogger = {
  processingStarted(
    client: PostHog | undefined,
    { cartValue, itemCount, uniqueProductCount }: CheckoutLogAttributes
  ) {
    client?.logger.info("checkout processing started", {
      cart_value: cartValue,
      item_count: itemCount,
      unique_product_count: uniqueProductCount,
    });
  },

  completed(
    client: PostHog | undefined,
    { cartValue, itemCount, uniqueProductCount }: CheckoutLogAttributes
  ) {
    client?.logger.info("checkout completed", {
      cart_value: cartValue,
      order_total: cartValue * 1.1,
      item_count: itemCount,
      unique_product_count: uniqueProductCount,
    });
  },
};
