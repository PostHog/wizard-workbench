<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration includes client-side initialization via `instrumentation-client.ts` (the recommended Next.js 15.3+ approach), a server-side PostHog singleton in `lib/posthog-server.ts`, and a reverse proxy in `next.config.ts` to route PostHog requests through `/ingest`. User identification is performed on both the client (in `components/login.tsx`) and server (in the sign-in and sign-up API routes), ensuring client and server events correlate to the same person. Error tracking via `captureException` is added at all critical client-side action boundaries.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user successfully completes sign-up | `components/login.tsx`, `pages/api/auth/sign-up.ts` |
| `user_signed_in` | Fired when a user successfully signs in | `components/login.tsx`, `pages/api/auth/sign-in.ts` |
| `user_signed_out` | Fired when a user signs out and their session is cleared | `pages/api/auth/sign-out.ts` |
| `checkout_started` | Fired when a user clicks Get Started on a pricing plan | `pages/pricing.tsx` |
| `checkout_completed` | Fired after Stripe redirects back with a successful payment | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Fired via Stripe webhook when a subscription status changes | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Fired via Stripe webhook when a subscription is deleted | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Fired when a team owner sends an invitation | `pages/dashboard/index.tsx` |
| `team_member_removed` | Fired when a team member is removed | `pages/dashboard/index.tsx` |
| `subscription_management_opened` | Fired when a user opens the Stripe customer portal | `pages/dashboard/index.tsx` |
| `account_updated` | Fired when a user updates their name or email | `pages/dashboard/general.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Dashboard: Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1751155)
- [Sign-up to Checkout Conversion Funnel](https://us.i.posthog.com/project/483112/insights/o1934Bq4)
- [Subscription Cancellation Trend](https://us.i.posthog.com/project/483112/insights/vhiUN3k5)
- [Team Growth (Invitations Sent)](https://us.i.posthog.com/project/483112/insights/wfEvCjw1)
- [Active User Engagement (Sign-ins)](https://us.i.posthog.com/project/483112/insights/5sgrjqvq)
- [Account Management Activity](https://us.i.posthog.com/project/483112/insights/6EQgBjfb)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
