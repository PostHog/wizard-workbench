<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS application. The integration covers both **client-side** and **server-side** event tracking across the full user lifecycle: authentication, account management, team operations, and Stripe billing.

## What was set up

- **`instrumentation-client.ts`** — Client-side PostHog initialization using the Next.js 15.3+ `instrumentation-client` approach. Includes exception capture (error tracking) and a reverse proxy via `/ingest`.
- **`lib/posthog-server.ts`** — Singleton server-side PostHog client using `posthog-node` for tracking events in Server Actions and API routes.
- **`next.config.ts`** — Added `/ingest` reverse proxy rewrites so PostHog requests route through your domain (improves ad-blocker resistance and data quality).
- **`.env.local`** — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`app/(login)/login.tsx`** — Client-side `posthog.identify()` called on form submit to associate the PostHog session with the user's email before the server action fires.
- **`app/(dashboard)/layout.tsx`** — `posthog.reset()` called on sign-out to clear the identified user session from the browser.
- **`app/(dashboard)/pricing/pricing-tracker.tsx`** — Thin client component that fires `pricing_viewed` when the pricing page renders (top of conversion funnel).
- **`app/(dashboard)/pricing/page.tsx`** — Includes `<PricingViewTracker />`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticated with email/password | `app/(login)/actions.ts` |
| `user_signed_up` | New user account created (with `via_invitation` flag) | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `password_updated` | User changed their password via security settings | `app/(login)/actions.ts` |
| `account_deleted` | User soft-deleted their account | `app/(login)/actions.ts` |
| `account_updated` | User updated name or email in general settings | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sent an invitation to a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Team member was removed from the team | `app/(login)/actions.ts` |
| `checkout_started` | User initiated a Stripe checkout session | `lib/payments/actions.ts` |
| `checkout_completed` | Stripe checkout session completed & subscription activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription updated or cancelled via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `pricing_viewed` | User viewed the pricing page (top of conversion funnel) | `app/(dashboard)/pricing/pricing-tracker.tsx` |

## Next steps

We've set up the events — here are some dashboards and insights to build in PostHog to keep an eye on key business metrics:

### Suggested "Analytics basics" dashboard

Build this dashboard at [app.posthog.com](https://app.posthog.com):

1. **Signup & Sign-in trend** — Trends insight: `user_signed_up` and `user_signed_in` over time
   → [Create insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

2. **Pricing → Checkout conversion funnel** — Funnel insight: `pricing_viewed` → `checkout_started` → `checkout_completed`
   → [Create insight](https://us.posthog.com/project/2/insights/new#insight=FUNNELS)

3. **Churn events trend** — Trends insight: `account_deleted` and `subscription_updated` (filter `subscription_status = canceled`) over time
   → [Create insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

4. **Team growth** — Trends insight: `team_member_invited` and `team_member_removed` over time
   → [Create insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

5. **Revenue funnel** — Funnel insight: `user_signed_up` → `pricing_viewed` → `checkout_completed`
   → [Create insight](https://us.posthog.com/project/2/insights/new#insight=FUNNELS)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
