# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS starter. Client-side analytics are initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route PostHog requests through `/ingest`. A server-side singleton (`lib/posthog-server.ts`) handles all server action and API route tracking. User identification runs on login, signup, account update, and on every page load for returning authenticated users via a lightweight `PostHogIdentify` client component in the root layout.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | A user successfully signed in to their account. | `app/(login)/actions.ts` |
| `user_signed_up` | A new user successfully created an account. | `app/(login)/actions.ts` |
| `user_signed_out` | A user signed out of their account. | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their password. | `app/(login)/actions.ts` |
| `account_deleted` | A user deleted their account. | `app/(login)/actions.ts` |
| `account_updated` | A user updated their account name or email. | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team. | `app/(login)/actions.ts` |
| `team_member_invited` | A user invited a new member to join the team. | `app/(login)/actions.ts` |
| `checkout_started` | A user completed a Stripe checkout session. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A Stripe subscription was updated via webhook. | `app/api/stripe/webhook/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1901928)
- [Sign-ups and sign-ins over time (wizard)](https://us.posthog.com/project/483112/insights/k6OCmvwq)
- [Signup to checkout conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/slO9E6o8)
- [Subscription lifecycle events (wizard)](https://us.posthog.com/project/483112/insights/9WJPfETO)
- [Account management actions (wizard)](https://us.posthog.com/project/483112/insights/6Zt0lYYe)
- [Team collaboration events (wizard)](https://us.posthog.com/project/483112/insights/6nad0pGO)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
