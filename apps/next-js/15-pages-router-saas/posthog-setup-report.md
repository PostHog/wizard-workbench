# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` with automatic exception tracking
- **Server-side tracking** via `lib/posthog-server.ts` for API routes
- **Reverse proxy configuration** in `next.config.ts` to avoid ad blockers
- **User identification** on sign-in/sign-up flows
- **Event tracking** across authentication, checkout, subscription management, and team features
- **Error tracking** with `posthog.captureException()` in all catch blocks

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully signed up for an account | `components/login.tsx` |
| `user_signed_in` | User successfully signed in to their account | `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `checkout_started` | User started the checkout process by clicking Get Started on pricing page | `pages/pricing.tsx` |
| `subscription_managed` | User clicked to manage their subscription via Stripe portal | `pages/dashboard/index.tsx` |
| `team_member_invited` | User invited a new team member | `pages/dashboard/index.tsx` |
| `team_member_removed` | User removed a team member from the team | `pages/dashboard/index.tsx` |
| `account_updated` | User updated their account information (name/email) | `pages/dashboard/general.tsx` |
| `subscription_changed` | Subscription status changed via Stripe webhook (server-side) | `pages/api/stripe/webhook.ts` |
| `checkout_completed` | User completed the Stripe checkout process (server-side) | `pages/api/stripe/checkout.ts` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client
- `.env` - Environment variables with PostHog configuration

### Modified Files
- `next.config.ts` - Added PostHog reverse proxy rewrites
- `components/login.tsx` - Added user identification and sign-in/sign-up events
- `components/header.tsx` - Added sign-out event with posthog.reset()
- `pages/pricing.tsx` - Added checkout_started event
- `pages/dashboard/index.tsx` - Added subscription_managed, team_member_invited, team_member_removed events
- `pages/dashboard/general.tsx` - Added account_updated event
- `pages/api/stripe/webhook.ts` - Added server-side subscription_changed event
- `pages/api/stripe/checkout.ts` - Added server-side checkout_completed event

## Next steps

We recommend creating the following insights in your PostHog dashboard:

1. **Sign-up to Checkout Funnel** - Track conversion from `user_signed_up` → `checkout_started` → `checkout_completed`
2. **User Retention** - Monitor `user_signed_in` events over time
3. **Churn Indicator** - Track `subscription_changed` events with status changes
4. **Team Growth** - Monitor `team_member_invited` events
5. **Account Engagement** - Track `account_updated` events

To create these insights:
1. Go to your PostHog dashboard at https://us.posthog.com
2. Create a new dashboard named "Analytics basics"
3. Add insights using the event names from the table above

### Environment Variables

Make sure your `.env` file contains:
```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.
