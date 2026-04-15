<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was already substantially instrumented — the wizard extended coverage by adding failure-path events and a conversion funnel entry point. The `instrumentation-client.ts` (client-side SDK init with `capture_exceptions: true`), `next.config.ts` (reverse proxy rewrites for reliable delivery), and `lib/posthog-server.ts` (server-side client) were already correctly configured and required no changes. New event captures were added to `app/(login)/actions.ts` and a new `pricing-tracker.tsx` client component fires `pricing_page_viewed` from the pricing page.

| Event | Description | File |
|---|---|---|
| `sign_in_failed` | User attempted sign-in with invalid credentials; `reason` property distinguishes `user_not_found` vs `invalid_password` | `app/(login)/actions.ts` |
| `sign_up_failed` | User attempted sign-up with an email that already exists | `app/(login)/actions.ts` |
| `pricing_page_viewed` | User landed on the pricing page — top of the subscription conversion funnel; includes plan names, price IDs, amounts, and intervals | `app/(dashboard)/pricing/pricing-tracker.tsx` |
| `user_signed_in` | User successfully signs in (pre-existing) | `app/(login)/actions.ts` |
| `user_signed_up` | New user completes registration (pre-existing) | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out (pre-existing) | `app/(login)/actions.ts` |
| `invitation_accepted` | User signs up via an invitation link (pre-existing) | `app/(login)/actions.ts` |
| `password_updated` | User changes their password (pre-existing) | `app/(login)/actions.ts` |
| `account_updated` | User updates their name or email (pre-existing) | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account — churn signal (pre-existing) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sends a new member invitation (pre-existing) | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removes a member (pre-existing) | `app/(login)/actions.ts` |
| `checkout_initiated` | User starts the Stripe checkout flow (pre-existing) | `lib/payments/actions.ts` |
| `checkout_completed` | Stripe checkout succeeds and subscription is saved (pre-existing) | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook signals a subscription change (pre-existing) | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Stripe webhook signals a subscription cancellation (pre-existing) | `app/api/stripe/webhook/route.ts` |
| `customer_portal_opened` | User opens the Stripe billing portal (pre-existing) | `lib/payments/actions.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Subscription conversion funnel** — Funnel: `pricing_page_viewed` → `checkout_initiated` → `checkout_completed`
   [Create funnel insight →](https://us.posthog.com/project/2/insights/new#funnel)

2. **Sign-in failure rate** — Trend: `sign_in_failed` broken down by `reason` property (`user_not_found` vs `invalid_password`)
   [Create trend insight →](https://us.posthog.com/project/2/insights/new#trends)

3. **Sign-up success vs failure** — Trend: `user_signed_up` vs `sign_up_failed` to track registration health
   [Create trend insight →](https://us.posthog.com/project/2/insights/new#trends)

4. **Churn signals** — Trend: `subscription_canceled` and `account_deleted` over time
   [Create trend insight →](https://us.posthog.com/project/2/insights/new#trends)

5. **Team growth** — Trend: `team_member_invited` and `invitation_accepted` to measure expansion
   [Create trend insight →](https://us.posthog.com/project/2/insights/new#trends)

[Open PostHog dashboards →](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
