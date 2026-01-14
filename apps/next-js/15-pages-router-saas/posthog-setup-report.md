# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router SaaS application. This integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the modern Next.js 15.3+ approach
- **Server-side tracking** using `posthog-node` for API route events
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through `/ingest` for better ad-blocker resilience
- **User identification** on sign-in and sign-up to correlate events across sessions
- **Session reset** on sign-out to properly separate user sessions
- **Error tracking** enabled via `capture_exceptions: true`

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully completed the sign up process and created an account | `components/login.tsx` |
| `user_signed_in` | User successfully signed into their account | `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `checkout_started` | User initiated the checkout process by clicking Get Started on a pricing plan | `pages/pricing.tsx` |
| `checkout_completed` | User successfully completed the Stripe checkout and subscription was activated | `pages/api/stripe/checkout.ts` |
| `subscription_managed` | User clicked to manage their subscription via Stripe customer portal | `pages/dashboard/index.tsx` |
| `team_member_invited` | Owner invited a new team member via email | `pages/dashboard/index.tsx` |
| `team_member_removed` | Owner removed a team member from the team | `pages/dashboard/index.tsx` |
| `account_updated` | User updated their account information (name/email) | `pages/dashboard/general.tsx` |
| `subscription_updated` | Subscription status changed (upgraded, downgraded, canceled) | `pages/api/stripe/webhook.ts` |
| `pricing_viewed` | User viewed the pricing page (top of conversion funnel) | `pages/pricing.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - PostHog client-side initialization
- `lib/posthog-server.ts` - PostHog server-side client helper
- `.env` - Environment variables with PostHog configuration

### Modified Files
- `next.config.ts` - Added PostHog reverse proxy rewrites
- `components/login.tsx` - Added sign-in/sign-up events and user identification
- `components/header.tsx` - Added sign-out event and session reset
- `pages/pricing.tsx` - Added pricing_viewed and checkout_started events
- `pages/dashboard/index.tsx` - Added subscription management and team events
- `pages/dashboard/general.tsx` - Added account_updated event
- `pages/api/stripe/checkout.ts` - Added server-side checkout_completed event
- `pages/api/stripe/webhook.ts` - Added server-side subscription_updated event
- `.env.example` - Added PostHog environment variables documentation

## Next steps

### Recommended Dashboards & Insights

Create the following insights in your PostHog project to monitor user behavior:

1. **Conversion Funnel**: `pricing_viewed` -> `checkout_started` -> `checkout_completed`
   - Track your subscription conversion rate from page view to completed purchase

2. **User Authentication Flow**: `user_signed_up` -> `user_signed_in` counts over time
   - Monitor new user registrations and returning user engagement

3. **Churn Indicator**: `subscription_updated` events where `cancel_at_period_end` is true
   - Track subscription cancellations to identify churn patterns

4. **Team Engagement**: `team_member_invited` and `team_member_removed` trends
   - Understand how teams are growing and collaborating

5. **User Retention**: Track `user_signed_in` events per unique user over time
   - Measure how often users return to your application

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

### Environment Variables

Make sure your `.env` file contains the following PostHog configuration:

```
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Get your API key from [PostHog Project Settings](https://app.posthog.com/project/settings).
