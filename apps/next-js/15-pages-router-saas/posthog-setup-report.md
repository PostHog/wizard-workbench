# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` for automatic pageview tracking, session replay, and error tracking
- **Server-side tracking** using `posthog-node` SDK for API route events
- **Reverse proxy configuration** in `next.config.ts` to bypass ad blockers
- **User identification** on both client and server for correlated analytics
- **Error tracking** with `captureException` for monitoring critical failures

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | Tracks when a user successfully creates a new account | `pages/api/auth/sign-up.ts`, `components/login.tsx` |
| `user_signed_in` | Tracks when a user successfully signs in to their account | `pages/api/auth/sign-in.ts`, `components/login.tsx` |
| `user_signed_out` | Tracks when a user signs out of their account | `pages/api/auth/sign-out.ts`, `components/header.tsx` |
| `user_logged_in` | Client-side login event for session correlation | `components/login.tsx` |
| `user_logged_out` | Client-side logout event with PostHog reset | `components/header.tsx` |
| `checkout_started` | Tracks when a user initiates the checkout process | `pages/api/stripe/create-checkout.ts` |
| `checkout_completed` | Tracks when a user successfully completes checkout | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Tracks subscription updates via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Tracks subscription cancellations via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `customer_portal_accessed` | Tracks when a user accesses billing portal | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | Tracks when a user invites a team member | `pages/api/team/invite.ts` |
| `team_member_removed` | Tracks when a team member is removed | `pages/api/team/remove-member.ts` |
| `account_updated` | Tracks when account information is updated | `pages/api/account/update.ts` |
| `pricing_plan_clicked` | Tracks when a pricing plan is selected | `pages/pricing.tsx` |

## Files Created

| File | Purpose |
|------|---------|
| `instrumentation-client.ts` | Client-side PostHog initialization with error tracking |
| `lib/posthog-server.ts` | Server-side PostHog client singleton |
| `.env.local` | Environment variables for PostHog API key and host |

## Files Modified

| File | Changes |
|------|---------|
| `next.config.ts` | Added reverse proxy rewrites for `/ingest` path |
| `components/login.tsx` | Added user identification and login/signup events |
| `components/header.tsx` | Added logout event and PostHog reset |
| `pages/pricing.tsx` | Added pricing plan click tracking |
| `pages/api/auth/sign-up.ts` | Added server-side signup event and user identification |
| `pages/api/auth/sign-in.ts` | Added server-side signin event and user identification |
| `pages/api/auth/sign-out.ts` | Added server-side signout event |
| `pages/api/stripe/create-checkout.ts` | Added checkout started event |
| `pages/api/stripe/checkout.ts` | Added checkout completed event |
| `pages/api/stripe/webhook.ts` | Added subscription update/cancel events |
| `pages/api/stripe/customer-portal.ts` | Added customer portal access event |
| `pages/api/team/invite.ts` | Added team member invited event |
| `pages/api/team/remove-member.ts` | Added team member removed event |
| `pages/api/account/update.ts` | Added account updated event |

## Next steps

### Create your analytics dashboard

To create insights and dashboards for these events, visit your PostHog project and create:

1. **Signup to Checkout Funnel**: Track conversion from `user_signed_up` -> `pricing_plan_clicked` -> `checkout_started` -> `checkout_completed`
2. **User Retention**: Monitor `user_signed_in` events over time
3. **Churn Analysis**: Track `subscription_cancelled` events and correlate with user behavior
4. **Team Growth**: Monitor `team_member_invited` events
5. **Revenue Events**: Track `checkout_completed` with plan details

### Recommended dashboard insights

- **Conversion Funnel**: user_signed_up -> checkout_completed
- **Daily Active Users**: Unique users with user_signed_in events
- **Subscription Health**: subscription_updated vs subscription_cancelled ratio
- **Team Collaboration**: team_member_invited trends
- **Account Engagement**: account_updated frequency

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

The following environment variables have been configured in `.env.local`:

```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Make sure to add these to your deployment environment (Vercel, Netlify, etc.).
