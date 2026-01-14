# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router SaaS application. The integration includes:

- **Client-side tracking** via `instrumentation-client.ts` using `posthog-js`
- **Server-side tracking** via `lib/posthog-server.ts` using `posthog-node`
- **Reverse proxy setup** in `next.config.ts` to route PostHog requests through your domain
- **User identification** on both client and server sides during authentication
- **Error tracking** with `captureException` for client-side errors
- **Session management** with `posthog.reset()` on sign-out

## Environment Variables

The following environment variables have been configured in `.env`:

```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully completed the sign-up process and created an account | `pages/api/auth/sign-up.ts`, `components/login.tsx` |
| `user_signed_in` | User successfully signed into their account | `pages/api/auth/sign-in.ts`, `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `checkout_initiated` | User initiated a Stripe checkout session to subscribe to a plan | `pages/api/stripe/create-checkout.ts` |
| `checkout_completed` | User successfully completed a Stripe checkout and subscription was created | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | User's subscription was updated via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | User's subscription was cancelled via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `customer_portal_opened` | User opened the Stripe customer portal to manage their subscription | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | Team owner invited a new member to join the team | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removed a member from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account information (name/email) | `pages/api/account/update.ts` |
| `pricing_page_viewed` | User viewed the pricing page (top of conversion funnel) | `pages/pricing.tsx` |

## Files Modified

- `instrumentation-client.ts` (created) - Client-side PostHog initialization
- `lib/posthog-server.ts` (created) - Server-side PostHog client
- `next.config.ts` - Added rewrites for PostHog reverse proxy
- `.env` (created) - Environment variables for PostHog
- `pages/api/auth/sign-up.ts` - Added sign-up event tracking
- `pages/api/auth/sign-in.ts` - Added sign-in event tracking
- `pages/api/stripe/create-checkout.ts` - Added checkout initiated tracking
- `pages/api/stripe/checkout.ts` - Added checkout completed tracking
- `pages/api/stripe/webhook.ts` - Added subscription update/cancel tracking
- `pages/api/stripe/customer-portal.ts` - Added customer portal tracking
- `pages/api/team/invite.ts` - Added team invite tracking
- `pages/api/team/remove-member.ts` - Added team member removal tracking
- `pages/api/account/update.ts` - Added account update tracking
- `components/login.tsx` - Added client-side auth tracking and user identification
- `components/header.tsx` - Added sign-out tracking with posthog.reset()
- `pages/pricing.tsx` - Added pricing page view tracking

## Next steps

We recommend creating the following insights and a dashboard in PostHog to monitor user behavior:

### Recommended Insights

1. **Sign-up to Checkout Funnel**
   - Events: `pricing_page_viewed` → `user_signed_up` → `checkout_initiated` → `checkout_completed`
   - Type: Funnel
   - Purpose: Track conversion from pricing page to paid subscription

2. **User Authentication Overview**
   - Events: `user_signed_up`, `user_signed_in`, `user_signed_out`
   - Type: Trends
   - Purpose: Monitor daily/weekly authentication activity

3. **Subscription Churn Analysis**
   - Events: `subscription_cancelled`
   - Type: Trends
   - Purpose: Track subscription cancellations over time

4. **Team Collaboration Activity**
   - Events: `team_member_invited`, `team_member_removed`
   - Type: Trends
   - Purpose: Monitor team growth and collaboration patterns

5. **Account Engagement**
   - Events: `account_updated`, `customer_portal_opened`
   - Type: Trends
   - Purpose: Track user engagement with account settings

### Create Your Dashboard

Visit your PostHog dashboard to create these insights:
- PostHog Dashboard: https://us.posthog.com

### Key Metrics to Monitor

- **Conversion Rate**: `checkout_completed` / `pricing_page_viewed`
- **Activation Rate**: `checkout_initiated` / `user_signed_up`
- **Churn Rate**: `subscription_cancelled` / total active subscriptions
- **Team Growth**: `team_member_invited` - `team_member_removed`

## Integration Details

The integration uses the recommended approach for Next.js 15.3+:
- Client-side initialization via `instrumentation-client.ts`
- Server-side tracking via singleton PostHog client
- Reverse proxy through Next.js rewrites to avoid ad blockers
- User identification on both client and server for correlated analytics
