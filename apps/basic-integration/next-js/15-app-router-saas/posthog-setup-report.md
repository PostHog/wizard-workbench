<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 App Router SaaS project. Here is a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — initializes posthog-js on the client using Next.js 15.3+ `instrumentation-client` convention, with reverse proxy, exception capture, and debug mode in development.
- `lib/posthog-server.ts` — a `getPostHogClient()` helper that creates a `posthog-node` client configured for short-lived server-side use (`flushAt: 1`, `flushInterval: 0`).

**Modified files:**
- `next.config.ts` — added reverse proxy rewrites for `/ingest/*` to route PostHog traffic through Next.js (reduces tracking-blocker impact), and set `skipTrailingSlashRedirect: true`.
- `.env.local` — added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- `app/(login)/actions.ts` — added server-side PostHog events for `user_signed_in`, `user_signed_up`, `user_signed_out`, `password_updated`, `account_deleted`, `team_member_invited`, and `team_member_removed`. Also calls `posthog.identify()` on sign-in and sign-up to link events to person profiles.
- `lib/payments/actions.ts` — added `checkout_started` event when a user initiates checkout.
- `app/api/stripe/checkout/route.ts` — added `checkout_completed` event after a successful Stripe checkout session.
- `app/api/stripe/webhook/route.ts` — added `subscription_updated` event when Stripe sends subscription updated/deleted webhooks.
- `app/(dashboard)/pricing/submit-button.tsx` — added client-side `pricing_plan_selected` event captured on button click, passing the `priceId`.
- `app/(dashboard)/pricing/page.tsx` — passes `priceId` prop to `SubmitButton` for tracking.
- `app/(dashboard)/dashboard/page.tsx` — added client-side `manage_subscription_clicked` event on the Manage Subscription button.
- `app/(dashboard)/dashboard/layout.tsx` — added `PostHogIdentify` component that calls `posthog.identify()` with the authenticated user's ID, email, and name once user data loads. This links all client-side events to the known user.
- `app/(dashboard)/layout.tsx` — added `posthog.reset()` call on sign-out to unlink the session from the user.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in | `app/(login)/actions.ts` |
| `user_signed_up` | User successfully created account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out | `app/(login)/actions.ts` |
| `password_updated` | User updated their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sent invitation | `app/(login)/actions.ts` |
| `team_member_removed` | Team member was removed | `app/(login)/actions.ts` |
| `checkout_started` | User initiated subscription checkout | `lib/payments/actions.ts` |
| `checkout_completed` | Checkout succeeded, subscription created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription changed via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `pricing_plan_selected` | User clicked Get Started on a plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `manage_subscription_clicked` | User opened Stripe customer portal | `app/(dashboard)/dashboard/page.tsx` |

## Next steps

Build insights and a dashboard for your "Analytics basics" view in PostHog using the events above. Here are five recommended insights:

- **Checkout conversion funnel** — Funnel: `pricing_plan_selected` → `checkout_started` → `checkout_completed`
  [Create insight](https://us.posthog.com/project/2/insights/new)

- **Sign-ups over time** — Trends: `user_signed_up` by day
  [Create insight](https://us.posthog.com/project/2/insights/new)

- **Churn events** — Trends: `account_deleted` and `subscription_updated` (filter `status = canceled`) over time
  [Create insight](https://us.posthog.com/project/2/insights/new)

- **Team growth** — Trends: `team_member_invited` over time
  [Create insight](https://us.posthog.com/project/2/insights/new)

- **Authentication breakdown** — Trends: `user_signed_in` vs `user_signed_up` stacked by day
  [Create insight](https://us.posthog.com/project/2/insights/new)

Once created, add them to a new **"Analytics basics"** dashboard:
[Create dashboard](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
