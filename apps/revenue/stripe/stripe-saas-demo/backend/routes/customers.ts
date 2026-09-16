import { Router } from "express";
import { stripe } from "../stripe";
import { createUser, getUserByEmail, updateUser } from "../users";
import { posthog } from "../posthog";

export const customersRouter = Router();

// POST /api/customers — create a Stripe customer and local user
customersRouter.post("/", async (req, res) => {
  try {
    const { email, name, posthogDistinctId } = req.body;

    if (!email || !name) {
      res.status(400).json({ error: "email and name are required" });
      return;
    }

    const existing = getUserByEmail(email);
    if (existing?.stripeCustomerId) {
      res.json({ user: existing, customerId: existing.stripeCustomerId });
      return;
    }

    const customer = await stripe.customers.create({
      email,
      name,
      ...(posthogDistinctId && {
        metadata: { posthog_person_distinct_id: posthogDistinctId },
      }),
    });

    const user = existing
      ? updateUser(existing.id, { stripeCustomerId: customer.id, posthogDistinctId })!
      : createUser(email, name, posthogDistinctId);

    if (!existing) {
      updateUser(user.id, { stripeCustomerId: customer.id });

      if (posthogDistinctId) {
        posthog?.identify({ distinctId: posthogDistinctId, properties: { email, name } });
        posthog?.capture({
          distinctId: posthogDistinctId,
          event: "user_created",
          properties: { stripe_customer_id: customer.id },
        });
      }
    }

    res.json({ user, customerId: customer.id });
  } catch (err: any) {
    console.error("Error creating customer:", err.message);
    res.status(500).json({ error: err.message });
  }
});
