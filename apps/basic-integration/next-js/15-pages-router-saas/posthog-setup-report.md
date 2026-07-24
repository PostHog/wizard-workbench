# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration covers client-side initialization via `instrumentation-client.ts`, a reverse proxy via Next.js rewrites in `next.config.ts`, a server-side PostHog singleton in `lib/posthog-server.ts`, user identification on login/signup and on page refresh, `posthog.reset()` on logout, and event capture across 9 key business actions spanning both client-side and server-side code.

| Event name | Description | File |
|---|---|---|
| `signed_up` | User successfully created a new account. | `pages/api/auth/sign-up.ts` (server) + `components/login.tsx` (client) |
| `signed_in` | User successfully signed in to their account. | `pages/api/auth/sign-in.ts` (server) + `components/login.tsx` (client) |
| `signed_out` | User signed out of their account. | `components/header.tsx` |
| `checkout_started` | User clicked 'Get Started' and initiated a Stripe checkout session. | `pages/pricing.tsx` |
| `subscription_activated` | User's subscription became active or trialing after successful checkout. | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | User's subscription was cancelled or became unpaid. | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner invited a new member to the team. | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removed a member from the team. | `pages/api/team/remove-member.ts` |
| `account_updated` | User saved changes to their account name or email. | `pages/api/account/update.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1902664)
- [Sign-ups over time (wizard)](https://us.posthog.com/project/483112/insights/EV6BfuWT)
- [Sign-up to checkout conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/biaIIQGh)
- [Subscription activations vs cancellations (wizard)](https://us.posthog.com/project/483112/insights/sxfWyPuX)
- [Checkout started by plan (wizard)](https://us.posthog.com/project/483112/insights/1fAdp49Y)
- [Team invitations sent (wizard)](https://us.posthog.com/project/483112/insights/tsRUdIFH)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. (The wizard adds `posthog.identify()` in `UserMenu` on every page that renders the header, so returning users are covered as long as the header is present.)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
