# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+)
- **Server-side tracking** using `posthog-node` for API route events
- **Reverse proxy** configured in `next.config.ts` to improve tracking reliability
- **User identification** on both client and server for correlated analytics
- **Error tracking** with `captureException` for comprehensive error monitoring
- **Session management** with proper `posthog.reset()` on logout

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User completed the sign-up process successfully | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | User successfully signed in to their account | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | User signed out of their account | `pages/api/auth/sign-out.ts`, `components/header.tsx` |
| `checkout_started` | User initiated the checkout process for a pricing plan | `pages/api/stripe/create-checkout.ts` |
| `checkout_completed` | User completed Stripe checkout successfully | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Stripe subscription was updated via webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe subscription was cancelled via webhook | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | User invited a new team member | `pages/api/team/invite.ts` |
| `team_member_removed` | User removed a team member from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account information | `pages/api/account/update.ts` |
| `pricing_plan_clicked` | User clicked on a pricing plan to start checkout | `pages/pricing.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client singleton

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `.env.local` - Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`
- `pages/api/auth/sign-up.ts` - Added sign-up event tracking
- `pages/api/auth/sign-in.ts` - Added sign-in event tracking
- `pages/api/auth/sign-out.ts` - Added sign-out event tracking
- `pages/api/stripe/create-checkout.ts` - Added checkout started tracking
- `pages/api/stripe/checkout.ts` - Added checkout completed tracking
- `pages/api/stripe/webhook.ts` - Added subscription event tracking
- `pages/api/team/invite.ts` - Added team invite tracking
- `pages/api/team/remove-member.ts` - Added team member removal tracking
- `pages/api/account/update.ts` - Added account update tracking
- `pages/pricing.tsx` - Added pricing plan click tracking
- `components/login.tsx` - Added client-side user identification
- `components/header.tsx` - Added client-side logout tracking and reset

## Next steps

Once your application is deployed and receiving traffic, you can create insights and dashboards in PostHog to monitor:

1. **Sign-up to Checkout Funnel**: Track conversion from `user_signed_up` → `pricing_plan_clicked` → `checkout_started` → `checkout_completed`
2. **Churn Analysis**: Monitor `subscription_cancelled` events and correlate with user behavior
3. **Activation Metrics**: Track user engagement through sign-ins and team activities
4. **Revenue Events**: Analyze checkout completion rates and subscription updates

### Recommended Dashboard Insights

Create these insights in your PostHog dashboard:

1. **User Registration Trend** - Track `user_signed_up` events over time
2. **Checkout Conversion Funnel** - `pricing_plan_clicked` → `checkout_started` → `checkout_completed`
3. **Subscription Churn Rate** - Monitor `subscription_cancelled` events
4. **Team Collaboration** - Track `team_member_invited` events
5. **User Engagement** - Monitor `user_signed_in` frequency

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

Make sure these are set in your production environment:

```
NEXT_PUBLIC_POSTHOG_KEY=<your-posthog-api-key>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Documentation

- [PostHog Next.js Integration Guide](https://posthog.com/docs/libraries/next-js)
- [PostHog JavaScript SDK](https://posthog.com/docs/libraries/js)
- [PostHog Node.js SDK](https://posthog.com/docs/libraries/node)
