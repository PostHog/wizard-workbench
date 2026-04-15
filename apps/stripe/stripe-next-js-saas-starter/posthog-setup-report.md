<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 SaaS Starter. PostHog is now initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to improve event delivery reliability. A server-side PostHog client (`lib/posthog-server.ts`) handles event capture in Server Actions and API routes. Users are identified both client-side (in `app/(dashboard)/layout.tsx` via the SWR `onSuccess` hook) and server-side (on sign-in and sign-up), using the database user ID as the distinct ID for consistent cross-domain correlation. Error tracking is enabled via `capture_exceptions: true` in the client init.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in | `app/(login)/actions.ts` |
| `user_signed_up` | New user completes registration | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out | `app/(login)/actions.ts` |
| `invitation_accepted` | User signs up via an invitation link | `app/(login)/actions.ts` |
| `password_updated` | User changes their password | `app/(login)/actions.ts` |
| `account_updated` | User updates their name or email | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account (churn signal) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sends a new member invitation | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removes a member | `app/(login)/actions.ts` |
| `checkout_initiated` | User starts the Stripe checkout flow | `lib/payments/actions.ts` |
| `checkout_completed` | Stripe checkout succeeds and subscription is saved | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook signals a subscription change | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Stripe webhook signals a subscription cancellation | `app/api/stripe/webhook/route.ts` |
| `customer_portal_opened` | User opens the Stripe billing portal | `lib/payments/actions.ts` |

## Next steps

To explore your analytics, visit your PostHog project and create insights for these key events:

- **Dashboard**: https://us.posthog.com/project/2/dashboards
- **Signup → Checkout Conversion Funnel**: Create a funnel from `user_signed_up` → `checkout_initiated` → `checkout_completed`
- **New Sign-ups Over Time**: Trend of `user_signed_up` events
- **Account Deletions (Churn)**: Trend of `account_deleted` events
- **Subscription Events**: Breakdown of `checkout_completed` vs `subscription_canceled`
- **Daily Active Users**: Trend of `user_signed_in` events

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
