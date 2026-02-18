# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js SaaS application. This integration includes:

- **Client-side initialization** via `instrumentation-client.ts` for automatic pageview tracking, session replay, and error capture
- **Server-side analytics** via `posthog-node` for tracking critical business events in API routes and server actions
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability and avoid ad blockers
- **User identification** on sign-in and sign-up events for correlating user behavior across sessions
- **Comprehensive event tracking** across the full user lifecycle including authentication, subscriptions, and team management

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully created a new account | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signed in to their account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(dashboard)/layout.tsx` |
| `checkout_started` | User initiated the checkout process for a pricing plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | User successfully completed checkout and subscription was created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | User's subscription was updated (plan change, renewal, etc.) | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | User cancelled their subscription | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User successfully updated their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (churn event) | `app/(login)/actions.ts` |
| `account_updated` | User updated their account information (name/email) | `app/(login)/actions.ts` |
| `team_member_invited` | Owner invited a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team | `app/(login)/actions.ts` |
| `invitation_accepted` | User accepted a team invitation during signup | `app/(login)/actions.ts` |
| `manage_subscription_clicked` | User clicked to manage their subscription via customer portal | `app/(dashboard)/dashboard/page.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client utility
- `.env.local` - Environment variables for PostHog API key and host

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `app/(login)/actions.ts` - Added server-side event tracking for authentication and account management
- `app/(dashboard)/layout.tsx` - Added client-side sign out tracking
- `app/(dashboard)/pricing/submit-button.tsx` - Added checkout started tracking
- `app/api/stripe/checkout/route.ts` - Added checkout completed tracking
- `app/api/stripe/webhook/route.ts` - Added subscription lifecycle tracking
- `app/(dashboard)/dashboard/page.tsx` - Added manage subscription tracking

## Next steps

### Create Your Analytics Dashboard

To visualize your new analytics data, create a dashboard in PostHog with these recommended insights:

1. **Sign-up to Checkout Funnel** - Track conversion from `user_signed_up` -> `checkout_started` -> `checkout_completed`
2. **User Retention** - Monitor `user_signed_in` events over time
3. **Churn Analysis** - Track `account_deleted` and `subscription_cancelled` events
4. **Team Growth** - Monitor `team_member_invited` and `invitation_accepted` events
5. **Subscription Health** - Track `subscription_updated` and `manage_subscription_clicked` events

Visit your PostHog dashboard at: https://us.posthog.com/project

### Environment Variables

Make sure these environment variables are set in your production environment:

```
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
