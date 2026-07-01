# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. The integration covers client-side initialization via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), a reverse proxy through Next.js rewrites, a server-side PostHog Node client singleton, user identification on sign-in and sign-up, PostHog reset on sign-out, and 12 tracked events spanning authentication, subscription, and team management flows.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully created an account. | `app/(login)/actions.ts` |
| `user_signed_in` | An existing user successfully signed in to their account. | `app/(login)/actions.ts` |
| `user_signed_out` | A user signed out of their account. | `app/(login)/actions.ts` |
| `subscription_checkout_started` | A user initiated a Stripe checkout session for a subscription plan. | `lib/payments/stripe.ts` |
| `subscription_checkout_completed` | A user successfully completed the Stripe checkout and activated a subscription. | `app/api/stripe/checkout/route.ts` |
| `subscription_changed` | A team's subscription status was updated via a Stripe webhook event. | `lib/payments/stripe.ts` |
| `team_member_invited` | A team owner sent an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team. | `app/(login)/actions.ts` |
| `account_updated` | A user updated their account name or email. | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their account password. | `app/(login)/actions.ts` |
| `account_deleted` | A user deleted their account (soft delete). | `app/(login)/actions.ts` |
| `customer_portal_accessed` | A user opened the Stripe customer portal to manage their subscription. | `lib/payments/actions.ts` |

## Files created or modified

- **Created** `instrumentation-client.ts` — client-side PostHog initialization (Next.js 15.3+ pattern)
- **Created** `lib/posthog-server.ts` — server-side PostHog Node.js singleton
- **Modified** `next.config.ts` — added `/ingest` reverse proxy rewrites
- **Modified** `app/(login)/actions.ts` — server-side events for auth and team/account actions
- **Modified** `lib/payments/stripe.ts` — checkout started and subscription changed events
- **Modified** `lib/payments/actions.ts` — customer portal accessed event
- **Modified** `app/api/stripe/checkout/route.ts` — checkout completed event
- **Modified** `app/(dashboard)/layout.tsx` — client-side `posthog.identify()` and `posthog.reset()` on sign-out

## Next steps

A dashboard and insights have been set up in PostHog to monitor key user behavior:

- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1787293)
  - [Signup to paid conversion](https://us.posthog.com/project/483112/insights/9742691) — funnel: sign-up → checkout started → checkout completed
  - [Daily active users](https://us.posthog.com/project/483112/insights/9742695) — unique daily sign-ins
  - [Account deletions over time](https://us.posthog.com/project/483112/insights/9742699) — churn signal
  - [Team invitations sent](https://us.posthog.com/project/483112/insights/9742717) — team growth
  - [Subscription management activity](https://us.posthog.com/project/483112/insights/9742720) — portal access and plan changes

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
