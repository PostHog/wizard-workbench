# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 App Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15.3+ pattern
- **Server-side PostHog client** in `lib/posthog-server.ts` for backend event tracking
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability and bypass ad blockers
- **Environment variables** configured in `.env` with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`
- **User identification** on sign-in and sign-up flows
- **Event tracking** across authentication, subscription, team management, and account settings

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `sign_up_submitted` | User submitted the sign-up form | `app/(login)/login.tsx` |
| `sign_in_submitted` | User submitted the sign-in form | `app/(login)/login.tsx` |
| `checkout_started` | User clicked to start checkout for a pricing plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `subscription_managed` | User clicked to manage their subscription in Stripe portal | `app/(dashboard)/dashboard/page.tsx` |
| `account_updated` | User submitted account information update form | `app/(dashboard)/dashboard/general/page.tsx` |
| `password_update_submitted` | User submitted password change form | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_deletion_submitted` | User submitted account deletion form | `app/(dashboard)/dashboard/security/page.tsx` |
| `team_member_invited` | User submitted team member invitation form | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_removed` | User clicked to remove a team member | `app/(dashboard)/dashboard/page.tsx` |
| `sign_out_clicked` | User clicked the sign out button | `app/(dashboard)/layout.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client
- `.env` - Environment variables with PostHog configuration

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `app/(login)/login.tsx` - Added sign-in/sign-up events and user identification
- `app/(dashboard)/layout.tsx` - Added sign-out event and PostHog reset
- `app/(dashboard)/pricing/submit-button.tsx` - Added checkout started event
- `app/(dashboard)/dashboard/page.tsx` - Added subscription, team invite, and team removal events
- `app/(dashboard)/dashboard/general/page.tsx` - Added account update event
- `app/(dashboard)/dashboard/security/page.tsx` - Added password update and account deletion events

## Next steps

Once your application is running and generating events, you can create insights and dashboards in PostHog to track:

1. **Sign-up to Checkout Funnel** - Track conversion from `sign_up_submitted` → `checkout_started`
2. **User Retention** - Monitor `sign_in_submitted` events over time
3. **Churn Indicators** - Track `account_deletion_submitted` and correlate with user behavior
4. **Team Growth** - Analyze `team_member_invited` events to understand collaboration patterns
5. **Feature Engagement** - Monitor `subscription_managed` to see how users interact with billing

Visit your PostHog dashboard at: https://us.posthog.com

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.
