<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS project. The integration covers client-side initialization via `instrumentation-client.ts`, a reverse proxy for ad-blocker resilience, user identification on login and signup, event capture across all key SaaS conversion flows, and server-side event tracking for payment and team management operations. PostHog exception tracking has also been added to relevant client-side error paths.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | New user created an account (server-side, with team context and identify) | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | User authenticated successfully (server-side, with identify) | `pages/api/auth/sign-in.ts` |
| `checkout_started` | User clicked "Get Started" on a pricing plan card (client-side) | `pages/pricing.tsx` |
| `checkout_initiated` | Stripe checkout session created server-side | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Stripe subscription became active or trialing (webhook) | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe subscription cancelled or unpaid (webhook) | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner sent an invitation to a new member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team member was removed from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account name or email | `pages/api/account/update.ts` |
| `user_signed_out` | User clicked sign out from header (client-side) | `components/header.tsx` |

## New files created

| File | Purpose |
|---|---|
| `instrumentation-client.ts` | Initializes posthog-js for client-side analytics (Next.js 15.3+ pattern) |
| `lib/posthog-server.ts` | Singleton `posthog-node` client for all server-side API routes |

## Config changes

- **`next.config.ts`**: Added reverse-proxy rewrites (`/ingest/*`) and `skipTrailingSlashRedirect: true` so PostHog requests bypass ad-blockers.
- **`.env.local`**: Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Next steps

To build the recommended "Analytics basics (wizard)" dashboard, visit PostHog and create the following insights:

1. **Sign-ups over time** — Trends insight on `user_signed_up`, daily interval, last 30 days.
2. **Sign-ins over time** — Trends insight on `user_signed_in`, daily interval, last 30 days.
3. **Checkout funnel** — Funnel insight: `checkout_started` → `checkout_initiated` (measures drop-off between click and Stripe session creation).
4. **Subscription outcomes** — Trends insight with two series: `subscription_updated` (active/trialing) and `subscription_cancelled`.
5. **Team growth** — Trends insight on `team_member_invited`, weekly interval.

Useful links:
- [Create a new insight](https://us.posthog.com/project/2/insights/new)
- [Dashboard overview](https://us.posthog.com/project/2/dashboard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
