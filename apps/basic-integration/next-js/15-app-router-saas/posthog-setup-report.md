# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js App Router project with PostHog product analytics and error tracking. It installed the PostHog browser and server SDKs, initialized client-side PostHog in `instrumentation-client.ts`, added a managed reverse-proxy path in `next.config.ts`, created a reusable server helper in `lib/posthog-server.ts`, identified authenticated users from the dashboard shell, and instrumented key server-side business actions across authentication, billing, subscription lifecycle, and team/account management flows.

| Event name | Description | File |
| --- | --- | --- |
| `user_signed_in` | Captures successful sign-in attempts from the authentication server action. | `app/(login)/actions.ts` |
| `user_signed_up` | Captures successful account creation when a new user finishes signup. | `app/(login)/actions.ts` |
| `checkout_started` | Captures when a user starts a Stripe checkout flow for a selected plan. | `lib/payments/stripe.ts` |
| `subscription_checkout_completed` | Captures when Stripe checkout successfully provisions a subscription for a team. | `app/api/stripe/checkout/route.ts` |
| `subscription_status_changed` | Captures Stripe webhook subscription lifecycle updates for a team. | `app/api/stripe/webhook/route.ts` |
| `billing_portal_opened` | Captures when a signed-in team opens the Stripe billing portal. | `lib/payments/actions.ts` |
| `team_member_invited` | Captures when an owner invites a teammate to join the current team. | `app/(login)/actions.ts` |
| `team_member_removed` | Captures when a team member is removed from the current team. | `app/(login)/actions.ts` |
| `account_updated` | Captures when a signed-in user saves changes to profile details. | `app/(login)/actions.ts` |
| `password_updated` | Captures when a signed-in user successfully changes their password. | `app/(login)/actions.ts` |
| `account_deleted` | Captures when a signed-in user successfully deletes their account. | `app/(login)/actions.ts` |
| `user_signed_out` | Captures when a signed-in user signs out from the dashboard header. | `app/(dashboard)/layout.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1841872)
- [Signups over time (wizard)](https://us.posthog.com/project/483112/insights/foQvCtzD)
- [Signup to checkout completion funnel (wizard)](https://us.posthog.com/project/483112/insights/ZmEXakG7)
- [Checkout starts over time (wizard)](https://us.posthog.com/project/483112/insights/EcKox9Xf)
- [Account changes over time (wizard)](https://us.posthog.com/project/483112/insights/jzrEFXna)
- [Team admin actions (wizard)](https://us.posthog.com/project/483112/insights/aJQOTrVe)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
