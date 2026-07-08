import { Router } from "express";
import { stripe } from "../stripe";
import { getUser } from "../users";
import { posthog } from "../posthog";

export const checkoutRouter = Router();

// POST /api/checkout — create a Stripe Checkout session
checkoutRouter.post("/", async (req, res) => {
  try {
    const { priceId, userId, customerEmail } = req.body;

    if (!priceId) {
      res.status(400).json({ error: "priceId is required" });
      return;
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const user = userId ? getUser(userId) : undefined;
    const posthogDistinctId = user?.posthogDistinctId || customerEmail;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${frontendUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/?canceled=true`,
      client_reference_id: userId,
      customer_email: customerEmail,
      subscription_data: {
        metadata: { posthog_person_distinct_id: posthogDistinctId },
      },
    });

    res.json({ url: session.url });
  } catch (err: any) {
    console.error("Error creating checkout session:", err.message);
    const { priceId, userId, customerEmail } = req.body;
    const distinctId = userId || customerEmail || "anonymous";
    posthog.capture({
      distinctId,
      event: "checkout_session_failed",
      properties: { price_id: priceId, error_message: err.message },
    });
    res.status(500).json({ error: err.message });
  }
});
