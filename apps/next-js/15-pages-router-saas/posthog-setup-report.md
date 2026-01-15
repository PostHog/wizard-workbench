# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js Pages Router SaaS application. This integration includes:

- **Client-side tracking** via `instrumentation-client.ts` using `posthog-js`
- **Server-side tracking** via `lib/posthog-server.ts` using `posthog-node`
- **Reverse proxy configuration** in `next.config.ts` to avoid ad blockers
- **User identification** on both client and server for correlated analytics
- **Error tracking** with `capture_exceptions` enabled and manual error capture
- **Environment variables** configured in `.env` for the PostHog API key and host

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | Tracks when a new user successfully registers for an account | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | Tracks when a user successfully signs in to their account | `pages/api/auth/sign-in.ts` |
| `checkout_started` | Tracks when a user initiates a checkout session for a pricing plan | `pages/api/stripe/create-checkout.ts` |
| `checkout_completed` | Tracks when a user completes the checkout process successfully | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Tracks when a subscription is updated via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Tracks when a subscription is cancelled via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Tracks when a team member is invited to join the team | `pages/api/team/invite.ts` |
| `team_member_removed` | Tracks when a team member is removed from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | Tracks when a user updates their account information | `pages/api/account/update.ts` |
| `pricing_plan_selected` | Tracks when a user clicks to get started with a pricing plan | `pages/pricing.tsx` |
| `sign_in_form_submitted` | Tracks when a user submits the sign-in form (client-side) | `components/login.tsx` |
| `sign_up_form_submitted` | Tracks when a user submits the sign-up form (client-side) | `components/login.tsx` |

## Files Created

| File | Purpose |
|------|---------|
| `instrumentation-client.ts` | Client-side PostHog initialization |
| `lib/posthog-server.ts` | Server-side PostHog client singleton |
| `.env` | Environment variables for PostHog configuration |

## Files Modified

| File | Changes |
|------|---------|
| `next.config.ts` | Added reverse proxy rewrites for `/ingest` |
| `pages/api/auth/sign-in.ts` | Added sign-in event tracking and user identification |
| `pages/api/auth/sign-up.ts` | Added sign-up event tracking and user identification |
| `pages/api/stripe/create-checkout.ts` | Added checkout started event tracking |
| `pages/api/stripe/checkout.ts` | Added checkout completed event tracking |
| `pages/api/stripe/webhook.ts` | Added subscription update/cancel event tracking |
| `pages/api/team/invite.ts` | Added team member invited event tracking |
| `pages/api/team/remove-member.ts` | Added team member removed event tracking |
| `pages/api/account/update.ts` | Added account updated event tracking |
| `components/login.tsx` | Added client-side form submission tracking and identify |
| `pages/pricing.tsx` | Added pricing plan selection tracking |

## Next steps

Create a dashboard in PostHog to monitor your key metrics. We recommend creating the following insights:

1. **Sign-up to Checkout Funnel** - Track conversion from `user_signed_up` -> `pricing_plan_selected` -> `checkout_started` -> `checkout_completed`
2. **User Sign-ups Over Time** - Trend of `user_signed_up` events
3. **Subscription Churn** - Track `subscription_cancelled` events over time
4. **Team Growth** - Track `team_member_invited` events
5. **Active Users** - Track daily/weekly active users based on sign-in events

Visit your PostHog dashboard at: https://us.posthog.com

### Recommended Dashboard Insights

To create your "Analytics basics" dashboard:

1. Go to PostHog > Dashboards > New Dashboard
2. Name it "Analytics basics"
3. Add the following insights:
   - **Conversion Funnel**: `user_signed_up` -> `checkout_started` -> `checkout_completed`
   - **Sign-ups Trend**: Line chart of `user_signed_up` over time
   - **Subscription Health**: Track `subscription_updated` vs `subscription_cancelled`
   - **Team Engagement**: Count of `team_member_invited` events
   - **User Authentication**: Compare `sign_in_form_submitted` success vs failure rates

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

Make sure the following environment variables are set in your production environment:

```
NEXT_PUBLIC_POSTHOG_KEY=<your-posthog-project-api-key>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```
