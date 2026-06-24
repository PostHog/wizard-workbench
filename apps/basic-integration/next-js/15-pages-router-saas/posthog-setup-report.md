<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS starter. The integration includes client-side initialization via `instrumentation-client.ts`, a reverse proxy via Next.js rewrites, a server-side PostHog client singleton, user identification on sign-in/sign-up, `posthog.reset()` on sign-out, exception capture in critical error paths, and 13 tracked events across 9 files spanning both client and server code.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Fires on the client when a user successfully completes sign-in. | `components/login.tsx` |
| `user_signed_up` | Fires on the client when a user successfully completes sign-up. | `components/login.tsx` |
| `user_signed_out` | Fires on the client when a user clicks sign out. | `components/header.tsx` |
| `checkout_initiated` | Fires on the client when a user clicks Get Started on a pricing plan. | `pages/pricing.tsx` |
| `subscription_management_opened` | Fires on the client when a user opens the Stripe customer portal. | `pages/dashboard/index.tsx` |
| `team_member_invited` | Fires on the client when a team owner successfully sends an invitation. | `pages/dashboard/index.tsx` |
| `team_member_removed` | Fires on the client when a team member is successfully removed. | `pages/dashboard/index.tsx` |
| `account_updated` | Fires on the client when a user successfully updates their account information. | `pages/dashboard/general.tsx` |
| `sign_in_completed` | Server-side event captured when a user successfully authenticates. | `pages/api/auth/sign-in.ts` |
| `sign_up_completed` | Server-side event captured when a new user account is successfully created. | `pages/api/auth/sign-up.ts` |
| `checkout_session_created` | Server-side event captured when a Stripe checkout session is successfully created. | `pages/api/stripe/create-checkout.ts` |
| `subscription_changed` | Server-side event captured via Stripe webhook when a subscription is updated or deleted. | `pages/api/stripe/webhook.ts` |
| `customer_portal_session_created` | Server-side event captured when a Stripe customer portal session is created. | `pages/api/stripe/customer-portal.ts` |

## Next steps

We've built some insights and added them to your PostHog dashboard so you can keep an eye on user behavior:

- **Dashboard**: [Your PostHog Dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- [Sign-up to checkout funnel](https://us.posthog.com/project/483112/insights/BCvASlkK)
- [New user sign-ups (daily)](https://us.posthog.com/project/483112/insights/Pre5FsMl)
- [Subscription changes (churn indicator)](https://us.posthog.com/project/483112/insights/MTnyIbTa)
- [Checkout sessions initiated](https://us.posthog.com/project/483112/insights/wH7NVTV8)
- [Team activity (invites and removals)](https://us.posthog.com/project/483112/insights/HktaBEiD)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
