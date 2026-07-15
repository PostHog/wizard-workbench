import { Router } from "express";
import { stripe } from "../stripe";
import { getUser } from "../users";
import { posthog } from "../posthog";

export const subscriptionsRouter = Router();

// POST /api/subscriptions — create a subscription for an existing customer
subscriptionsRouter.post("/", async (req, res) => {
  try {
    const { customerId, priceId, userId } = req.body;

    if (!customerId || !priceId) {
      res.status(400).json({ error: "customerId and priceId are required" });
      return;
    }

    if (userId) {
      const user = getUser(userId);
      if (user) {
        console.log(`Creating subscription for user ${user.email} (${user.id})`);
      }
    }

    const posthogDistinctId = userId ? getUser(userId)?.posthogDistinctId : undefined;

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      ...(posthogDistinctId && { metadata: { posthog_person_distinct_id: posthogDistinctId } }),
    });

    const invoice = subscription.latest_invoice as any;
    const paymentIntent = invoice?.payment_intent as any;

    res.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret,
      status: subscription.status,
    });
  } catch (err: any) {
    console.error("Error creating subscription:", err.message);
    const { customerId, priceId, userId } = req.body;
    const distinctId = userId || customerId || "anonymous";
    posthog.capture({
      distinctId,
      event: "subscription_setup_failed",
      properties: { stripe_customer_id: customerId, price_id: priceId, error_message: err.message },
    });
    res.status(500).json({ error: err.message });
  }
});
