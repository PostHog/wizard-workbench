# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js Pages Router project. PostHog has been integrated using the `instrumentation-client.ts` approach for client-side initialization (recommended for Next.js 15.3+), along with a server-side Node.js client for backend event tracking. A reverse proxy has been configured through Next.js rewrites to improve tracking reliability by avoiding ad blockers.

## Integration Summary

### Files Created
- `instrumentation-client.ts` - Client-side PostHog initialization with error tracking enabled
- `lib/posthog-server.ts` - Server-side PostHog client for backend event capture
- `.env` - Environment variables for PostHog configuration
- `.posthog-events.json` - Event tracking plan (temporary, removed after setup)

### Files Modified
- `next.config.ts` - Added reverse proxy rewrites for PostHog API and assets
- `components/login.tsx` - Added user identification and auth event tracking
- `components/header.tsx` - Added sign out tracking with session reset
- `pages/pricing.tsx` - Added checkout started tracking
- `pages/dashboard/index.tsx` - Added team management and subscription tracking
- `pages/dashboard/general.tsx` - Added account update tracking

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User successfully created a new account | `components/login.tsx` |
| `user_signed_in` | User successfully signed in to their account | `components/login.tsx` |
| `sign_in_failed` | User failed to sign in due to invalid credentials | `components/login.tsx` |
| `sign_up_failed` | User failed to create an account | `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `checkout_started` | User clicked to start checkout for a pricing plan | `pages/pricing.tsx` |
| `team_member_invited` | User sent an invitation to add a team member | `pages/dashboard/index.tsx` |
| `team_member_removed` | User removed a member from their team | `pages/dashboard/index.tsx` |
| `customer_portal_opened` | User opened Stripe customer portal to manage subscription | `pages/dashboard/index.tsx` |
| `account_updated` | User updated their account information | `pages/dashboard/general.tsx` |

## Key Features Enabled

- **Automatic pageviews**: PostHog will automatically capture pageview events
- **User identification**: Users are identified on sign up/sign in using their email
- **Session management**: `posthog.reset()` is called on sign out to unlink sessions
- **Error tracking**: `capture_exceptions: true` enabled for automatic exception capture
- **Manual error capture**: `posthog.captureException()` used in catch blocks
- **Reverse proxy**: Configured via Next.js rewrites to `/ingest/*` for improved reliability

## Next Steps

After deploying your application and collecting some events, create an "Analytics basics" dashboard in PostHog with the following insights:

1. **Sign Up to Checkout Funnel**: Track conversion from `user_signed_up` -> `checkout_started`
2. **Authentication Overview**: Trends showing `user_signed_in`, `user_signed_out`, `sign_in_failed`
3. **Team Activity**: Track `team_member_invited` and `team_member_removed` events
4. **Account Engagement**: Monitor `account_updated` and `customer_portal_opened` events
5. **Churn Indicator**: Track ratio of `user_signed_out` to active users

### Dashboard Configuration

Once your application is live and collecting events, you can create the dashboard at:
- PostHog US: https://us.posthog.com/project/YOUR_PROJECT_ID/dashboard/new

### Agent Skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

## Environment Variables

Make sure these environment variables are set in your production environment:

```bash
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```
