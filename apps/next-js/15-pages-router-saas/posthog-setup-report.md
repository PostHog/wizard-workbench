# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` for automatic page view tracking, session replay, and error tracking
- **Server-side tracking** via `lib/posthog-server.ts` for API route event capture
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through your domain
- **User identification** on both client and server sides for comprehensive user journey tracking
- **Error tracking** with `captureException` in all API error handlers

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully created a new account | `pages/api/auth/sign-up.ts`, `components/login.tsx` |
| `user_signed_in` | User successfully logged into their account | `pages/api/auth/sign-in.ts`, `components/login.tsx` |
| `user_signed_out` | User logged out of their account | `pages/api/auth/sign-out.ts`, `components/header.tsx` |
| `checkout_started` | User initiated checkout process for a subscription plan | `pages/api/stripe/create-checkout.ts` |
| `checkout_completed` | User successfully completed checkout and subscription was created | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | User's subscription was updated or modified | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | User's subscription was cancelled | `pages/api/stripe/webhook.ts` |
| `customer_portal_opened` | User opened Stripe customer portal to manage subscription | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | User sent an invitation to add a new team member | `pages/api/team/invite.ts` |
| `team_member_removed` | User removed a member from their team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account information (name or email) | `pages/api/account/update.ts` |
| `pricing_page_viewed` | User viewed the pricing page (top of conversion funnel) | `pages/pricing.tsx` |

## Files Created

| File | Purpose |
|------|---------|
| `instrumentation-client.ts` | Client-side PostHog initialization with error tracking and session replay |
| `lib/posthog-server.ts` | Server-side PostHog client for API routes |
| `.env` | Environment variables for PostHog API key and host |

## Files Modified

| File | Changes |
|------|---------|
| `next.config.ts` | Added PostHog reverse proxy rewrites and `skipTrailingSlashRedirect` |
| `pages/api/auth/sign-up.ts` | Added `user_signed_up` event and user identification |
| `pages/api/auth/sign-in.ts` | Added `user_signed_in` event and user identification |
| `pages/api/auth/sign-out.ts` | Added `user_signed_out` event |
| `pages/api/stripe/create-checkout.ts` | Added `checkout_started` event |
| `pages/api/stripe/checkout.ts` | Added `checkout_completed` event |
| `pages/api/stripe/webhook.ts` | Added `subscription_updated` and `subscription_cancelled` events |
| `pages/api/stripe/customer-portal.ts` | Added `customer_portal_opened` event |
| `pages/api/team/invite.ts` | Added `team_member_invited` event |
| `pages/api/team/remove-member.ts` | Added `team_member_removed` event |
| `pages/api/account/update.ts` | Added `account_updated` event with user property updates |
| `pages/pricing.tsx` | Added `pricing_page_viewed` event on page mount |
| `components/login.tsx` | Added client-side user identification and event capture |
| `components/header.tsx` | Added `posthog.reset()` on sign out |

## Next steps

Create insights and a dashboard in PostHog to monitor user behavior based on the events implemented:

### Recommended Insights to Create

1. **Sign-up to Checkout Funnel**: Track conversion from `user_signed_up` → `pricing_page_viewed` → `checkout_started` → `checkout_completed`
2. **User Retention**: Monitor `user_signed_in` events over time to track returning users
3. **Subscription Churn**: Track `subscription_cancelled` events and correlate with user properties
4. **Team Growth**: Monitor `team_member_invited` events to understand team expansion
5. **Account Engagement**: Track `account_updated` and `customer_portal_opened` events

### Dashboard Setup

To create your dashboard, go to PostHog and:
1. Navigate to Dashboards → New Dashboard
2. Name it "SaaS Analytics Basics"
3. Add the recommended insights above using the exact event names from this report

### Agent skill

The PostHog integration follows Next.js 15.3+ best practices using `instrumentation-client.ts` for client-side initialization. This approach should not be combined with other initialization methods like `PostHogProvider` components.

## Environment Variables

The following environment variables have been configured in `.env`:

```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Make sure to add these to your production environment as well.
