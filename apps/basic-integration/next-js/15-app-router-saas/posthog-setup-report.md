<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS starter. The integration covers both client-side and server-side tracking, user identification, and a reverse proxy configuration to improve event delivery reliability.

**Key changes made:**

- **`instrumentation-client.ts`** — Initializes PostHog JS on the client using the `instrumentation-client` pattern (Next.js 15.3+ recommended approach). Configured with a reverse proxy (`/ingest`), exception capture enabled, and the `2026-01-30` defaults snapshot.
- **`next.config.ts`** — Added rewrites to proxy `/ingest/*` and `/ingest/static/*` and `/ingest/array/*` to PostHog's CDN and ingestion endpoints, reducing ad-blocker interference.
- **`lib/posthog-server.ts`** — Singleton server-side PostHog Node.js client used across all Server Actions and API routes. Uses `flushAt: 1` and `flushInterval: 0` to ensure events are sent immediately in short-lived server functions.
- **`app/(login)/actions.ts`** — Server-side events and `identify` calls added across all authentication and account management Server Actions.
- **`lib/payments/stripe.ts`** — `checkout_started` event captured when a user initiates a Stripe checkout session. `subscription_updated` and `subscription_canceled` events captured inside `handleSubscriptionChange` when Stripe webhooks arrive.
- **`app/api/stripe/checkout/route.ts`** — `subscription_activated` event captured after a successful Stripe checkout completes and the team's subscription is recorded.
- **`app/(dashboard)/pricing/page.tsx`** — `pricing_viewed` event captured server-side as a top-of-funnel signal (supports both authenticated and anonymous visitors).
- **`app/(dashboard)/layout.tsx`** — Client-side `posthog.identify()` called in the `UserMenu` component whenever a logged-in user's data loads, linking the anonymous PostHog session to the known user. `posthog.reset()` called on sign-out to unlink the session.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user successfully creates an account | `app/(login)/actions.ts` |
| `user_signed_in` | Existing user successfully signs in | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out | `app/(login)/actions.ts` |
| `pricing_viewed` | User views the pricing page (top of conversion funnel) | `app/(dashboard)/pricing/page.tsx` |
| `checkout_started` | User initiates a Stripe checkout session | `lib/payments/stripe.ts` |
| `subscription_activated` | Stripe checkout succeeds; subscription recorded in DB | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook: subscription becomes active or trialing | `lib/payments/stripe.ts` |
| `subscription_canceled` | Stripe webhook: subscription is canceled or unpaid | `lib/payments/stripe.ts` |
| `team_member_invited` | Team owner sends an invitation to a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Team member is removed from the team | `app/(login)/actions.ts` |
| `account_updated` | User updates their name or email | `app/(login)/actions.ts` |
| `password_updated` | User successfully changes their password | `app/(login)/actions.ts` |
| `account_deleted` | User permanently deletes their account | `app/(login)/actions.ts` |

## Next steps

We've instrumented 13 events covering the full user lifecycle — from acquisition through subscription and churn. To visualize them, create an **"Analytics basics"** dashboard in PostHog ([/dashboard](/dashboard)) with the following recommended insights:

1. **Signup → Checkout conversion funnel** — `user_signed_up` → `pricing_viewed` → `checkout_started` → `subscription_activated`
2. **New signups over time** — Trend of `user_signed_up` events
3. **Subscription activations over time** — Trend of `subscription_activated` events
4. **Churn events over time** — Trend of `subscription_canceled` events
5. **Team growth** — Trend of `team_member_invited` events

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
