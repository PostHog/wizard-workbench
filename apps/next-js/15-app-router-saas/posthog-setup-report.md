<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS application. Here is a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization using Next.js 15's instrumentation hook with a reverse proxy (`/ingest`) for improved reliability
- `lib/posthog-server.ts` — Reusable server-side PostHog client factory for API routes and Server Actions
- `app/(dashboard)/pricing/pricing-tracker.tsx` — Lightweight client component that fires `pricing_page_viewed` without making the ISR pricing page dynamic

**Modified files:**
- `next.config.ts` — Added reverse proxy rewrites for PostHog ingestion (`/ingest/*`)
- `app/(login)/actions.ts` — Added server-side PostHog events for all authentication and account management actions; also calls `posthog.identify()` on sign-in and sign-up
- `app/(dashboard)/layout.tsx` — Added client-side `posthog.identify()` when user data loads from SWR; added `posthog.reset()` on sign-out
- `lib/payments/actions.ts` — Added `checkout_initiated` and `customer_portal_accessed` events
- `app/api/stripe/checkout/route.ts` — Added `checkout_completed` event after successful Stripe checkout
- `app/api/stripe/webhook/route.ts` — Added `subscription_updated` and `subscription_cancelled` events for Stripe webhook handlers
- `app/(dashboard)/pricing/page.tsx` — Added `PricingPageTracker` client component to capture pricing page views

**Environment variables configured** (`.env.local`):
- `NEXT_PUBLIC_POSTHOG_TOKEN`
- `NEXT_PUBLIC_POSTHOG_HOST`

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully created an account | `app/(login)/actions.ts` |
| `user_signed_in` | An existing user successfully authenticated | `app/(login)/actions.ts` |
| `user_signed_out` | A user signed out of their account | `app/(login)/actions.ts` |
| `account_updated` | A user updated their account name or email | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their password | `app/(login)/actions.ts` |
| `account_deleted` | A user deleted their account (churn event) | `app/(login)/actions.ts` |
| `team_member_invited` | A team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team | `app/(login)/actions.ts` |
| `checkout_initiated` | A user started the Stripe checkout flow for a subscription plan | `lib/payments/actions.ts` |
| `customer_portal_accessed` | A user opened the Stripe customer billing portal | `lib/payments/actions.ts` |
| `checkout_completed` | A user successfully completed checkout and has an active subscription (conversion event) | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A subscription was updated via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | A subscription was cancelled via Stripe webhook (churn event) | `app/api/stripe/webhook/route.ts` |
| `pricing_page_viewed` | A user viewed the pricing page (top of conversion funnel) | `app/(dashboard)/pricing/pricing-tracker.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/238460/dashboard/1404604
- **Sign-ups over time**: https://us.posthog.com/project/238460/insights/pfFGsl6a
- **Sign-up to paid conversion funnel**: https://us.posthog.com/project/238460/insights/zWVfgWke
- **Daily active users (sign-ins)**: https://us.posthog.com/project/238460/insights/S0QuWCyd
- **Subscription cancellations**: https://us.posthog.com/project/238460/insights/y6utAfdy
- **User retention (sign-up cohorts)**: https://us.posthog.com/project/238460/insights/tubN4PXT

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
