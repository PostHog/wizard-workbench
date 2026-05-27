<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 Pages Router SaaS application. Here is a summary of the changes made:

- **`instrumentation-client.ts`** (new): Client-side PostHog initialization using `posthog.init()` with a reverse proxy (`/ingest`), automatic exception capture, and debug mode in development.
- **`next.config.ts`** (updated): Added reverse-proxy rewrites for `/ingest/static/:path*`, `/ingest/array/:path*`, and `/ingest/:path*` so PostHog traffic routes through your domain, bypassing ad blockers.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, shared across API routes.
- **`.env.local`** (updated): Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- **`components/login.tsx`** (updated): Identifies users and captures `user_signed_up` / `user_signed_in` on successful auth. Passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to the API for client–server correlation. Captures exceptions on fetch errors.
- **`components/header.tsx`** (updated): Captures `user_signed_out` and calls `posthog.reset()` before clearing the session, so the anonymous identity is correctly separated from the next session.
- **`pages/pricing.tsx`** (updated): Captures `checkout_started` with plan name, price, and interval when the user is redirected to Stripe. Captures exceptions on checkout errors.
- **`pages/dashboard/index.tsx`** (updated): Captures `customer_portal_opened`, `team_member_invited` (with invited role), and `team_member_removed`. Captures exceptions on all three flows.
- **`pages/dashboard/general.tsx`** (updated): Captures `account_updated` on successful save. Captures exceptions on API errors.
- **`pages/api/auth/sign-in.ts`** (updated): Server-side `posthog.identify()` + `user_signed_in` capture with `$anon_distinct_id` for anonymous-to-identified user stitching.
- **`pages/api/auth/sign-up.ts`** (updated): Server-side `posthog.identify()` + `user_signed_up` capture, including `via_invitation` flag and `$anon_distinct_id` stitching.
- **`pages/api/stripe/webhook.ts`** (updated): Server-side `subscription_updated` and `subscription_cancelled` captures on Stripe webhook events, with subscription status and plan name.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully registers | `components/login.tsx`, `pages/api/auth/sign-up.ts` |
| `user_signed_in` | User successfully authenticates | `components/login.tsx`, `pages/api/auth/sign-in.ts` |
| `user_signed_out` | User clicks sign out | `components/header.tsx` |
| `checkout_started` | User is redirected to Stripe checkout | `pages/pricing.tsx` |
| `team_member_invited` | Invitation successfully sent to a new team member | `pages/dashboard/index.tsx` |
| `team_member_removed` | Team member successfully removed | `pages/dashboard/index.tsx` |
| `account_updated` | User saves changes to name or email | `pages/dashboard/general.tsx` |
| `customer_portal_opened` | User is redirected to Stripe customer portal | `pages/dashboard/index.tsx` |
| `subscription_updated` | Subscription transitions to active or trialing (webhook) | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Subscription is cancelled or goes unpaid (webhook) | `pages/api/stripe/webhook.ts` |

## Next steps

Here is a recommended "Analytics basics" dashboard to build in PostHog, based on the events just instrumented. You can find an existing dashboard to start from at:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/991016)

Suggested insights for the dashboard:

1. **Sign-up trend** — Trends chart of `user_signed_up` over time. Measures top-of-funnel growth.
2. **Sign-up to checkout funnel** — Funnel from `user_signed_up` → `checkout_started` → `subscription_updated`. Measures conversion rate from free to paid.
3. **Subscription cancellations over time** — Trends chart of `subscription_cancelled`. Key churn signal.
4. **Team collaboration activity** — Trends chart of `team_member_invited` and `team_member_removed` side by side. Shows team growth and churn.
5. **Active user engagement** — Trends chart of `user_signed_in` (unique users) over time. Measures product stickiness.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
