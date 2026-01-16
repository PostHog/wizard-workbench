# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js Pages Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the latest PostHog approach for Next.js 15.3+
- **Server-side tracking** via a reusable PostHog client helper in `lib/posthog-server.ts`
- **Reverse proxy** configured in `next.config.ts` to improve tracking reliability and avoid ad blockers
- **User identification** on both client-side (login/signup forms) and server-side (API routes)
- **Error tracking** enabled globally via `capture_exceptions: true` and specific error handlers

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `signed_in` | User successfully signed in to their account | `pages/api/auth/sign-in.ts` |
| `signed_up` | New user successfully created an account | `pages/api/auth/sign-up.ts` |
| `signed_out` | User signed out of their account | `components/header.tsx` |
| `checkout_started` | User initiated the checkout process for a pricing plan | `pages/pricing.tsx` |
| `checkout_session_created` | Checkout session was successfully created on the server | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | User subscription was updated via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `subscription_canceled` | User subscription was canceled via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `checkout_completed` | User completed checkout and subscription is active | `pages/api/stripe/checkout.ts` |
| `team_member_invited` | User invited a new team member | `pages/api/team/invite.ts` |
| `team_member_removed` | User removed a team member from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account information | `pages/api/account/update.ts` |
| `customer_portal_opened` | User opened Stripe customer portal to manage subscription | `pages/api/stripe/customer-portal.ts` |

## Files Created

| File | Purpose |
|------|---------|
| `.env` | Environment variables for PostHog API key and host |
| `instrumentation-client.ts` | Client-side PostHog initialization |
| `lib/posthog-server.ts` | Server-side PostHog client helper |

## Files Modified

| File | Changes |
|------|---------|
| `next.config.ts` | Added reverse proxy rewrites for PostHog |
| `pages/api/auth/sign-in.ts` | Added signed_in event and user identification |
| `pages/api/auth/sign-up.ts` | Added signed_up event and user identification |
| `components/header.tsx` | Added signed_out event and posthog.reset() |
| `components/login.tsx` | Added client-side identify call on successful login/signup |
| `pages/pricing.tsx` | Added checkout_started event and error tracking |
| `pages/api/stripe/create-checkout.ts` | Added checkout_session_created event |
| `pages/api/stripe/webhook.ts` | Added subscription_updated and subscription_canceled events |
| `pages/api/stripe/checkout.ts` | Added checkout_completed event |
| `pages/api/team/invite.ts` | Added team_member_invited event |
| `pages/api/team/remove-member.ts` | Added team_member_removed event |
| `pages/api/account/update.ts` | Added account_updated event and identify call |
| `pages/api/stripe/customer-portal.ts` | Added customer_portal_opened event |

## Next steps

### Recommended Dashboard Insights

Create a dashboard in PostHog with the following insights to track your key business metrics:

1. **Signup to Checkout Funnel** - Track conversion from `signed_up` → `checkout_started` → `checkout_completed`
2. **User Authentication Overview** - Count of `signed_in`, `signed_up`, and `signed_out` events over time
3. **Subscription Lifecycle** - Track `subscription_updated` and `subscription_canceled` events to monitor churn
4. **Team Collaboration** - Monitor `team_member_invited` and `team_member_removed` events
5. **Account Activity** - Track `account_updated` events and user engagement

### Environment Variables

Make sure to update your `.env` file with your actual PostHog credentials:

```
NEXT_PUBLIC_POSTHOG_KEY=your_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
