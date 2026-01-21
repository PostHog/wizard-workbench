# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router SaaS application. This integration includes:

- **Client-side initialization** via `instrumentation-client.ts` for automatic pageview tracking, session replay, and exception capture
- **Server-side tracking** via `posthog-node` for critical business events like authentication, payments, and team management
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability and avoid ad blockers
- **User identification** on both client and server sides to maintain correlation across sessions and platforms

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `sign_up` | User creates a new account | `app/(login)/actions.ts` |
| `sign_in` | User logs into their account | `app/(login)/actions.ts` |
| `sign_out` | User logs out of their account | `app/(login)/actions.ts` |
| `password_updated` | User successfully updates their password | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account (churn event) | `app/(login)/actions.ts` |
| `account_updated` | User updates their account information | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invites a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removes a team member | `app/(login)/actions.ts` |
| `checkout_started` | User initiates a checkout session | `lib/payments/actions.ts` |
| `checkout_completed` | User completes checkout (server-side) | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription status changes via webhook | `app/api/stripe/webhook/route.ts` |
| `pricing_plan_selected` | User clicks Get Started on pricing | `app/(dashboard)/pricing/submit-button.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client singleton
- `.env` - Environment variables for PostHog

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `app/(login)/actions.ts` - Added server-side tracking for auth and team events
- `app/(login)/login.tsx` - Added client-side user identification
- `lib/payments/actions.ts` - Added checkout_started tracking
- `app/api/stripe/checkout/route.ts` - Added checkout_completed tracking
- `app/api/stripe/webhook/route.ts` - Added subscription_updated tracking
- `app/(dashboard)/pricing/submit-button.tsx` - Added pricing_plan_selected tracking
- `.env.example` - Added PostHog environment variable examples

## Next steps

To make the most of your PostHog integration:

1. **View your data**: Visit [PostHog Dashboard](https://us.posthog.com) to see incoming events
2. **Create funnels**: Build conversion funnels to track user journeys (e.g., sign_up -> checkout_started -> checkout_completed)
3. **Set up cohorts**: Create user cohorts based on behavior (e.g., users who completed checkout)
4. **Enable session replay**: Watch how users interact with your app
5. **Configure alerts**: Set up alerts for critical events like account_deleted (churn)

### Recommended Insights to Create

1. **Sign Up to Checkout Conversion Funnel**: Track `sign_up` -> `checkout_started` -> `checkout_completed`
2. **User Retention**: Compare `sign_in` events over time
3. **Churn Tracking**: Monitor `account_deleted` events and their properties
4. **Team Growth**: Track `team_member_invited` events
5. **Subscription Health**: Monitor `subscription_updated` events with status changes

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

The following environment variables have been configured:

```
NEXT_PUBLIC_POSTHOG_KEY=phc_sBGFIjin7AfcLwLJ4yc79wY84KHkvrTw5SnUeKD0SWE
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

These are stored in `.env` and use the `NEXT_PUBLIC_` prefix to make them available on both client and server sides in Next.js.
