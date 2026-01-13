# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js Pages Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15.3+ approach
- **Server-side tracking** via `posthog-node` for API route events
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through `/ingest` for better ad-blocker resilience
- **Environment variables** configured in `.env` with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`
- **User identification** on both client and server side during login/signup
- **Error tracking** with `posthog.captureException()` in critical error handlers
- **Session reset** on logout to properly separate user sessions

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully completed the sign-up process and created an account | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | User successfully signed in to their account | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | User signed out of their account | `pages/api/auth/sign-out.ts` |
| `user_logged_in` | Client-side login event captured after successful authentication | `components/login.tsx` |
| `user_logged_out` | Client-side logout event captured before session reset | `components/header.tsx` |
| `sign_in_failed` | User attempted to sign in but failed (validation error, user not found, invalid password) | `pages/api/auth/sign-in.ts` |
| `sign_up_failed` | User attempted to sign up but failed (validation error, user already exists) | `pages/api/auth/sign-up.ts` |
| `checkout_started` | User initiated a checkout session to subscribe to a plan | `pages/api/stripe/create-checkout.ts` |
| `checkout_completed` | User successfully completed checkout and subscription is activated | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | User's subscription status changed via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner sent an invitation to add a new team member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removed a member from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account information (name or email) | `pages/api/account/update.ts` |
| `customer_portal_opened` | User opened the Stripe customer portal to manage subscription | `pages/api/stripe/customer-portal.ts` |
| `pricing_page_viewed` | User clicked "Get Started" on a pricing plan (conversion funnel entry) | `pages/pricing.tsx` |

## Files Created

| File | Purpose |
|------|---------|
| `.env` | Environment variables for PostHog API key and host |
| `instrumentation-client.ts` | Client-side PostHog initialization |
| `lib/posthog-server.ts` | Server-side PostHog client singleton |

## Files Modified

| File | Changes |
|------|---------|
| `next.config.ts` | Added reverse proxy rewrites for `/ingest` path |
| `components/login.tsx` | Added client-side user identification and login/signup events |
| `components/header.tsx` | Added logout event and session reset |
| `pages/pricing.tsx` | Added pricing page viewed event |
| `pages/api/auth/sign-in.ts` | Added server-side sign-in events and user identification |
| `pages/api/auth/sign-up.ts` | Added server-side sign-up events and user identification |
| `pages/api/auth/sign-out.ts` | Added server-side sign-out event |
| `pages/api/stripe/create-checkout.ts` | Added checkout started event |
| `pages/api/stripe/checkout.ts` | Added checkout completed event |
| `pages/api/stripe/webhook.ts` | Added subscription updated event |
| `pages/api/stripe/customer-portal.ts` | Added customer portal opened event |
| `pages/api/team/invite.ts` | Added team member invited event |
| `pages/api/team/remove-member.ts` | Added team member removed event |
| `pages/api/account/update.ts` | Added account updated event |

## Next steps

We recommend creating an "Analytics Basics" dashboard in PostHog with the following insights:

1. **Sign-up Conversion Funnel**: Track users from `pricing_page_viewed` -> `user_signed_up` -> `checkout_completed`
2. **Authentication Overview**: Trend chart showing `user_signed_in`, `user_signed_up`, and `user_signed_out` over time
3. **Failed Authentication Attempts**: Monitor `sign_in_failed` and `sign_up_failed` events by failure reason
4. **Subscription Metrics**: Track `checkout_started`, `checkout_completed`, and `subscription_updated` events
5. **Team Collaboration**: Monitor `team_member_invited` and `team_member_removed` events

To create these insights:
1. Go to your PostHog dashboard: https://us.posthog.com
2. Click "New insight" and select the appropriate visualization type
3. Use the event names listed above to build your queries

## Configuration Details

- **PostHog Host**: https://us.i.posthog.com
- **Reverse Proxy**: Enabled via `/ingest` path
- **Error Tracking**: Enabled with `capture_exceptions: true`
- **Debug Mode**: Enabled in development environment
