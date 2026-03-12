<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. Here's a summary of what was set up:

**Client-side:** PostHog is initialized via `instrumentation-client.ts` (Next.js 15.3+ approach) with a reverse proxy through `/ingest` to prevent tracking blockers. Exception capture is enabled for automatic error tracking. Users are identified client-side in the header layout when their session loads, and `posthog.reset()` is called on sign-out.

**Server-side:** A shared `lib/posthog-server.ts` helper provides a `getPostHogClient()` function using `posthog-node`. Server actions capture all critical business events — authentication, account management, and Stripe payment flows. The server also calls `posthog.identify()` on sign-in and sign-up to link events to known users.

**Environment:** `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` are stored in `.env.local`.

**New files created:**
- `instrumentation-client.ts` — client-side PostHog initialization
- `lib/posthog-server.ts` — server-side PostHog client helper

**Files modified:**
- `next.config.ts` — added `/ingest` reverse proxy rewrites
- `app/(login)/actions.ts` — auth and account management events
- `lib/payments/actions.ts` — checkout_started event
- `app/api/stripe/checkout/route.ts` — checkout_completed event
- `lib/payments/stripe.ts` — subscription lifecycle events
- `app/(dashboard)/layout.tsx` — client-side identify and reset

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully creates an account | `app/(login)/actions.ts` |
| `user_signed_in` | Fired when a user successfully signs in | `app/(login)/actions.ts` |
| `user_signed_out` | Fired when a user signs out | `app/(login)/actions.ts` |
| `checkout_started` | Fired when a user initiates a Stripe checkout session | `lib/payments/actions.ts` |
| `checkout_completed` | Fired when a user successfully completes a Stripe checkout | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired when a subscription becomes active or moves to trialing | `lib/payments/stripe.ts` |
| `subscription_cancelled` | Fired when a subscription is cancelled or becomes unpaid | `lib/payments/stripe.ts` |
| `password_updated` | Fired when a user successfully updates their password | `app/(login)/actions.ts` |
| `account_deleted` | Fired when a user successfully deletes their account | `app/(login)/actions.ts` |
| `team_member_invited` | Fired when a team owner sends an invitation | `app/(login)/actions.ts` |
| `team_member_removed` | Fired when a team member is removed from the team | `app/(login)/actions.ts` |
| `account_updated` | Fired when a user updates their account information | `app/(login)/actions.ts` |

## Next steps

Create a dashboard called **"Analytics basics"** in PostHog with these recommended insights:

- **[Signup-to-Checkout Funnel](https://us.posthog.com/project/2/insights/new)** — Funnel: `user_signed_up` → `checkout_started` → `checkout_completed`
- **[Daily Active Users](https://us.posthog.com/project/2/insights/new)** — Trend: `user_signed_in` unique users per day
- **[Subscription Health](https://us.posthog.com/project/2/insights/new)** — Trend: `subscription_updated` vs `subscription_cancelled` over time
- **[Churn Signals](https://us.posthog.com/project/2/insights/new)** — Trend: `subscription_cancelled` and `account_deleted` over time
- **[Team Growth](https://us.posthog.com/project/2/insights/new)** — Trend: `team_member_invited` vs `team_member_removed`

Navigate to your [PostHog dashboard](https://us.posthog.com/project/2/dashboard) to create these.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
