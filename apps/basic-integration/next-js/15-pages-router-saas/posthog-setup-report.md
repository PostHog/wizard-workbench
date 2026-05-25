<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 Pages Router SaaS project.

## What was set up

**Client-side initialization** — `instrumentation-client.ts` was created at the project root to initialize PostHog using the recommended Next.js 15.3+ approach. It enables automatic exception capture, debug mode in development, and routes traffic through a reverse proxy (`/ingest`) to reduce ad-blocker interference.

**Reverse proxy** — `next.config.ts` was updated with rewrites that tunnel PostHog requests through `/ingest`, routing both the event ingestion path and the static asset paths through your own domain.

**Server-side client** — `lib/posthog-server.ts` was created with a singleton `getPostHogClient()` that uses `posthog-node` with `flushAt: 1` and `flushInterval: 0` to ensure server-side events are sent immediately before the function exits.

**User identification** — `posthog.identify()` is called on the client side immediately after successful sign-in and sign-up in `components/login.tsx`, using the user's email as the distinct ID. The same identify call is made server-side in both API auth routes so backend events are correlated to the same person. `posthog.reset()` is called on sign-out in `components/header.tsx` to unlink the session.

**Event tracking** — 10 events were added across 6 files, covering the full user lifecycle from sign-up through subscription management and team collaboration.

**Error tracking** — `posthog.captureException()` was added in all catch blocks within the instrumented files to capture unhandled errors automatically.

## Tracked events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired after a user successfully creates a new account | `components/login.tsx` |
| `user_signed_in` | Fired after a user successfully signs in to an existing account | `components/login.tsx` |
| `checkout_initiated` | Fired when a user clicks 'Get Started' on a pricing plan card | `pages/pricing.tsx` |
| `checkout_session_created` | Fired server-side when a Stripe checkout session is successfully created | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Fired server-side when a Stripe subscription is updated | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Fired server-side when a Stripe subscription is deleted/cancelled | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Fired when a team owner sends an invitation to a new team member | `pages/dashboard/index.tsx` |
| `team_member_removed` | Fired when a team member is removed from the team | `pages/dashboard/index.tsx` |
| `account_updated` | Fired when a user updates their account information (name or email) | `pages/dashboard/general.tsx` |
| `manage_subscription_clicked` | Fired when a user clicks 'Manage Subscription' to open the Stripe customer portal | `pages/dashboard/index.tsx` |

## Next steps

To visualize your data, create an **"Analytics basics"** dashboard in PostHog with these five recommended insights:

1. **Sign-up trend** — Trends chart for `user_signed_up` over the last 30 days.
2. **Checkout conversion funnel** — Funnel with steps: `checkout_initiated` → `checkout_session_created`. Shows how many users who click "Get Started" complete the checkout flow.
3. **Subscription health** — Trends chart comparing `subscription_updated` vs `subscription_cancelled` over time — a leading indicator of churn.
4. **Team growth** — Trends chart for `team_member_invited` and `team_member_removed` side-by-side to track team expansion.
5. **Sign-in vs sign-up** — Trends comparing `user_signed_in` and `user_signed_up` over time to understand returning vs new user ratios.

You can create these at [PostHog Insights](/insights).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
