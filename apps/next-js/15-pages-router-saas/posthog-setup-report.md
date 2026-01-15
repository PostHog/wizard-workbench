# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js Pages Router project with PostHog analytics. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the PostHog JavaScript SDK
- **Server-side tracking** via `lib/posthog-server.ts` using the PostHog Node.js SDK
- **Reverse proxy configuration** in `next.config.ts` to route analytics through your domain
- **User identification** on both sign-in and sign-up flows
- **Event tracking** for key business actions across authentication, payments, and team management
- **Error tracking** enabled via `capture_exceptions: true`

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User completed sign up form and created account | `components/login.tsx` |
| `user_signed_in` | User successfully signed in to their account | `components/login.tsx` |
| `user_signed_out` | User clicked sign out and was logged out | `components/header.tsx` |
| `checkout_started` | User clicked Get Started on a pricing plan | `pages/pricing.tsx` |
| `team_member_invited` | User sent an invitation to a team member | `pages/dashboard/index.tsx` |
| `team_member_removed` | User removed a team member from the team | `pages/dashboard/index.tsx` |
| `account_updated` | User updated their account information | `pages/dashboard/general.tsx` |
| `server_sign_in` | Server-side event for user sign in | `pages/api/auth/sign-in.ts` |
| `server_sign_up` | Server-side event for user sign up | `pages/api/auth/sign-up.ts` |
| `subscription_created` | Stripe subscription was created after checkout | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Stripe subscription was updated via webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe subscription was cancelled via webhook | `pages/api/stripe/webhook.ts` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client
- `.env` - Environment variables for PostHog API key and host

### Modified Files
- `next.config.ts` - Added PostHog reverse proxy rewrites
- `components/login.tsx` - Added sign in/sign up events and user identification
- `components/header.tsx` - Added sign out event
- `pages/pricing.tsx` - Added checkout_started event
- `pages/dashboard/index.tsx` - Added team member invite/remove events
- `pages/dashboard/general.tsx` - Added account_updated event
- `pages/api/auth/sign-in.ts` - Added server-side sign in event
- `pages/api/auth/sign-up.ts` - Added server-side sign up event
- `pages/api/stripe/checkout.ts` - Added subscription_created event
- `pages/api/stripe/webhook.ts` - Added subscription webhook events

## Next steps

### Create an Analytics Dashboard

Create a new dashboard in PostHog called "Analytics basics" with these recommended insights:

1. **Sign-up to Checkout Funnel** - A funnel insight tracking:
   - `user_signed_up` -> `checkout_started` -> `subscription_created`

2. **User Activity Over Time** - A trends insight showing:
   - `user_signed_in`, `user_signed_up`, `user_signed_out` over time

3. **Subscription Lifecycle** - A trends insight showing:
   - `subscription_created`, `subscription_updated`, `subscription_cancelled`

4. **Team Engagement** - A trends insight showing:
   - `team_member_invited`, `team_member_removed`, `account_updated`

5. **Churn Analysis** - A retention insight or funnel showing:
   - Users who signed up but later cancelled their subscription

### PostHog Dashboard Links

Visit your PostHog project to create insights:
- [PostHog App](https://us.posthog.com) - Create your analytics dashboard here

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

## Environment Variables

Make sure these environment variables are set in your deployment:

```bash
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

The `.env` file has been created with your provided values for local development.
