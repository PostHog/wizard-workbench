<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 SaaS starter. The integration covers client-side initialization, user identification, server-side event tracking, and a reverse proxy — providing full visibility from sign-up through subscription and team management.

**Summary of changes:**

- **`instrumentation-client.ts`** (new): Initializes `posthog-js` for the browser using `instrumentation-client.ts` (Next.js 15.3+ recommended approach). Configured with a reverse proxy (`/ingest`), error tracking (`capture_exceptions: true`), and the `2026-01-30` defaults preset.
- **`next.config.ts`**: Added PostHog reverse proxy rewrites (`/ingest/*`, `/ingest/static/*`, `/ingest/array/*`) and `skipTrailingSlashRedirect: true` to improve event delivery reliability.
- **`lib/posthog.ts`** (new): Server-side PostHog client factory using `posthog-node`, with `flushAt: 1` and `flushInterval: 0` to ensure events flush immediately in serverless contexts.
- **`.env.local`**: Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- **`app/(dashboard)/layout.tsx`**: Added `posthog.identify()` in `UserMenu` via `useEffect` to identify the logged-in user whenever the dashboard loads. Added `posthog.reset()` to the sign-out handler to unlink the user session.
- **`app/(login)/actions.ts`**: Added server-side PostHog events for all key auth and team management actions (see table below). Includes `posthog.identify()` on sign-in and sign-up.
- **`app/(dashboard)/pricing/page.tsx`** + **`pricing-page-tracker.tsx`** (new): Client-side `pricing_page_viewed` event using a thin tracker component to preserve ISR (`revalidate = 3600`).
- **`lib/payments/actions.ts`**: Added `checkout_started` and `customer_portal_opened` server-side events.
- **`app/api/stripe/checkout/route.ts`**: Added `checkout_completed` server-side event after successful Stripe checkout, with plan and subscription details.
- **`app/api/stripe/webhook/route.ts`**: Added `subscription_updated` and `subscription_canceled` server-side events from Stripe webhook payloads.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully completed registration | `app/(login)/actions.ts` |
| `user_signed_in` | User authenticated and signed in | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `pricing_page_viewed` | User viewed the pricing page (top of funnel) | `app/(dashboard)/pricing/pricing-page-tracker.tsx` |
| `checkout_started` | User initiated a Stripe checkout | `lib/payments/actions.ts` |
| `checkout_completed` | Successful Stripe checkout completed | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription became active or trialing (webhook) | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Subscription canceled or became unpaid (webhook) | `app/api/stripe/webhook/route.ts` |
| `customer_portal_opened` | User opened the Stripe customer portal | `lib/payments/actions.ts` |
| `team_member_invited` | Team owner sent an invitation | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member | `app/(login)/actions.ts` |
| `invitation_accepted` | User accepted a team invitation during sign-up | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `password_updated` | User changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User permanently deleted their account | `app/(login)/actions.ts` |

## Next steps

To visualize user behavior, create an **"Analytics basics"** dashboard in PostHog with these insights:

1. **Subscription conversion funnel** — Funnel: `pricing_page_viewed` → `checkout_started` → `checkout_completed`
2. **New signups over time** — Trends: `user_signed_up` (daily/weekly)
3. **Sign-ins over time** — Trends: `user_signed_in` (daily/weekly)
4. **Subscription changes** — Trends: `subscription_updated` and `subscription_canceled` (stacked)
5. **Team growth** — Trends: `team_member_invited` and `invitation_accepted`

Navigate to [/dashboard](https://us.posthog.com/project/2/dashboard) in PostHog to create the dashboard manually, or re-run the wizard after adding `dashboard:write`, `insight:write`, and `query:read` scopes to your PostHog API key to have it created automatically.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
