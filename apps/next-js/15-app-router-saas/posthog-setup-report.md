# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js App Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the modern Next.js 15.3+ approach
- **Server-side tracking** via a shared PostHog Node.js client in `lib/posthog-server.ts`
- **Reverse proxy configuration** in `next.config.ts` to route analytics through `/ingest` path
- **User identification** on sign-in and sign-up for proper user tracking
- **Session reset** on sign-out to maintain clean user sessions
- **Error tracking** with `posthog.captureException()` for server-side errors

## Events Instrumented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_in` | User successfully signed in to their account | `app/(login)/login.tsx` |
| `user_signed_up` | New user successfully created an account | `app/(login)/login.tsx` |
| `user_signed_out` | User signed out of their account | `app/(dashboard)/layout.tsx` |
| `checkout_started` | User initiated the checkout process for a pricing plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | User successfully completed checkout and subscription was activated (server-side) | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | User's subscription was updated via Stripe webhook (server-side) | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | User's subscription was canceled via Stripe webhook (server-side) | `app/api/stripe/webhook/route.ts` |
| `account_updated` | User updated their account information (name/email) | `app/(dashboard)/dashboard/general/page.tsx` |
| `password_updated` | User successfully changed their password | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_deleted` | User deleted their account | `app/(dashboard)/dashboard/security/page.tsx` |
| `team_member_invited` | User sent an invitation to a team member (server-side) | `app/(login)/actions.ts` |
| `team_member_removed` | User removed a team member (server-side) | `app/(login)/actions.ts` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client
- `.env` - Environment variables with PostHog configuration

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `app/(login)/login.tsx` - Added sign-in/sign-up events with user identification
- `app/(dashboard)/layout.tsx` - Added sign-out event with session reset
- `app/(dashboard)/pricing/submit-button.tsx` - Added checkout started event
- `app/api/stripe/checkout/route.ts` - Added checkout completed server-side event
- `app/api/stripe/webhook/route.ts` - Added subscription events server-side
- `app/(dashboard)/dashboard/general/page.tsx` - Added account updated event
- `app/(dashboard)/dashboard/security/page.tsx` - Added password and account deletion events
- `app/(login)/actions.ts` - Added team member invitation/removal server-side events

## Next steps

We recommend creating insights and a dashboard in PostHog to track the events we just instrumented. Here are some suggested insights:

1. **Sign-up to Checkout Funnel** - Track conversion from `user_signed_up` -> `checkout_started` -> `checkout_completed`
2. **Churn Analysis** - Monitor `subscription_canceled` and `account_deleted` events
3. **User Engagement** - Track `account_updated`, `password_updated`, and team collaboration events
4. **Revenue Metrics** - Analyze `checkout_completed` with plan details

To create these:
1. Go to your PostHog dashboard: https://us.posthog.com
2. Create a new dashboard named "Analytics Basics"
3. Add insights using the event names listed above

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

The following environment variables have been configured in `.env`:

```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Make sure to add these to your production environment (Vercel, Netlify, etc.) as well.
