# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js Pages Router application. This integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15.3+ approach
- **Server-side tracking** using `posthog-node` for API routes
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability
- **User identification** on both client and server sides during authentication
- **Exception tracking** with `captureException` for error handling
- **Event tracking** for key business actions including authentication, payments, and team management

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully creates a new account | `pages/api/auth/sign-up.ts`, `components/login.tsx` |
| `user_signed_in` | User successfully signs in to their account | `pages/api/auth/sign-in.ts`, `components/login.tsx` |
| `user_signed_out` | User signs out of their account | `pages/api/auth/sign-out.ts` |
| `checkout_started` | User initiates a checkout session for a subscription plan | `pages/api/stripe/create-checkout.ts` |
| `checkout_completed` | User successfully completes the checkout process | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Stripe webhook: subscription was updated | `pages/api/stripe/webhook.ts` |
| `subscription_canceled` | Stripe webhook: subscription was canceled/deleted | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | User invites a new member to their team | `pages/api/team/invite.ts` |
| `team_member_removed` | User removes a member from their team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updates their account information | `pages/api/account/update.ts` |
| `pricing_plan_selected` | User clicks to select a pricing plan from the pricing page | `pages/pricing.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client helper
- `.env` - Environment variables for PostHog configuration

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `components/login.tsx` - Added client-side identify and event capture
- `pages/pricing.tsx` - Added pricing plan selection tracking
- `pages/api/auth/sign-in.ts` - Added server-side sign-in event and identify
- `pages/api/auth/sign-up.ts` - Added server-side sign-up event and identify
- `pages/api/auth/sign-out.ts` - Added server-side sign-out event
- `pages/api/stripe/create-checkout.ts` - Added checkout started event
- `pages/api/stripe/checkout.ts` - Added checkout completed event
- `pages/api/stripe/webhook.ts` - Added subscription update/cancel events
- `pages/api/team/invite.ts` - Added team member invited event
- `pages/api/team/remove-member.ts` - Added team member removed event
- `pages/api/account/update.ts` - Added account updated event

## Next steps

We recommend creating the following insights in your PostHog dashboard to monitor user behavior:

1. **Sign-up to Checkout Funnel** - Track conversion from `user_signed_up` → `pricing_plan_selected` → `checkout_started` → `checkout_completed`
2. **Churn Analysis** - Monitor `subscription_canceled` events and correlate with user activity
3. **Team Growth** - Track `team_member_invited` events to measure viral growth
4. **Authentication Activity** - Monitor `user_signed_in` and `user_signed_out` patterns
5. **Account Engagement** - Track `account_updated` events as engagement signals

### Environment Variables

Make sure to set the following environment variables in your deployment:

```
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
