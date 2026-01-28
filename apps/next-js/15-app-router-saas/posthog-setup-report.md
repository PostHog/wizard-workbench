<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js App Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15.3+ approach
- **Server-side tracking** via a dedicated PostHog client factory (`lib/posthog-server.ts`)
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability
- **Environment variables** configured in `.env` for secure API key management
- **Event tracking** for all critical business actions including authentication, team management, and subscription lifecycle

## Events implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_in` | User successfully signed in to their account | `app/(login)/actions.ts` |
| `user_signed_up` | User successfully created a new account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `password_updated` | User successfully updated their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account | `app/(login)/actions.ts` |
| `account_updated` | User updated their account information (name/email) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invited a new member to the team | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `checkout_started` | User initiated checkout for a subscription plan | `lib/payments/actions.ts` |
| `checkout_completed` | User successfully completed checkout and subscription was created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription was updated or canceled via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `manage_subscription_clicked` | User clicked to manage their subscription in the customer portal | `lib/payments/actions.ts` |

## Files created/modified

### New files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client factory
- `.env` - Environment variables for PostHog configuration

### Modified files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `app/(login)/actions.ts` - Added server-side event tracking for auth and team actions
- `lib/payments/actions.ts` - Added checkout and subscription management events
- `app/api/stripe/checkout/route.ts` - Added checkout completion event and error tracking
- `app/api/stripe/webhook/route.ts` - Added subscription update event and error tracking

## Next steps

### Create your dashboard

With these events instrumented, you can now create powerful insights in PostHog:

1. **Sign-up to Checkout Funnel**: Track conversion from `user_signed_up` → `checkout_started` → `checkout_completed`
2. **User Retention**: Monitor `user_signed_in` events over time
3. **Churn Analysis**: Track `account_deleted` and `subscription_updated` (with status = canceled) events
4. **Team Growth**: Monitor `team_member_invited` events to understand team expansion
5. **Revenue Metrics**: Combine `checkout_completed` with subscription properties for revenue tracking

Visit your PostHog dashboard to create these insights: https://us.posthog.com

### Recommended insights to create

1. **Conversion Funnel**: `user_signed_up` → `checkout_started` → `checkout_completed`
2. **Weekly Active Users**: Trend of unique users performing `user_signed_in`
3. **Account Deletion Rate**: Trend of `account_deleted` events
4. **Team Invitation Activity**: Count of `team_member_invited` by team
5. **Subscription Status Changes**: Breakdown of `subscription_updated` by status

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
