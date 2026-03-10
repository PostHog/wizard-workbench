<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the Next.js 15.3+ instrumentation pattern. Enables automatic exception capture and a reverse proxy via `/ingest`.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node` for capturing events in Server Actions and API routes.
- **`next.config.ts`**: Added `/ingest` reverse proxy rewrites so PostHog requests are routed through the app (avoids ad-blockers, improves reliability).
- **`app/(login)/actions.ts`**: Added server-side PostHog event capture and `identify()` calls across all auth and account management actions.
- **`app/api/stripe/checkout/route.ts`**: Added `checkout_initiated` event after a successful Stripe checkout session is confirmed.
- **`app/api/stripe/webhook/route.ts`**: Added `subscription_updated` and `subscription_cancelled` events triggered by Stripe webhooks.
- **`app/(dashboard)/pricing/pricing-tracker.tsx`** (new): Lightweight client component that fires `pricing_page_viewed` on mount.
- **`app/(dashboard)/pricing/page.tsx`**: Imports and renders `PricingTracker` to capture pricing page views.
- **`.env.local`**: Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in | `app/(login)/actions.ts` |
| `user_signed_up` | New user account created | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invites a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Team member is removed | `app/(login)/actions.ts` |
| `account_updated` | User updates name or email | `app/(login)/actions.ts` |
| `password_updated` | User successfully changes password | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account (churn signal) | `app/(login)/actions.ts` |
| `checkout_initiated` | Stripe checkout session completed successfully | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription updated via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Subscription cancelled via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `pricing_page_viewed` | Pricing page viewed (top of conversion funnel) | `app/(dashboard)/pricing/pricing-tracker.tsx` |

## Next steps

To build an "Analytics basics" dashboard in PostHog, create a new dashboard and add the following insights:

1. **Signup trend** — Trend chart for `user_signed_up` over time. Tracks user acquisition.
2. **Pricing → Signup conversion funnel** — Funnel: `pricing_page_viewed` → `user_signed_up` → `checkout_initiated`. Shows where users drop off in the conversion flow.
3. **Subscription cancellations (churn)** — Trend chart for `subscription_cancelled` over time. Key churn signal.
4. **Active users** — Unique users who triggered `user_signed_in` per day/week. Engagement baseline.
5. **Team growth** — Trend chart for `team_member_invited` over time. Indicates product-led growth and viral loops.

You can create this dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
