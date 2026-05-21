<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS application. Here is a summary of all changes made:

## Changes made

### New files created
- **`instrumentation-client.ts`** — Initializes PostHog client-side using Next.js 15.3+ instrumentation API. Enables autocapture, session replay, and exception tracking via a reverse proxy at `/ingest`.
- **`lib/posthog-server.ts`** — Singleton PostHog Node.js client for server-side event capture. Used in Server Actions and API routes.
- **`components/posthog-user-identify.tsx`** — Client component that calls `posthog.identify()` when a logged-in user's data is available via SWR, keeping client and server event streams correlated.
- **`components/pricing-page-tracker.tsx`** — Client component that fires `pricing_page_viewed` on mount, marking the top of the payment conversion funnel.

### Modified files
- **`next.config.ts`** — Added PostHog reverse proxy rewrites (`/ingest/*` → `us.i.posthog.com`) and `skipTrailingSlashRedirect: true`.
- **`app/layout.tsx`** — Imported and rendered `<PostHogUserIdentify />` inside the SWRConfig, so every authenticated page session identifies the user in PostHog.
- **`app/(login)/actions.ts`** — Added server-side PostHog events and `identify` calls for all auth and team management actions.
- **`lib/payments/actions.ts`** — Added `checkout_started` event when a user initiates a Stripe checkout.
- **`app/api/stripe/checkout/route.ts`** — Added `checkout_completed` event after a successful Stripe checkout session.
- **`app/api/stripe/webhook/route.ts`** — Added `subscription_changed` event on Stripe subscription webhook events.
- **`app/(dashboard)/pricing/page.tsx`** — Added `<PricingPageTracker />` to fire `pricing_page_viewed` when the pricing page loads.

### Environment variables
Added to `.env.local`:
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` — PostHog project token (used by both client and server SDKs)
- `NEXT_PUBLIC_POSTHOG_HOST` — PostHog ingest host (`https://us.i.posthog.com`)

---

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | New user creates an account (with or without team invite) | `app/(login)/actions.ts` |
| `user_signed_in` | User authenticates with email and password | `app/(login)/actions.ts` |
| `user_signed_out` | User logs out | `app/(login)/actions.ts` |
| `checkout_started` | User initiates a Stripe checkout session from the pricing page | `lib/payments/actions.ts` |
| `checkout_completed` | Stripe redirects user back after successful payment | `app/api/stripe/checkout/route.ts` |
| `subscription_changed` | Stripe webhook fires on subscription update or cancellation | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Team owner sends an invitation to a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Team member is removed from the team | `app/(login)/actions.ts` |
| `password_updated` | User successfully changes their password | `app/(login)/actions.ts` |
| `account_deleted` | User soft-deletes their account — key churn signal | `app/(login)/actions.ts` |
| `account_updated` | User updates name or email in general settings | `app/(login)/actions.ts` |
| `pricing_page_viewed` | User views the pricing page — top of payment funnel | `app/(dashboard)/pricing/page.tsx` |

---

## Next steps

We've identified the "Analytics basics" dashboard for you to keep an eye on user behavior based on the events just instrumented. We recommend building the following insights there:

- **Payment conversion funnel**: `pricing_page_viewed` → `checkout_started` → `checkout_completed`
- **New signups over time**: Trend of `user_signed_up` (daily/weekly)
- **Sign-in activity**: Trend of `user_signed_in` (daily active users proxy)
- **Churn signals**: Trend of `account_deleted` events
- **Viral growth**: Trend of `team_member_invited` events

**Dashboard**: https://us.posthog.com/project/2/dashboard/1053460

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
