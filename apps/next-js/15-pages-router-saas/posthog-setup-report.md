# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js Pages Router SaaS application. The integration includes both client-side and server-side event tracking, user identification, and error tracking for all critical user flows.

## Integration Summary

### Client-side Setup
- **instrumentation-client.ts**: PostHog client initialization with automatic pageview and exception capturing
- **next.config.ts**: Configured reverse proxy rewrites to route PostHog requests through `/ingest` to avoid ad blockers

### Server-side Setup
- **lib/posthog-server.ts**: Server-side PostHog Node.js client for API route event tracking

### Environment Variables
Environment variables are configured in `.env`:
- `NEXT_PUBLIC_POSTHOG_KEY`: Your PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog host URL (https://us.i.posthog.com)

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User successfully created a new account | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | User successfully logged in | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | User signed out of their account | `pages/api/auth/sign-out.ts` |
| `user_logged_out` | Client-side logout event (before reset) | `components/header.tsx` |
| `login_form_submitted` | User submitted the login/signup form | `components/login.tsx` |
| `checkout_started` | User initiated a checkout session | `pages/api/stripe/create-checkout.ts` |
| `checkout_completed` | User successfully completed checkout | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Subscription status changed via webhook | `pages/api/stripe/webhook.ts` |
| `customer_portal_opened` | User opened Stripe customer portal | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | User sent a team invitation | `pages/api/team/invite.ts` |
| `team_member_removed` | User removed a team member | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated account information | `pages/api/account/update.ts` |
| `pricing_plan_selected` | User clicked to select a pricing plan | `pages/pricing.tsx` |

## User Identification

User identification is implemented in:
- **Client-side** (`components/login.tsx`): Users are identified by email upon successful login/signup
- **Server-side** (`pages/api/auth/sign-in.ts`, `pages/api/auth/sign-up.ts`): Users are identified with additional properties (email, teamId, teamName)
- **Logout** (`components/header.tsx`): `posthog.reset()` is called to unlink future events from the user

## Error Tracking

PostHog exception capture is implemented in:
- `pages/api/auth/sign-in.ts`
- `pages/api/auth/sign-up.ts`
- `pages/api/stripe/create-checkout.ts`
- `pages/api/stripe/checkout.ts`
- `components/login.tsx`
- `pages/pricing.tsx`

## Next steps

We recommend creating the following insights in your PostHog dashboard based on the events implemented:

1. **Signup Conversion Funnel**: Track users from `pricing_plan_selected` → `login_form_submitted` (mode=signup) → `user_signed_up` → `checkout_completed`
2. **Login Success Rate**: Compare successful vs failed `login_form_submitted` events
3. **Checkout Conversion**: Track `checkout_started` → `checkout_completed` conversion rate
4. **Team Growth**: Monitor `team_member_invited` events over time
5. **Subscription Churn**: Track `subscription_updated` events where status changes to 'canceled'

To create these insights:
1. Go to your PostHog dashboard at https://us.posthog.com
2. Click "New Insight" and use the event names above
3. Create a new dashboard named "Analytics basics" to organize these insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
