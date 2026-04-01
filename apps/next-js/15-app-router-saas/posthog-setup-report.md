<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 App Router SaaS project. Here is a summary of all changes made:

**Client-side initialization** — `instrumentation-client.ts` was created to initialize PostHog using the recommended `instrumentation-client` file convention for Next.js 15.3+. It enables automatic exception capture, debug mode in development, and routes events through the `/ingest` reverse proxy.

**Reverse proxy** — `next.config.ts` was updated to add `/ingest` rewrites that route PostHog requests through your own domain, making tracking more reliable and less likely to be blocked by ad blockers.

**Server-side client** — `lib/posthog-server.ts` was created with a `getPostHogClient()` factory that returns a `posthog-node` client configured for Next.js serverless environments (`flushAt: 1`, `flushInterval: 0`).

**Environment variables** — `NEXT_PUBLIC_POSTHOG_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` were written to `.env.local`.

**User identification** — `app/(dashboard)/layout.tsx` was updated to call `posthog.identify()` client-side whenever user data loads (via SWR), and `posthog.reset()` on sign-out. Server-side `posthog.identify()` is also called in the `signIn` and `signUp` server actions.

**Event tracking** was added across 7 files:

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in | `app/(login)/actions.ts` |
| `user_signed_up` | User successfully created an account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `password_updated` | User changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (soft delete) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invited a new member | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed | `app/(login)/actions.ts` |
| `checkout_started` | User initiated a Stripe checkout session | `lib/payments/actions.ts` |
| `checkout_completed` | User completed Stripe checkout successfully | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook: subscription was updated | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe webhook: subscription was cancelled | `app/api/stripe/webhook/route.ts` |
| `pricing_page_viewed` | User viewed the pricing page (conversion funnel top) | `app/(dashboard)/pricing/page.tsx` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following five insights:

1. **Subscription conversion funnel** — Funnel: `pricing_page_viewed` → `checkout_started` → `checkout_completed`
2. **New signups over time** — Trend: `user_signed_up` (daily)
3. **Active users (sign-ins)** — Trend: `user_signed_in` (daily)
4. **Churn signal** — Trend: `account_deleted` (weekly)
5. **Subscription health** — Trend: `subscription_updated` vs `subscription_cancelled` (monthly)

You can create these directly in PostHog:

- [New Dashboard](https://us.posthog.com/project/238460/dashboard/new)
- [New Insight](https://us.posthog.com/project/238460/insights/new)
- [Project Insights](https://us.posthog.com/project/238460/insights)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
