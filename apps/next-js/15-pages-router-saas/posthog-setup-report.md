# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using PostHog's recommended approach for Next.js 15.3+
- **Server-side tracking** via `lib/posthog-server.ts` for API route events
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through `/ingest` for improved reliability
- **User identification** on both client and server sides during authentication flows
- **Environment variables** configured in `.env` with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully completed the sign-up process and created an account | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | User successfully authenticated and signed into their account | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `checkout_started` | User initiated the checkout process for a subscription plan | `pages/api/stripe/create-checkout.ts` |
| `checkout_completed` | User successfully completed the checkout and subscription was activated | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | User's subscription was updated via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | User's subscription was cancelled via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | User invited a new team member to join their team | `pages/api/team/invite.ts` |
| `team_member_removed` | User removed a team member from their team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account information (name, email) | `pages/api/account/update.ts` |
| `pricing_plan_selected` | User clicked to select a pricing plan from the pricing page | `pages/pricing.tsx` |

## Files Modified

- `instrumentation-client.ts` - Created for client-side PostHog initialization
- `lib/posthog-server.ts` - Created for server-side PostHog client
- `next.config.ts` - Updated with reverse proxy rewrites for PostHog
- `pages/_app.tsx` - No changes needed (PostHog auto-initializes via instrumentation)
- `components/header.tsx` - Added sign-out event tracking
- `components/login.tsx` - Added user identification after auth
- `pages/pricing.tsx` - Added pricing plan selection tracking
- `pages/api/auth/sign-in.ts` - Added sign-in event and user identification
- `pages/api/auth/sign-up.ts` - Added sign-up event and user identification
- `pages/api/stripe/create-checkout.ts` - Added checkout started event
- `pages/api/stripe/checkout.ts` - Added checkout completed event
- `pages/api/stripe/webhook.ts` - Added subscription events
- `pages/api/team/invite.ts` - Added team invitation event
- `pages/api/team/remove-member.ts` - Added team member removal event
- `pages/api/account/update.ts` - Added account update event
- `.env` - Created with PostHog configuration
- `.env.example` - Updated with PostHog variables template

## Next steps

We've instrumented your application with key business events. Here are recommended insights to create in your PostHog dashboard:

### Suggested Dashboard Insights

1. **Sign-up to Checkout Funnel** - Track conversion from `user_signed_up` → `pricing_plan_selected` → `checkout_started` → `checkout_completed`
2. **User Authentication Trends** - Monitor `user_signed_in`, `user_signed_up`, and `user_signed_out` events over time
3. **Subscription Health** - Track `subscription_updated` vs `subscription_cancelled` to monitor churn
4. **Team Growth** - Monitor `team_member_invited` and `team_member_removed` events
5. **Account Engagement** - Track `account_updated` events as a sign of user engagement

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

## Environment Variables

Make sure your `.env` file contains:

```
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```
