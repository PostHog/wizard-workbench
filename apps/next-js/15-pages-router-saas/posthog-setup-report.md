# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router SaaS application. The integration includes:

- **Client-side tracking** via `instrumentation-client.ts` using the `posthog-js` SDK
- **Server-side tracking** via `lib/posthog-server.ts` using the `posthog-node` SDK
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability
- **User identification** on both client and server sides during authentication flows
- **Error tracking** with `posthog.captureException()` in critical user flows
- **Environment variables** configured in `.env` for secure API key management

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User successfully created a new account | `pages/api/auth/sign-up.ts`, `components/login.tsx` |
| `user_signed_in` | User successfully logged in to their account | `pages/api/auth/sign-in.ts`, `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `user_logged_in` | Client-side login event | `components/login.tsx` |
| `checkout_started` | User initiated the checkout process for a subscription | `pages/api/stripe/create-checkout.ts` |
| `checkout_completed` | User successfully completed checkout and subscription is active | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | User's subscription was updated via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | User's subscription was cancelled via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner invited a new member to the team | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removed a member from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account information | `pages/api/account/update.ts` |
| `pricing_plan_selected` | User clicked to select a pricing plan | `pages/pricing.tsx` |
| `manage_subscription_clicked` | User clicked to manage their subscription in the dashboard | `pages/dashboard/index.tsx` |
| `invitation_accepted` | User signed up via a team invitation link | `pages/api/auth/sign-up.ts` |

## Files Modified

| File | Changes |
|------|---------|
| `instrumentation-client.ts` | Created - PostHog client-side initialization |
| `lib/posthog-server.ts` | Created - Server-side PostHog client helper |
| `next.config.ts` | Updated - Added reverse proxy rewrites for PostHog |
| `.env` | Updated - Added PostHog environment variables |
| `pages/api/auth/sign-in.ts` | Updated - Added server-side sign-in tracking and user identification |
| `pages/api/auth/sign-up.ts` | Updated - Added server-side sign-up tracking and user identification |
| `pages/api/stripe/create-checkout.ts` | Updated - Added checkout_started event |
| `pages/api/stripe/checkout.ts` | Updated - Added checkout_completed event |
| `pages/api/stripe/webhook.ts` | Updated - Added subscription tracking events |
| `pages/api/team/invite.ts` | Updated - Added team_member_invited event |
| `pages/api/team/remove-member.ts` | Updated - Added team_member_removed event |
| `pages/api/account/update.ts` | Updated - Added account_updated event |
| `pages/pricing.tsx` | Updated - Added pricing_plan_selected event and error tracking |
| `pages/dashboard/index.tsx` | Updated - Added manage_subscription_clicked event and error tracking |
| `components/header.tsx` | Updated - Added user_signed_out event with posthog.reset() |
| `components/login.tsx` | Updated - Added client-side user identification and login/signup events |

## Next steps

We've set up comprehensive event tracking for your SaaS application. To view your analytics:

1. Visit your PostHog dashboard at: https://us.posthog.com
2. Navigate to "Events" to see real-time event tracking
3. Create custom insights based on the events above

### Recommended Insights to Create

1. **Signup Funnel**: `pricing_plan_selected` → `user_signed_up` → `checkout_completed`
2. **Retention Analysis**: Track `user_signed_in` events over time
3. **Churn Tracking**: Monitor `subscription_cancelled` events
4. **Team Growth**: Track `team_member_invited` and `invitation_accepted` events
5. **Engagement**: `manage_subscription_clicked` and `account_updated` activity

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
