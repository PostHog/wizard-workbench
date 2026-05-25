<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS application. The following changes were made:

- **`instrumentation-client.ts`** — Added to initialize posthog-js client-side using Next.js 15.3+ instrumentation. Configured with a reverse proxy (`/ingest`), exception capture, and the `2026-01-30` defaults preset.
- **`next.config.ts`** — Added reverse proxy rewrites for PostHog (`/ingest/static/*`, `/ingest/array/*`, `/ingest/*`) to improve reliability and reduce ad-blocker interference.
- **`lib/posthog-server.ts`** — New helper that creates a `posthog-node` client for server-side event capture (used in Server Actions and API routes).
- **`app/(dashboard)/layout.tsx`** — Added `posthog.identify()` in `UserMenu` to link the authenticated user's database ID to their PostHog profile on every dashboard load. Added `posthog.reset()` on sign-out to unlink the session.
- **`app/(login)/actions.ts`** — Added server-side PostHog capture for all critical auth and account events: sign-in, sign-up, sign-out, password update, account update, account deletion, team member invitation, and team member removal.
- **`app/api/stripe/checkout/route.ts`** — Added `subscription_activated` event capture after a successful Stripe checkout session completes.
- **`app/api/stripe/webhook/route.ts`** — Added `subscription_updated` event capture on Stripe subscription webhook events.
- **`app/(dashboard)/pricing/pricing-tracker.tsx`** — New client component that fires `pricing_page_viewed` when the pricing page is rendered (top of conversion funnel).
- **`app/(dashboard)/pricing/submit-button.tsx`** — Added `checkout_started` capture on click, with the plan name as a property.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticates | `app/(login)/actions.ts` |
| `user_signed_up` | New user creates an account | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out | `app/(login)/actions.ts` |
| `pricing_page_viewed` | User views the pricing page (funnel top) | `app/(dashboard)/pricing/pricing-tracker.tsx` |
| `checkout_started` | User clicks "Get Started" on a plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `subscription_activated` | Stripe checkout completes successfully | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription status changes via webhook | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Team owner sends an invitation | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removes a member | `app/(login)/actions.ts` |
| `account_updated` | User updates their profile | `app/(login)/actions.ts` |
| `password_updated` | User changes their password | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account | `app/(login)/actions.ts` |

## Next steps

To visualize the tracked events, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Signup-to-subscription funnel** — Funnel insight with steps: `user_signed_up` → `pricing_page_viewed` → `checkout_started` → `subscription_activated`
2. **Daily active signups** — Trends insight tracking `user_signed_up` over time
3. **Sign-in volume** — Trends insight tracking `user_signed_in` over time to monitor engagement
4. **Subscription activations** — Trends insight tracking `subscription_activated` over time, broken down by `plan_name`
5. **Churn signal** — Trends insight tracking `account_deleted` + `subscription_updated` (with `subscription_status: canceled`) over time

Visit your [PostHog project](https://us.posthog.com/project/2/dashboard) to create these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
