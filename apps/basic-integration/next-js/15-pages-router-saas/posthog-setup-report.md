<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS project. Here's a summary of what was done:

- **Installed** `posthog-js` (client-side) and `posthog-node` (server-side) packages via pnpm.
- **Created** `instrumentation-client.ts` at the project root to initialize PostHog client-side using Next.js 15.3+ native instrumentation, with reverse proxy routing, exception capture, and debug mode in development.
- **Updated** `next.config.ts` to add reverse proxy rewrites for PostHog ingestion endpoints (`/ingest/*`) via Next.js rewrites, reducing tracking blocker impact.
- **Created** `lib/posthog-server.ts` — a singleton server-side PostHog client used across all API routes.
- **Set up** `.env.local` with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- **Added client-side identify** in `components/login.tsx`: on successful sign-in or sign-up, calls `posthog.identify()` with the user's DB ID and email, and passes `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` headers to API routes for server-client identity correlation.
- **Added `posthog.reset()`** in `components/header.tsx` on sign-out to unlink future events from the logged-out user.
- **Added server-side identify + `$anon_distinct_id` stitching** in sign-in and sign-up API routes so that anonymous pre-login events are merged into the identified user's profile.
- **Added PostHog exception capture** (`posthog.captureException`) in `components/login.tsx` and `pages/pricing.tsx` around critical error paths.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account (client-side) | `components/login.tsx` |
| `user_signed_in` | User successfully signed in (client-side) | `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `checkout_started` | User clicked "Get Started" on a pricing plan | `pages/pricing.tsx` |
| `user_signed_up` | User signed up — server-side with identity stitching | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | User signed in — server-side with identity stitching | `pages/api/auth/sign-in.ts` |
| `subscription_created` | Stripe checkout completed and subscription created | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Stripe webhook: subscription status changed | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe webhook: subscription cancelled or unpaid | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner invited a new member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removed a team member | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account name or email | `pages/api/account/update.ts` |

## Next steps

The PostHog API key used during this wizard session did not have the `dashboard:write`, `insight:write`, or `query:read` scopes needed to create a dashboard automatically. To set up your "Analytics basics" dashboard in PostHog, navigate to [Dashboards](/dashboard) and create a new dashboard with these recommended insights:

1. **Signup → Checkout → Subscription funnel** — Funnel insight with steps: `user_signed_up` → `checkout_started` → `subscription_created`
2. **Sign-ups over time** — Trends insight for `user_signed_up`
3. **Subscriptions created over time** — Trends insight for `subscription_created`
4. **Subscription cancellations over time** — Trends insight for `subscription_cancelled`
5. **Team growth** — Trends insight for `team_member_invited`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
