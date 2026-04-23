import type { Tier } from "~/features/billing/billing-constants";
import { prisma } from "~/utils/database.server";

/**
 * Get the maximum number of pastes allowed for a subscription tier
 */
export function getPasteLimitForTier(tier: Tier | null): number {
  switch (tier) {
    case "high":
      return Infinity; // Unlimited for business plan
    case "mid":
      return 500; // Startup plan: 500 pastes
    case "low":
      return 50; // Hobby plan: 50 pastes
    default:
      return 5; // Free tier: 5 pastes
  }
}

/**
 * Check if an organization can create more pastes based on their subscription
 */
export async function canCreatePaste(organizationId: string): Promise<{
  canCreate: boolean;
  currentCount: number;
  limit: number;
  tier: Tier | null;
}> {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      stripeSubscriptions: {
        where: {
          status: "active",
        },
        include: {
          items: {
            include: {
              price: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          pastes: true,
        },
      },
    },
  });

  if (!organization) {
    throw new Error("Organization not found");
  }

  // Determine tier from subscription
  let tier: Tier | null = null;
  const subscription = organization.stripeSubscriptions[0];
  
  if (subscription) {
    const price = subscription.items[0]?.price;
    if (price) {
      const lookupKey = price.lookupKey;
      if (lookupKey.includes("business") || lookupKey.includes("high")) {
        tier = "high";
      } else if (lookupKey.includes("startup") || lookupKey.includes("mid")) {
        tier = "mid";
      } else if (lookupKey.includes("hobby") || lookupKey.includes("low")) {
        tier = "low";
      }
    }
  }

  const limit = getPasteLimitForTier(tier);
  const currentCount = organization._count.pastes;
  const canCreate = limit === Infinity || currentCount < limit;

  return {
    canCreate,
    currentCount,
    limit,
    tier,
  };
}

