<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) and served through a reverse proxy configured in `next.config.ts` to avoid ad-blockers. A shared singleton `getPostHogClient()` in `lib/posthog-server.ts` powers server-side tracking across API routes using `posthog-node`. Users are identified automatically on every page load via a `PostHogIdentifier` component in `_app.tsx` and on login/signup directly in the Login component. `posthog.reset()` is called on sign-out to end the identified session cleanly.

| Event name | Description | File |
|---|---|---|
| `sign_in_submitted` | User successfully submits the sign-in form and receives a successful response. | `components/login.tsx` |
| `sign_up_submitted` | User successfully submits the sign-up form and creates a new account. | `components/login.tsx` |
| `signed_out` | User clicks sign out and is logged out of their account. | `components/header.tsx` |
| `checkout_initiated` | User clicks 'Get Started' on a pricing plan and initiates a Stripe checkout. | `pages/pricing.tsx` |
| `manage_subscription_clicked` | User opens the Stripe customer portal to manage their subscription. | `pages/dashboard/index.tsx` |
| `team_member_invited` | Owner successfully sends an invitation to a new team member. | `pages/dashboard/index.tsx` |
| `team_member_removed` | Owner successfully removes an existing member from the team. | `pages/dashboard/index.tsx` |
| `account_updated` | User successfully saves changes to their account name or email. | `pages/dashboard/general.tsx` |
| `user_signed_in` | Server-side: successful user authentication recorded with login context. | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | Server-side: new user registration recorded including whether they used an invite. | `pages/api/auth/sign-up.ts` |
| `subscription_changed` | Server-side: Stripe webhook processes a subscription update or cancellation. | `pages/api/stripe/webhook.ts` |
| `checkout_session_created` | Server-side: Stripe checkout session created for a user selecting a plan. | `pages/api/stripe/create-checkout.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1901965)
- [Signups & sign-ins (wizard)](https://us.posthog.com/project/483112/insights/AqFBtRwG)
- [Signup-to-checkout funnel (wizard)](https://us.posthog.com/project/483112/insights/2KhnBUpX)
- [Subscription changes by status (wizard)](https://us.posthog.com/project/483112/insights/elGyf8iP)
- [Team collaboration activity (wizard)](https://us.posthog.com/project/483112/insights/Z2PhqOi4)
- [Checkout initiated by plan (wizard)](https://us.posthog.com/project/483112/insights/a6oC9OqZ)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `PostHogIdentifier` component in `_app.tsx` handles this via SWR on every page load, but verify it fires correctly after a hard refresh when `pageProps.fallback` includes `/api/user`.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
