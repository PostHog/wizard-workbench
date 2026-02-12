# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router SaaS project. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (Next.js 15.3+ approach)
- **Server-side tracking** using `posthog-node` for critical backend events
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability
- **User identification** on sign-in and sign-up events
- **Session reset** on sign-out and account deletion to maintain proper user tracking

## Event Tracking Summary

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_in` | User successfully signed in to their account | `app/(login)/login.tsx` |
| `user_signed_up` | New user successfully created an account | `app/(login)/login.tsx` |
| `user_signed_out` | User signed out of their account | `app/(dashboard)/layout.tsx` |
| `checkout_started` | User clicked to start subscription checkout | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | User successfully completed checkout (server-side) | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | User's subscription was updated (server-side) | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | User's subscription was cancelled (server-side) | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User successfully updated their password | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_deleted` | User deleted their account | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_updated` | User updated their account information | `app/(dashboard)/dashboard/general/page.tsx` |
| `team_member_invited` | User invited a new team member | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_removed` | User removed a team member | `app/(dashboard)/dashboard/page.tsx` |

## Files Created

| File | Purpose |
|------|---------|
| `instrumentation-client.ts` | PostHog client-side initialization with error tracking |
| `lib/posthog-server.ts` | PostHog server-side client helper for API routes |
| `.env.local` | Environment variables for PostHog API key and host |

## Files Modified

| File | Changes |
|------|---------|
| `next.config.ts` | Added reverse proxy rewrites and trailing slash configuration |
| `app/(login)/login.tsx` | Added user identification and sign-in/sign-up events |
| `app/(dashboard)/layout.tsx` | Added sign-out event with session reset |
| `app/(dashboard)/pricing/submit-button.tsx` | Added checkout started event |
| `app/(dashboard)/dashboard/security/page.tsx` | Added password updated and account deleted events |
| `app/(dashboard)/dashboard/general/page.tsx` | Added account updated event |
| `app/(dashboard)/dashboard/page.tsx` | Added team member invited/removed events |
| `app/api/stripe/checkout/route.ts` | Added checkout completed server-side event |
| `app/api/stripe/webhook/route.ts` | Added subscription updated/cancelled server-side events |

## Configuration

Environment variables set in `.env.local`:
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog ingestion host

## Next steps

To view your analytics, create insights and dashboards in your PostHog project:

1. Visit [PostHog Dashboard](https://us.posthog.com) and sign in
2. Create a new dashboard named "Analytics basics"
3. Add the following recommended insights:

**Suggested Insights:**
- **User Funnel**: `user_signed_up` -> `checkout_started` -> `checkout_completed` (conversion funnel)
- **Active Users**: Unique users by `user_signed_in` events over time
- **Churn Tracking**: `subscription_cancelled` events over time
- **Engagement**: `team_member_invited` events (shows team growth)
- **Account Health**: `account_deleted` vs `user_signed_up` ratio

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
