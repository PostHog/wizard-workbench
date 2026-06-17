<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS project. The integration covers both client-side and server-side analytics, user identification, error tracking, and a reverse proxy for improved event reliability.

**Files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization using the Next.js 15.3+ instrumentation hook, with a `/ingest` reverse proxy, exception capture, and the 2026-01-30 defaults.
- `lib/posthog-server.ts` — Lightweight server-side PostHog client factory (`posthog-node`) used by all Server Actions and API routes.
- `components/posthog-identifier.tsx` — Client component that fetches the current user and calls `posthog.identify()` so authenticated sessions are linked to a known user.
- `.env.local` — PostHog public token and host environment variables added.

**Files modified:**
- `next.config.ts` — Added `/ingest` reverse proxy rewrites for both static assets and event ingestion, plus `skipTrailingSlashRedirect: true`.
- `app/(dashboard)/layout.tsx` — Mounts `<PostHogIdentifier />` in the authenticated layout so every dashboard page identifies the user.
- `app/(login)/actions.ts` — Server-side `identify` + `capture` added to all auth Server Actions.
- `lib/payments/stripe.ts` — `checkout_started` captured when a Stripe session is created; `subscription_updated` and `subscription_cancelled` captured in the webhook handler.
- `app/api/stripe/checkout/route.ts` — `checkout_completed` captured after a successful Stripe checkout redirect.
- `lib/payments/actions.ts` — `customer_portal_opened` captured when a user opens the Stripe billing portal.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account. Critical conversion event at top of the acquisition funnel. | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signs in to an existing account. Tracks returning user engagement. | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out of their session. | `app/(login)/actions.ts` |
| `checkout_started` | User initiates a Stripe checkout session for a subscription plan. Top of payment conversion funnel. | `lib/payments/stripe.ts` |
| `checkout_completed` | User successfully completes Stripe checkout and subscription is activated. Critical revenue event. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team's subscription status changes to active or trialing via Stripe webhook. | `lib/payments/stripe.ts` |
| `subscription_cancelled` | A team's subscription is cancelled or goes unpaid via Stripe webhook. Key churn signal. | `lib/payments/stripe.ts` |
| `customer_portal_opened` | User opens the Stripe customer portal to manage their subscription. | `lib/payments/actions.ts` |
| `team_member_invited` | Team owner sends an invitation to a new team member. Viral growth signal. | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removes a member from the team. | `app/(login)/actions.ts` |
| `account_updated` | User updates their account name or email in general settings. | `app/(login)/actions.ts` |
| `password_updated` | User successfully changes their password in security settings. | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account. Key churn and retention signal. | `app/(login)/actions.ts` |

## Next steps

The PostHog MCP API key did not have `dashboard:write` or `insight:write` scopes, so the dashboard and insights could not be created automatically. Create the **"Analytics basics (wizard)"** dashboard manually using these recommended insights:

1. **Checkout conversion funnel** — Funnel insight with steps: `user_signed_up` → `checkout_started` → `checkout_completed`. This shows where users drop out of the payment flow.
2. **Signups & sign-ins over time** — Trends insight with two series: `user_signed_up` and `user_signed_in`. Shows acquisition and engagement trends side by side.
3. **Subscription churn** — Trends insight for `subscription_cancelled`. Set a daily or weekly interval to spot cancellation spikes early.
4. **Team viral growth** — Trends insight for `team_member_invited`. Higher invite rates correlate with product stickiness.
5. **Account deletions** — Trends insight for `account_deleted`. Complement with a breakdown by plan name if you capture that property.

- [Create a new insight](https://us.posthog.com/project/2/insights/new)
- [Go to Dashboards](https://us.posthog.com/project/2/dashboard)

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `PostHogIdentifier` component handles this for authenticated dashboard sessions, but verify that sessions created before this deploy are correctly re-identified on next login.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
