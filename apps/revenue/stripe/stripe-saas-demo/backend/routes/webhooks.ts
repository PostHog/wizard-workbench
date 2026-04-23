import { Router } from "express";
import express from "express";
import { stripe } from "../stripe";
import { getUser } from "../users";
import { posthog } from "../posthog";

export const webhooksRouter = Router();

webhooksRouter.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        // For local testing without webhook signature verification
        event = JSON.parse(req.body.toString());
        console.warn("⚠️  No STRIPE_WEBHOOK_SECRET set — skipping signature verification");
      }
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      res.status(400).json({ error: `Webhook Error: ${err.message}` });
      return;
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("✅ Checkout session completed:", session.id);
        console.log("   Customer:", session.customer);
        console.log("   Client Reference ID:", session.client_reference_id);

        const distinctId = session.client_reference_id
          ? getUser(session.client_reference_id)?.posthogDistinctId ?? session.client_reference_id
          : session.customer_email ?? session.customer ?? session.id;

        if (session.client_reference_id) {
          const user = getUser(session.client_reference_id);
          if (user) {
            console.log(`   User found: ${user.email} (${user.id})`);
          }
        }

        posthog.capture({
          distinctId,
          event: "checkout_completed",
          properties: {
            checkout_session_id: session.id,
            stripe_customer_id: session.customer,
            amount_total: session.amount_total,
            currency: session.currency,
          },
        });
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object;
        console.log("✅ Subscription created:", subscription.id);

        posthog.capture({
          distinctId: subscription.customer as string,
          event: "subscription_created",
          properties: {
            subscription_id: subscription.id,
            stripe_customer_id: subscription.customer,
            status: subscription.status,
            price_id: subscription.items?.data?.[0]?.price?.id,
          },
        });
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        console.log("✅ Invoice paid:", invoice.id);

        posthog.capture({
          distinctId: invoice.customer as string,
          event: "invoice_paid",
          properties: {
            invoice_id: invoice.id,
            stripe_customer_id: invoice.customer,
            amount_paid: invoice.amount_paid,
            currency: invoice.currency,
            subscription_id: invoice.subscription,
          },
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);
