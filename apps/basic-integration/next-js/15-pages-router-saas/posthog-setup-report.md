<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration includes client-side initialization via `instrumentation-client.ts`, a reverse proxy in `next.config.ts` to route PostHog traffic through the app (reducing ad-blocker interference), a server-side PostHog client at `lib/posthog-server.ts`, user identification on sign-in and sign-up, `posthog.reset()` on sign-out, and event capture across 10 key business actions spanning both client and server (API routes).

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account. | `components/login.tsx` (client identify + server capture) |
| `user_signed_in` | User successfully signed in to their account. | `components/login.tsx` (client identify + server capture) |
| `user_signed_out` | User signed out of their account. | `components/header.tsx` |
| `checkout_started` | User clicked 'Get Started' on a pricing plan to begin checkout. | `pages/pricing.tsx` |
| `subscription_activated` | User completed Stripe checkout and a subscription was activated. | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | A team's subscription status changed via Stripe webhook. | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member. | `pages/api/team/invite.ts` |
| `team_member_removed` | A team member was removed from the team. | `pages/api/team/remove-member.ts` |
| `subscription_management_opened` | User clicked 'Manage Subscription' to open the Stripe customer portal. | `pages/dashboard/index.tsx` |
| `account_updated` | User successfully updated their account name or email. | `pages/dashboard/general.tsx` |

## Next steps

We've built some insights and a dashboard to keep an eye on user behavior, based on the events just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1813037)
- [Checkout to Subscription Funnel (wizard)](https://us.posthog.com/project/483112/insights/NiXzJyQZ)
- [User Signups Over Time (wizard)](https://us.posthog.com/project/483112/insights/uppTEXYO)
- [Subscription Activations (wizard)](https://us.posthog.com/project/483112/insights/jUzOs7BR)
- [Subscription Cancellations & Changes (wizard)](https://us.posthog.com/project/483112/insights/6kxSxdST)
- [Team Growth — Invitations Sent (wizard)](https://us.posthog.com/project/483112/insights/rhBrEJF5)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current integration identifies on sign-in and sign-up; users who return with an active session should also be identified (e.g. on page load via `/api/user`).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
