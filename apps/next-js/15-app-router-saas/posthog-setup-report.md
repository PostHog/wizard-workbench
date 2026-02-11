# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 App Router SaaS application. This integration includes:

- **Client-side initialization** via `instrumentation-client.ts` for automatic pageview tracking, session replay, and error tracking
- **Server-side PostHog client** via `lib/posthog-server.ts` for capturing critical backend events
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability by routing through your domain
- **User identification** on sign-in and sign-up forms to link anonymous and authenticated sessions
- **Event tracking** across authentication, payments, team management, and account settings

## Events implemented

| Event Name | Description | File |
|------------|-------------|------|
| `sign_up_submitted` | User submits the sign-up form to create an account | `app/(login)/login.tsx` |
| `sign_in_submitted` | User submits the sign-in form to log into their account | `app/(login)/login.tsx` |
| `pricing_plan_selected` | User clicks to start checkout for a pricing plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | User successfully completes Stripe checkout (server-side) | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription status changes via Stripe webhook (server-side) | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | User cancels their subscription via Stripe webhook (server-side) | `app/api/stripe/webhook/route.ts` |
| `manage_subscription_clicked` | User clicks to manage their subscription via Stripe customer portal | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_invited` | User invites a new team member | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_removed` | User removes a team member from the team | `app/(dashboard)/dashboard/page.tsx` |
| `password_updated` | User successfully updates their password | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_deletion_requested` | User requests to delete their account | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_updated` | User updates their account information (name/email) | `app/(dashboard)/dashboard/general/page.tsx` |

## Files created

| File | Purpose |
|------|---------|
| `instrumentation-client.ts` | PostHog client-side initialization for Next.js 15.3+ |
| `lib/posthog-server.ts` | PostHog server-side client for API routes |
| `.env.local` | Environment variables for PostHog API key and host |

## Files modified

| File | Changes |
|------|---------|
| `next.config.ts` | Added reverse proxy rewrites for PostHog and `skipTrailingSlashRedirect` |
| `app/(login)/login.tsx` | Added user identification and sign-in/sign-up events |
| `app/(dashboard)/pricing/submit-button.tsx` | Added pricing plan selection event |
| `app/(dashboard)/dashboard/page.tsx` | Added team management and subscription events |
| `app/(dashboard)/dashboard/security/page.tsx` | Added password and account deletion events |
| `app/(dashboard)/dashboard/general/page.tsx` | Added account update event |
| `app/api/stripe/checkout/route.ts` | Added server-side checkout completion event |
| `app/api/stripe/webhook/route.ts` | Added server-side subscription events |

## Next steps

### Create a dashboard

Create a new dashboard in PostHog named "Analytics basics" with the following suggested insights:

1. **Sign-up to Checkout Funnel**: Track conversion from `sign_up_submitted` → `pricing_plan_selected` → `checkout_completed`
2. **Authentication Events**: Trend chart showing `sign_in_submitted` and `sign_up_submitted` over time
3. **Subscription Health**: Track `subscription_updated` vs `subscription_canceled` events
4. **Team Engagement**: Count of `team_member_invited` and `team_member_removed` events
5. **Account Activity**: Trend of `account_updated`, `password_updated`, and `account_deletion_requested`

You can create these insights at: https://us.i.posthog.com/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Configuration

Your PostHog integration is configured with:
- **API Key**: Environment variable `NEXT_PUBLIC_POSTHOG_KEY`
- **Host**: Environment variable `NEXT_PUBLIC_POSTHOG_HOST` (https://us.i.posthog.com)
- **Reverse Proxy**: Enabled via `/ingest` path to improve tracking reliability
