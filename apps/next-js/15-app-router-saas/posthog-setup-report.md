# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (Next.js 15.3+ recommended approach)
- **Server-side tracking** via `posthog-node` for API routes and webhooks
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability
- **User identification** on sign-in and sign-up events
- **Automatic exception capture** enabled for error tracking

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_in` | User successfully signed in to their account | `app/(login)/login.tsx` |
| `user_signed_up` | User successfully created a new account | `app/(login)/login.tsx` |
| `user_signed_out` | User signed out of their account | `app/(dashboard)/layout.tsx` |
| `checkout_started` | User clicked to start checkout process for a pricing plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | User successfully completed checkout and subscribed (server-side) | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription status changed via Stripe webhook (server-side) | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Subscription was cancelled via Stripe webhook (server-side) | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User successfully updated their password | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_deleted` | User initiated account deletion | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_updated` | User updated their account information | `app/(dashboard)/dashboard/general/page.tsx` |
| `team_member_invited` | Team owner invited a new member | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_removed` | Team member was removed from the team | `app/(dashboard)/dashboard/page.tsx` |
| `manage_subscription_clicked` | User clicked to manage their subscription via customer portal | `app/(dashboard)/dashboard/page.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client singleton
- `.env` - Environment variables for PostHog configuration

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `app/(login)/login.tsx` - Added sign-in/sign-up events with user identification
- `app/(dashboard)/layout.tsx` - Added sign-out event with posthog.reset()
- `app/(dashboard)/pricing/submit-button.tsx` - Added checkout_started event
- `app/api/stripe/checkout/route.ts` - Added checkout_completed server-side event
- `app/api/stripe/webhook/route.ts` - Added subscription_updated/cancelled server-side events
- `app/(dashboard)/dashboard/security/page.tsx` - Added password_updated and account_deleted events
- `app/(dashboard)/dashboard/general/page.tsx` - Added account_updated event
- `app/(dashboard)/dashboard/page.tsx` - Added team member and subscription management events

## Next steps

### Create Your Dashboard

To create an "Analytics basics" dashboard with insights for your events, go to your PostHog project and create a new dashboard with the following suggested insights:

1. **Sign-up to Checkout Conversion Funnel**
   - Steps: `user_signed_up` → `checkout_started` → `checkout_completed`
   - Type: Funnel

2. **User Retention by Sign-up Cohort**
   - Event: `user_signed_in`
   - Type: Retention (returning users who signed up)

3. **Subscription Lifecycle**
   - Events: `checkout_completed`, `subscription_updated`, `subscription_cancelled`
   - Type: Trends

4. **Team Engagement**
   - Events: `team_member_invited`, `team_member_removed`
   - Type: Trends

5. **Account Health**
   - Events: `password_updated`, `account_updated`, `account_deleted`
   - Type: Trends

### Environment Variables

Make sure these environment variables are set in your production environment:

```
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
