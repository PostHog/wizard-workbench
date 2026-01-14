# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js App Router SaaS project. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (Next.js 15.3+ pattern)
- **Server-side PostHog client** for future server-side event tracking
- **Reverse proxy configuration** in `next.config.ts` for improved reliability
- **Environment variables** configured in `.env` file
- **User identification** on sign-in/sign-up forms
- **PostHog reset** on sign-out for proper user session handling
- **Error tracking** enabled via `capture_exceptions: true`

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `sign_in_submitted` | User submitted sign-in form | `app/(login)/login.tsx` |
| `sign_up_submitted` | User submitted sign-up form - conversion event | `app/(login)/login.tsx` |
| `sign_out_clicked` | User clicked sign out from dropdown menu | `app/(dashboard)/layout.tsx` |
| `checkout_started` | User clicked to start checkout from pricing page | `app/(dashboard)/pricing/submit-button.tsx` |
| `manage_subscription_clicked` | User clicked to manage their subscription | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_invited` | User submitted team member invitation form | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_removed` | User removed a team member | `app/(dashboard)/dashboard/page.tsx` |
| `account_updated` | User updated their account information | `app/(dashboard)/dashboard/general/page.tsx` |
| `password_updated` | User submitted password change form | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_deletion_submitted` | User submitted account deletion form - churn event | `app/(dashboard)/dashboard/security/page.tsx` |
| `terminal_copy_clicked` | User copied terminal commands on homepage | `app/(dashboard)/terminal.tsx` |
| `deploy_button_clicked` | User clicked deploy button on homepage | `app/(dashboard)/homepage-buttons.tsx` |
| `view_code_clicked` | User clicked to view source code on GitHub | `app/(dashboard)/homepage-buttons.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client
- `app/(dashboard)/homepage-buttons.tsx` - Client components for homepage tracking
- `.env` - Environment variables for PostHog

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites
- `app/(login)/login.tsx` - Sign-in/sign-up events + user identification
- `app/(dashboard)/layout.tsx` - Sign-out event + PostHog reset
- `app/(dashboard)/pricing/submit-button.tsx` - Checkout started event
- `app/(dashboard)/dashboard/page.tsx` - Team management events
- `app/(dashboard)/dashboard/general/page.tsx` - Account updated event
- `app/(dashboard)/dashboard/security/page.tsx` - Security events
- `app/(dashboard)/terminal.tsx` - Terminal copy event
- `app/(dashboard)/page.tsx` - Imported new button components

## Recommended Dashboard Insights

To get the most value from these events, create a PostHog dashboard with these insights:

1. **Conversion Funnel**: `sign_up_submitted` → `checkout_started` → successful subscription
2. **User Retention**: Track `sign_in_submitted` frequency over time
3. **Churn Indicators**: Monitor `account_deletion_submitted` and correlate with user behavior
4. **Feature Engagement**: Compare `team_member_invited` vs active users
5. **Homepage Engagement**: Track `deploy_button_clicked` and `view_code_clicked` rates

## Next steps

To create your analytics dashboard:

1. Go to [PostHog Dashboard](https://us.posthog.com/dashboard)
2. Create a new dashboard named "Analytics basics"
3. Add insights based on the events listed above
4. Set up alerts for critical events like `account_deletion_submitted`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

### Environment Variables

Make sure to set these environment variables in your production environment:
- `NEXT_PUBLIC_POSTHOG_KEY` - Your PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST` - Your PostHog host (https://us.i.posthog.com or https://eu.i.posthog.com)
