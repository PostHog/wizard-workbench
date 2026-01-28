# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js Pages Router application. This integration includes:

- **Client-side initialization** via `instrumentation-client.ts` for automatic pageview tracking, session replay, and exception capture
- **Server-side tracking** using `posthog-node` for API route events
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through your domain (reduces ad-blocker interference)
- **User identification** on both client and server sides during login/signup flows
- **Event tracking** across critical business operations including authentication, payments, and team management

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully created a new account | `pages/api/auth/sign-up.ts`, `components/login.tsx` |
| `user_signed_in` | User successfully signed into their account | `pages/api/auth/sign-in.ts`, `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `pages/api/auth/sign-out.ts`, `components/header.tsx` |
| `user_logged_in` | Client-side login event | `components/login.tsx` |
| `user_logged_out` | Client-side logout event | `components/header.tsx` |
| `checkout_started` | User initiated a checkout session | `pages/api/stripe/create-checkout.ts` |
| `checkout_completed` | User completed checkout and subscription is active | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Subscription status changed via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Subscription was cancelled via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `customer_portal_opened` | User accessed the Stripe customer portal | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | Team owner sent an invitation to a new member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removed a member from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account information | `pages/api/account/update.ts` |
| `pricing_plan_selected` | User clicked to select a pricing plan | `pages/pricing.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - PostHog client-side initialization
- `lib/posthog-server.ts` - PostHog server-side client
- `.env` - Environment variables for PostHog

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites
- `pages/api/auth/sign-up.ts` - Added signup tracking and identify
- `pages/api/auth/sign-in.ts` - Added signin tracking and identify
- `pages/api/auth/sign-out.ts` - Added signout tracking
- `pages/api/stripe/create-checkout.ts` - Added checkout started tracking
- `pages/api/stripe/checkout.ts` - Added checkout completed tracking
- `pages/api/stripe/webhook.ts` - Added subscription event tracking
- `pages/api/stripe/customer-portal.ts` - Added customer portal tracking
- `pages/api/team/invite.ts` - Added team invite tracking
- `pages/api/team/remove-member.ts` - Added team member removal tracking
- `pages/api/account/update.ts` - Added account update tracking
- `components/login.tsx` - Added client-side identify and auth events
- `components/header.tsx` - Added logout tracking and reset
- `pages/pricing.tsx` - Added pricing plan selection tracking

## Next steps

### Create Your Dashboard

To monitor your new analytics integration, create a dashboard in PostHog with these recommended insights:

1. **Signup Funnel**: `pricing_plan_selected` -> `user_signed_up` -> `checkout_completed`
2. **Daily Active Users**: Unique users by `user_signed_in` events
3. **Subscription Events**: Track `subscription_updated` and `subscription_cancelled`
4. **Team Growth**: Monitor `team_member_invited` events over time
5. **Checkout Conversion**: `checkout_started` to `checkout_completed` funnel

### Environment Variables

Ensure these environment variables are set in your production environment:

```
NEXT_PUBLIC_POSTHOG_KEY=<your-posthog-api-key>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
