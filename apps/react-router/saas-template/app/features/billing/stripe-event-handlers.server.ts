import { PostHog } from "posthog-node";
import type { Stripe } from "stripe";

import { updateOrganizationInDatabaseById } from "../organizations/organizations-model.server";
import { updateStripeCustomer } from "./stripe-helpers.server";
import {
  deleteStripePriceFromDatabaseById,
  saveStripePriceFromAPIToDatabase,
  updateStripePriceFromAPIInDatabase,
} from "./stripe-prices-model.server";
import {
  deleteStripeProductFromDatabaseById,
  saveStripeProductFromAPIToDatabase,
  updateStripeProductFromAPIInDatabase,
} from "./stripe-product-model.server";
import {
  createStripeSubscriptionInDatabase,
  updateStripeSubscriptionFromAPIInDatabase,
} from "./stripe-subscription-model.server";
import {
  saveStripeSubscriptionScheduleFromAPIToDatabase,
  updateStripeSubscriptionScheduleFromAPIInDatabase,
} from "./stripe-subscription-schedule-model.server";
import { stripeAdmin } from "~/features/billing/stripe-admin.server";
import { getErrorMessage } from "~/utils/get-error-message";

// Create PostHog instance for server-side tracking in webhooks
const createPostHogClient = () => {
  // biome-ignore lint/style/noNonNullAssertion: Env vars are validated at startup
  return new PostHog(process.env.VITE_PUBLIC_POSTHOG_KEY!, {
    flushAt: 1,
    flushInterval: 0,
    // biome-ignore lint/style/noNonNullAssertion: Env vars are validated at startup
    host: process.env.VITE_PUBLIC_POSTHOG_HOST!,
  });
};

const ok = () => Response.json({ message: "OK" });

const prettyPrint = (event: Stripe.Event) => {
  console.log(
    `unhandled Stripe event: ${event.type}`,
    process.env.NODE_ENV === "development"
      ? JSON.stringify(event, null, 2)
      : "event not logged in production mode - look it up in the Stripe Dashboard",
  );
};

export const handleStripeChargeDisputeClosedEvent = async (
  event: Stripe.ChargeDisputeClosedEvent,
) => {
  const dispute = event.data.object;

  // only cancel if the dispute was lost (cardholder won)
  if (dispute.status !== "lost") {
    return ok();
  }

  try {
    // normalize dispute.charge → string ID
    const chargeId =
      typeof dispute.charge === "string" ? dispute.charge : dispute.charge.id;

    // fetch the Charge
    const charge = await stripeAdmin.charges.retrieve(chargeId);

    // extract customer ID
    const customerId =
      typeof charge.customer === "string"
        ? charge.customer
        : charge.customer?.id;
    if (!customerId) {
      console.log("No customer associated with charge", charge.id);
      return ok();
    }

    // list active subscriptions for that customer
    const subsList = await stripeAdmin.subscriptions.list({
      customer: customerId,
      limit: 1, // just need one
      status: "active",
    });

    if (subsList.data.length === 0) {
      console.log(`No active subscriptions for customer ${customerId}`);
      return ok();
    }

    // cancel the first one (or adjust logic if you need something more nuanced)
    const cancelled = await stripeAdmin.subscriptions.cancel(
      // biome-ignore lint/style/noNonNullAssertion: The check above ensures that there is a subscription
      subsList.data[0]!.id,
    );

    console.log(
      "Automatically cancelled subscription due to lost dispute:",
      cancelled.id,
    );
  } catch (error) {
    prettyPrint(event);
    console.error(
      "Error cancelling subscription on dispute.closed",
      getErrorMessage(error),
    );
  }

  return ok();
};

export const handleStripeCheckoutSessionCompletedEvent = async (
  event: Stripe.CheckoutSessionCompletedEvent,
) => {
  const posthog = createPostHogClient();

  try {
    if (event.data.object.metadata?.organizationId) {
      const organization = await updateOrganizationInDatabaseById({
        id: event.data.object.metadata.organizationId,
        organization: {
          ...(event.data.object.customer_details?.email && {
            billingEmail: event.data.object.customer_details.email,
          }),
          ...(typeof event.data.object.customer === "string" && {
            stripeCustomerId: event.data.object.customer,
          }),
          // End the trial now.
          trialEnd: new Date(),
        },
      });

      if (typeof event.data.object.customer === "string") {
        await updateStripeCustomer({
          customerId: event.data.object.customer,
          customerName: organization.name,
          organizationId: organization.id,
        });
      }

      // Track checkout completion event
      posthog.capture({
        distinctId: event.data.object.metadata.organizationId,
        event: "checkout_completed",
        properties: {
          amount_total: event.data.object.amount_total,
          currency: event.data.object.currency,
          customer_email: event.data.object.customer_details?.email,
          organization_id: organization.id,
          organization_name: organization.name,
        },
      });
    } else {
      console.error("No organization ID found in checkout session metadata");
      prettyPrint(event);
    }
  } catch (error) {
    const message = getErrorMessage(error);
    prettyPrint(event);
    console.error(
      "Error handling Stripe checkout session completed event",
      message,
    );
  }

  await posthog.shutdown().catch(() => {});
  return ok();
};

export const handleStripeCustomerDeletedEvent = async (
  event: Stripe.CustomerDeletedEvent,
) => {
  try {
    if (event.data.object.metadata?.organizationId) {
      await updateOrganizationInDatabaseById({
        id: event.data.object.metadata.organizationId,
        organization: { stripeCustomerId: null },
      });
    } else {
      prettyPrint(event);
    }
  } catch (error) {
    const message = getErrorMessage(error);
    prettyPrint(event);
    console.error("Error handling Stripe customer deleted event", message);
  }

  return ok();
};

export const handleStripeCustomerSubscriptionCreatedEvent = async (
  event: Stripe.CustomerSubscriptionCreatedEvent,
) => {
  const posthog = createPostHogClient();

  try {
    await createStripeSubscriptionInDatabase(event.data.object);

    // Track subscription creation event
    const customerId =
      typeof event.data.object.customer === "string"
        ? event.data.object.customer
        : event.data.object.customer?.id;
    posthog.capture({
      distinctId: customerId || "unknown",
      event: "subscription_created",
      properties: {
        currency: event.data.object.currency,
        status: event.data.object.status,
        subscription_id: event.data.object.id,
      },
    });
  } catch (error) {
    const message = getErrorMessage(error);
    prettyPrint(event);
    console.error("Error creating Stripe subscription", message);
  }

  await posthog.shutdown().catch(() => {});
  return ok();
};

export const handleStripeCustomerSubscriptionDeletedEvent = async (
  event: Stripe.CustomerSubscriptionDeletedEvent,
) => {
  const posthog = createPostHogClient();

  try {
    await updateStripeSubscriptionFromAPIInDatabase(event.data.object);

    // Track subscription cancellation event (churn)
    const customerId =
      typeof event.data.object.customer === "string"
        ? event.data.object.customer
        : event.data.object.customer?.id;
    posthog.capture({
      distinctId: customerId || "unknown",
      event: "subscription_cancelled",
      properties: {
        cancellation_reason: event.data.object.cancellation_details?.reason,
        subscription_id: event.data.object.id,
      },
    });
  } catch (error) {
    const message = getErrorMessage(error);
    prettyPrint(event);
    console.error("Error updating deleted Stripe subscription", message);
  }

  await posthog.shutdown().catch(() => {});
  return ok();
};

export const handleStripeCustomerSubscriptionUpdatedEvent = async (
  event: Stripe.CustomerSubscriptionUpdatedEvent,
) => {
  const posthog = createPostHogClient();

  try {
    await updateStripeSubscriptionFromAPIInDatabase(event.data.object);

    // Track subscription update event
    const customerId =
      typeof event.data.object.customer === "string"
        ? event.data.object.customer
        : event.data.object.customer?.id;
    posthog.capture({
      distinctId: customerId || "unknown",
      event: "subscription_updated",
      properties: {
        status: event.data.object.status,
        subscription_id: event.data.object.id,
      },
    });
  } catch (error) {
    const message = getErrorMessage(error);
    prettyPrint(event);
    console.error("Error updating Stripe subscription", message);
  }

  await posthog.shutdown().catch(() => {});
  return ok();
};

export const handleStripePriceCreatedEvent = async (
  event: Stripe.PriceCreatedEvent,
) => {
  try {
    await saveStripePriceFromAPIToDatabase(event.data.object);
  } catch (error) {
    const message = getErrorMessage(error);
    prettyPrint(event);
    console.error("Error creating Stripe price", message);
  }

  return ok();
};

export const handleStripePriceDeletedEvent = async (
  event: Stripe.PriceDeletedEvent,
) => {
  try {
    await deleteStripePriceFromDatabaseById(event.data.object.id);
  } catch (error) {
    const message = getErrorMessage(error);
    prettyPrint(event);
    console.error("Error deleting Stripe price", message);
  }

  return ok();
};

export const handleStripePriceUpdatedEvent = async (
  event: Stripe.PriceUpdatedEvent,
) => {
  try {
    await updateStripePriceFromAPIInDatabase(event.data.object);
  } catch (error) {
    const message = getErrorMessage(error);
    prettyPrint(event);
    console.error("Error updating Stripe price", message);
  }

  return ok();
};

export const handleStripeProductCreatedEvent = async (
  event: Stripe.ProductCreatedEvent,
) => {
  try {
    await saveStripeProductFromAPIToDatabase(event.data.object);
  } catch (error) {
    const message = getErrorMessage(error);
    prettyPrint(event);
    console.error("Error creating Stripe product", message);
  }

  return ok();
};

export const handleStripeProductDeletedEvent = async (
  event: Stripe.ProductDeletedEvent,
) => {
  try {
    await deleteStripeProductFromDatabaseById(event.data.object.id);
  } catch (error) {
    const message = getErrorMessage(error);
    prettyPrint(event);
    console.error("Error deleting Stripe product", message);
  }

  return ok();
};

export const handleStripeProductUpdatedEvent = async (
  event: Stripe.ProductUpdatedEvent,
) => {
  try {
    await updateStripeProductFromAPIInDatabase(event.data.object);
  } catch (error) {
    const message = getErrorMessage(error);
    prettyPrint(event);
    console.error("Error updating Stripe product", message);
  }

  return ok();
};

export const handleStripeSubscriptionScheduleCreatedEvent = async (
  event: Stripe.SubscriptionScheduleCreatedEvent,
) => {
  try {
    await saveStripeSubscriptionScheduleFromAPIToDatabase(event.data.object);
  } catch (error) {
    const message = getErrorMessage(error);
    prettyPrint(event);
    console.error("Error creating Stripe subscription schedule", message);
  }

  return ok();
};

export const handleStripeSubscriptionScheduleExpiringEvent = async (
  event: Stripe.SubscriptionScheduleExpiringEvent,
) => {
  try {
    await updateStripeSubscriptionScheduleFromAPIInDatabase(event.data.object);
  } catch (error) {
    const message = getErrorMessage(error);
    prettyPrint(event);
    console.error("Error updating Stripe subscription schedule", message);
  }

  return ok();
};

export const handleStripeSubscriptionScheduleUpdatedEvent = async (
  event: Stripe.SubscriptionScheduleUpdatedEvent,
) => {
  try {
    await updateStripeSubscriptionScheduleFromAPIInDatabase(event.data.object);
  } catch (error) {
    const message = getErrorMessage(error);
    prettyPrint(event);
    console.error("Error updating Stripe subscription schedule", message);
  }

  return ok();
};
