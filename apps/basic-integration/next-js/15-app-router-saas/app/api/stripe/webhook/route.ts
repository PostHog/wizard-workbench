import Stripe from "stripe";
import { handleSubscriptionChange, stripe } from "@/lib/payments/stripe";
import { NextRequest, NextResponse } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";
import { getTeamByStripeCustomerId } from "@/lib/db/queries";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { teamMembers } from "@/lib/db/schema";

// Use a dummy webhook secret for stub mode
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_stub_secret";

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed." },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);

      const team = await getTeamByStripeCustomerId(
        subscription.customer as string,
      );
      if (team) {
        const ownerMember = await db
          .select({ userId: teamMembers.userId })
          .from(teamMembers)
          .where(eq(teamMembers.teamId, team.id))
          .limit(1);

        const distinctId =
          ownerMember.length > 0
            ? String(ownerMember[0].userId)
            : `team_${team.id}`;

        const posthog = getPostHogClient();
        posthog.capture({
          distinctId,
          event: "subscription_updated",
          properties: {
            team_id: team.id,
            subscription_id: subscription.id,
            subscription_status: subscription.status,
            event_type: event.type,
          },
        });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
