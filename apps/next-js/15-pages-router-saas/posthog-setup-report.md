# PostHog Post-Wizard Report

The wizard has completed a deep integration of PostHog into your Next.js 15 Pages Router SaaS application. This integration includes:

- **Client-side initialization** via `instrumentation-client.ts` for automatic pageview tracking, session replay, and error capturing
- **Server-side tracking** via `lib/posthog-server.ts` for capturing events from API routes
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through your domain (avoiding ad blockers)
- **User identification** on both client and server sides to correlate user behavior across sessions
- **Automatic error tracking** via the `capture_exceptions` option

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully created a new account | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | User successfully signed into their account | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | User signed out of their account | `pages/api/auth/sign-out.ts` |
| `checkout_started` | User initiated a checkout session to purchase a subscription | `pages/api/stripe/create-checkout.ts` |
| `checkout_completed` | User successfully completed checkout and subscribed to a plan | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | User's subscription was updated (plan change, renewal, etc.) | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | User's subscription was cancelled | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner invited a new member to the team | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removed a member from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account information (name, email) | `pages/api/account/update.ts` |
| `customer_portal_opened` | User opened the Stripe customer portal to manage their subscription | `pages/api/stripe/customer-portal.ts` |
| `pricing_page_viewed` | User viewed the pricing page (top of conversion funnel) | `pages/pricing.tsx` |

## Files Created/Modified

### New Files Created
- `.env` - Environment variables for PostHog configuration
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client

### Files Modified
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `components/login.tsx` - Added client-side user identification on sign-in/sign-up
- `components/header.tsx` - Added `posthog.reset()` on sign-out
- `pages/pricing.tsx` - Added pricing page view tracking
- `pages/api/auth/sign-up.ts` - Added user sign-up event and identification
- `pages/api/auth/sign-in.ts` - Added user sign-in event and identification
- `pages/api/auth/sign-out.ts` - Added user sign-out event
- `pages/api/stripe/create-checkout.ts` - Added checkout started event
- `pages/api/stripe/checkout.ts` - Added checkout completed event
- `pages/api/stripe/webhook.ts` - Added subscription updated/cancelled events
- `pages/api/stripe/customer-portal.ts` - Added customer portal opened event
- `pages/api/team/invite.ts` - Added team member invited event
- `pages/api/team/remove-member.ts` - Added team member removed event
- `pages/api/account/update.ts` - Added account updated event

## Next Steps

### Recommended Insights to Create

Based on the events implemented, you should create the following insights in your PostHog dashboard:

1. **Signup to Subscription Conversion Funnel**
   - Events: `user_signed_up` -> `pricing_page_viewed` -> `checkout_started` -> `checkout_completed`
   - Purpose: Track your core conversion funnel from signup to paid subscription

2. **User Authentication Trends**
   - Events: `user_signed_up`, `user_signed_in`, `user_signed_out`
   - Purpose: Monitor daily active users and authentication patterns

3. **Subscription Health**
   - Events: `checkout_completed`, `subscription_updated`, `subscription_cancelled`
   - Purpose: Track subscription lifecycle and identify churn risk

4. **Team Collaboration Activity**
   - Events: `team_member_invited`, `team_member_removed`
   - Purpose: Measure team growth and collaboration engagement

5. **Account Engagement**
   - Events: `account_updated`, `customer_portal_opened`
   - Purpose: Track user engagement with account management features

### Configuration Notes

- **Environment Variables**: Ensure `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` are set in your production environment
- **Reverse Proxy**: The `/ingest` path proxies PostHog requests through your domain to improve reliability and avoid ad blockers
- **Error Tracking**: Automatic exception capturing is enabled via `capture_exceptions: true`
- **Debug Mode**: Debug logging is enabled in development mode only

### PostHog Dashboard

Visit your PostHog project to create dashboards and insights based on these events:
- https://us.posthog.com

