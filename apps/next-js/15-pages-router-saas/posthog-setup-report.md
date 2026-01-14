# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router project. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the PostHog JavaScript SDK
- **Server-side tracking** via `lib/posthog-server.ts` using the PostHog Node SDK
- **Reverse proxy configuration** in `next.config.ts` for improved tracking reliability
- **User identification** on sign-in and sign-up events
- **Event tracking** across key user flows including authentication, subscriptions, and team management
- **Session recording and error tracking** enabled by default

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User completed the sign-up form and successfully created an account | `components/login.tsx` |
| `user_signed_in` | User successfully signed in to their account | `components/login.tsx` |
| `user_signed_out` | User clicked sign out and logged out of their account | `components/header.tsx` |
| `checkout_started` | User clicked the Get Started button on a pricing plan to begin checkout | `pages/pricing.tsx` |
| `subscription_created` | User completed Stripe checkout and subscription was created | `pages/api/stripe/webhook.ts` |
| `subscription_updated` | User's subscription was updated (plan change, renewal, etc.) | `pages/api/stripe/webhook.ts` |
| `subscription_canceled` | User's subscription was canceled | `pages/api/stripe/webhook.ts` |
| `customer_portal_opened` | User clicked to open the Stripe customer portal | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | User sent an invitation to add a new team member | `pages/api/team/invite.ts` |
| `team_member_removed` | User removed a member from their team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account information (name or email) | `pages/dashboard/general.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client
- `.env` - Environment variables including PostHog configuration

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `components/login.tsx` - Added user identification and sign-up/sign-in events
- `components/header.tsx` - Added sign-out event with PostHog reset
- `pages/pricing.tsx` - Added checkout started event
- `pages/dashboard/general.tsx` - Added account updated event
- `pages/api/stripe/webhook.ts` - Added subscription lifecycle events
- `pages/api/stripe/customer-portal.ts` - Added customer portal opened event
- `pages/api/team/invite.ts` - Added team member invited event
- `pages/api/team/remove-member.ts` - Added team member removed event
- `.env.example` - Added PostHog environment variable examples

## Next steps

You can now view your analytics data in the PostHog dashboard. Create insights and dashboards to track:

1. **User Acquisition Funnel**: `user_signed_up` -> `checkout_started` -> `subscription_created`
2. **User Engagement**: Track active users via sign-in events and account updates
3. **Churn Analysis**: Monitor `subscription_canceled` events and correlate with user behavior
4. **Team Growth**: Track team expansion via `team_member_invited` events

### Recommended Insights
- Conversion funnel from sign-up to paid subscription
- Daily/weekly active users based on sign-in events
- Subscription churn rate over time
- Team size distribution across accounts

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.
