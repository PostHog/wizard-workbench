# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router SaaS application. The implementation includes:

- **Client-side initialization** via `instrumentation-client.ts` using the modern Next.js 15.5.7 instrumentation pattern
- **Server-side tracking** via `lib/posthog-server.ts` for API routes and webhooks
- **Reverse proxy setup** in `next.config.ts` to avoid ad blockers and improve reliability
- **User identification** on sign-in/sign-up to associate events with users
- **Session reset** on sign-out and account deletion for accurate user attribution

## Events Implemented

| Event Name | Description | File Path |
|-----------|-------------|-----------|
| `user_signed_in` | User successfully signs in to their account | `app/(login)/login.tsx` |
| `user_signed_up` | New user creates an account | `app/(login)/login.tsx` |
| `user_signed_out` | User logs out of their account | `app/(dashboard)/layout.tsx` |
| `checkout_started` | User initiates checkout for a subscription plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `subscription_checkout_completed` | Server-side: User successfully completes Stripe checkout | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Server-side: Subscription status changed via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Server-side: Subscription canceled via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User successfully updates their password | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_deleted` | User deletes their account | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_updated` | User updates their account information (name/email) | `app/(dashboard)/dashboard/general/page.tsx` |
| `team_member_invited` | Team owner invites a new member to the team | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_removed` | Team owner removes a member from the team | `app/(dashboard)/dashboard/page.tsx` |
| `manage_subscription_clicked` | User clicks to manage their subscription in Stripe portal | `app/(dashboard)/dashboard/page.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client for API routes

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `app/(login)/login.tsx` - Added sign-in/sign-up events with user identification
- `app/(dashboard)/layout.tsx` - Added sign-out event with session reset
- `app/(dashboard)/pricing/submit-button.tsx` - Added checkout started event
- `app/api/stripe/checkout/route.ts` - Added server-side checkout completion event
- `app/api/stripe/webhook/route.ts` - Added subscription update/cancel events
- `app/(dashboard)/dashboard/security/page.tsx` - Added password update and account deletion events
- `app/(dashboard)/dashboard/general/page.tsx` - Added account update event
- `app/(dashboard)/dashboard/page.tsx` - Added team member invite/remove and manage subscription events

### Environment Variables
The following environment variables have been configured in `.env.local`:
- `NEXT_PUBLIC_POSTHOG_KEY` - Your PostHog API key
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host URL

## Next steps

### Recommended Dashboard & Insights

Create an "Analytics basics" dashboard in PostHog with the following insights:

1. **Sign-up to Subscription Funnel** - Track conversion from `user_signed_up` → `checkout_started` → `subscription_checkout_completed`
2. **User Retention Trend** - Monitor `user_signed_in` events over time to track returning users
3. **Churn Analysis** - Track `subscription_canceled` and `account_deleted` events to identify churn patterns
4. **Team Growth** - Monitor `team_member_invited` events to track team expansion
5. **Subscription Health** - Compare `subscription_checkout_completed` vs `subscription_canceled` to measure net subscription growth

Visit [PostHog Dashboards](https://us.posthog.com/dashboard) to create these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
