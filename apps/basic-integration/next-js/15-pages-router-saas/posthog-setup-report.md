<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. PostHog is initialized client-side via `instrumentation-client.ts` with a reverse proxy through Next.js rewrites, and server-side via a singleton `posthog-node` client at `lib/posthog-server.ts`. Users are identified by their database user ID on successful sign-in and sign-up, and `posthog.reset()` is called on sign-out to unlink the session. Error tracking is enabled via `capture_exceptions: true` in the init config plus targeted `posthog.captureException()` calls in error boundaries.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | Fired on the client when a user successfully completes the sign-in form and is redirected to the dashboard. | `components/login.tsx` |
| `user_signed_up` | Fired on the client when a user successfully creates a new account via the sign-up form. | `components/login.tsx` |
| `user_signed_out` | Fired on the client when a user clicks Sign Out from the header user menu. | `components/header.tsx` |
| `checkout_initiated` | Fired on the client when a user clicks Get Started on a pricing plan card to begin checkout. | `pages/pricing.tsx` |
| `checkout_completed` | Fired server-side after Stripe successfully processes a subscription checkout and the session is confirmed. | `pages/api/stripe/checkout.ts` |
| `subscription_activated` | Fired server-side via Stripe webhook when a subscription transitions to active or trialing status. | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Fired server-side via Stripe webhook when a subscription is cancelled or becomes unpaid. | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Fired on the client when a team owner successfully sends an invitation to a new team member. | `pages/dashboard/index.tsx` |
| `team_member_removed` | Fired on the client when a team owner successfully removes a member from the team. | `pages/dashboard/index.tsx` |
| `subscription_managed` | Fired on the client when a user clicks Manage Subscription to open the Stripe customer portal. | `pages/dashboard/index.tsx` |
| `account_updated` | Fired on the client when a user successfully saves changes to their name or email in General Settings. | `pages/dashboard/general.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1795762)
- [Signups & Sign-ins Over Time](https://us.posthog.com/project/483112/insights/9nxk1U02)
- [Signup to Paid Conversion Funnel](https://us.posthog.com/project/483112/insights/UWFTX2AY)
- [Subscription Activations vs Cancellations](https://us.posthog.com/project/483112/insights/FBB0isbB)
- [Team Member Invitations Sent](https://us.posthog.com/project/483112/insights/AuBG1lRn)
- [Total Checkouts Initiated (30 days)](https://us.posthog.com/project/483112/insights/xGnYF7iK)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set: `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. Consider calling `posthog.identify(userId)` on app load when a session cookie exists (e.g. in `pages/_app.tsx` using the SWR `/api/user` response).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
