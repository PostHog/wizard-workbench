# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15+ approach
- **Server-side tracking** via `posthog-node` for API routes with proper user identification
- **Reverse proxy configuration** in `next.config.ts` to route analytics through `/ingest` for better ad-blocker resilience
- **Environment variables** configured in `.env` for secure API key management
- **User identification** on both client and server side for consistent user tracking across sessions
- **Error tracking** enabled with `capture_exceptions: true` for automatic error capture

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully creates a new account | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | User successfully signs in to their account | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | User signs out of their account | `pages/api/auth/sign-out.ts` |
| `user_logged_in` | Client-side login event | `components/login.tsx` |
| `user_logged_out` | Client-side logout event | `components/header.tsx` |
| `checkout_started` | User initiates a checkout session to subscribe | `pages/api/stripe/create-checkout.ts` |
| `subscription_completed` | User successfully completes checkout and subscribes | `pages/api/stripe/checkout.ts` |
| `subscription_changed` | Subscription updated or canceled via webhook | `pages/api/stripe/webhook.ts` |
| `customer_portal_opened` | User opens Stripe customer portal | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | User invites a new member to their team | `pages/api/team/invite.ts` |
| `team_member_removed` | User removes a member from their team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updates their account information | `pages/api/account/update.ts` |
| `pricing_viewed` | User views the pricing page (conversion funnel top) | `pages/pricing.tsx` |
| `invitation_accepted` | User accepts a team invitation during signup | `pages/api/auth/sign-up.ts` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client singleton
- `.env` - Environment variables for PostHog configuration

### Modified Files
- `next.config.ts` - Added PostHog reverse proxy rewrites
- `components/login.tsx` - Added client-side identify and capture
- `components/header.tsx` - Added logout tracking with posthog.reset()
- `pages/api/auth/sign-in.ts` - Server-side signin tracking
- `pages/api/auth/sign-up.ts` - Server-side signup tracking
- `pages/api/auth/sign-out.ts` - Server-side signout tracking
- `pages/api/stripe/create-checkout.ts` - Checkout initiation tracking
- `pages/api/stripe/checkout.ts` - Subscription completion tracking
- `pages/api/stripe/webhook.ts` - Subscription change tracking
- `pages/api/stripe/customer-portal.ts` - Portal access tracking
- `pages/api/team/invite.ts` - Team invitation tracking
- `pages/api/team/remove-member.ts` - Team member removal tracking
- `pages/api/account/update.ts` - Account update tracking
- `pages/pricing.tsx` - Pricing page view tracking

## Next Steps

We recommend creating the following insights and dashboard in PostHog to monitor user behavior:

### Recommended Dashboard: "Analytics Basics"

Create these insights in your PostHog dashboard:

1. **Signup to Subscription Funnel**
   - Type: Funnel
   - Steps: `pricing_viewed` → `checkout_started` → `subscription_completed`
   - Purpose: Track conversion from pricing page to paid subscription

2. **User Authentication Overview**
   - Type: Trends
   - Events: `user_signed_up`, `user_signed_in`, `user_signed_out`
   - Purpose: Monitor daily authentication activity

3. **Team Collaboration Activity**
   - Type: Trends
   - Events: `team_member_invited`, `team_member_removed`, `invitation_accepted`
   - Purpose: Track team growth and collaboration patterns

4. **Subscription Health**
   - Type: Trends
   - Events: `subscription_completed`, `subscription_changed`, `customer_portal_opened`
   - Breakdown by: `subscriptionStatus` property
   - Purpose: Monitor subscription lifecycle and potential churn signals

5. **User Retention**
   - Type: Retention
   - Starting event: `user_signed_up`
   - Returning event: `user_signed_in`
   - Purpose: Measure how well you retain new users

### To Create Your Dashboard

1. Go to your PostHog project: https://us.i.posthog.com
2. Navigate to Dashboards → New Dashboard
3. Name it "Analytics Basics"
4. Add the insights described above using your new events

## Configuration Reference

```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

The reverse proxy is configured to route through `/ingest` to avoid ad-blockers.
