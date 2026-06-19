<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 SaaS application. The integration covers client-side initialization via `instrumentation-client.ts`, a reverse proxy through Next.js rewrites, server-side event capture using `posthog-node` across all critical auth and billing flows, client-side user identification in the dashboard layout, and error tracking via `capture_exceptions`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fires on the server when a new user successfully creates an account. | `app/(login)/actions.ts` |
| `user_signed_in` | Fires on the server when a user successfully authenticates. | `app/(login)/actions.ts` |
| `user_signed_out` | Fires on the server when a user signs out of their account. | `app/(login)/actions.ts` |
| `password_updated` | Fires on the server when a user successfully changes their password. | `app/(login)/actions.ts` |
| `account_deleted` | Fires on the server when a user deletes their account. | `app/(login)/actions.ts` |
| `team_member_invited` | Fires on the server when a team owner sends an invitation to a new member. | `app/(login)/actions.ts` |
| `team_member_removed` | Fires on the server when a team owner removes a member from the team. | `app/(login)/actions.ts` |
| `checkout_started` | Fires client-side when a user clicks the checkout button on the pricing page. | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | Fires on the server when a Stripe checkout session is successfully processed. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fires on the server when a Stripe subscription status changes via webhook. | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Fires on the server when a Stripe subscription is canceled via webhook. | `app/api/stripe/webhook/route.ts` |

## Files created or modified

- **`instrumentation-client.ts`** (new) — Client-side PostHog initialization using Next.js 15.3+ instrumentation file. Configures reverse proxy, error tracking, and debug mode.
- **`lib/posthog-server.ts`** (new) — Server-side PostHog client singleton using `posthog-node` with immediate flush settings for short-lived server functions.
- **`next.config.ts`** (modified) — Added reverse proxy rewrites routing `/ingest/*` to PostHog's ingestion endpoints and `/ingest/static/*` + `/ingest/array/*` to the assets CDN.
- **`.env.local`** (created) — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`app/(login)/actions.ts`** (modified) — Added server-side PostHog capture for all auth actions: sign-up, sign-in, sign-out, password update, account deletion, team member invite/remove. Also calls `posthog.identify()` on sign-in and sign-up.
- **`app/api/stripe/checkout/route.ts`** (modified) — Added `checkout_completed` event on successful Stripe checkout with plan and subscription details.
- **`app/api/stripe/webhook/route.ts`** (modified) — Added `subscription_updated` and `subscription_canceled` events when Stripe sends subscription lifecycle webhooks.
- **`app/(dashboard)/pricing/submit-button.tsx`** (modified) — Added client-side `checkout_started` event when the user clicks the pricing CTA button.
- **`app/(dashboard)/layout.tsx`** (modified) — Added client-side `posthog.identify()` in `UserMenu` when user data loads via SWR, and `posthog.reset()` on sign-out.

## Next steps

To monitor key user behaviors, create a **"Analytics basics (wizard)"** dashboard in PostHog with these insights:

1. **Signup → Checkout conversion funnel** — Funnel: `user_signed_up` → `checkout_started` → `checkout_completed`
2. **New signups over time** — Trend: `user_signed_up` (daily)
3. **Churn risk** — Trend: `account_deleted` + `subscription_canceled` (weekly)
4. **Subscription activity** — Trend: `subscription_updated` + `subscription_canceled` split by `status` property
5. **Team collaboration** — Trend: `team_member_invited` + `team_member_removed` (weekly)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `UserMenu` component identifies on every page load where user data is fetched via SWR, which covers returning sessions.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
