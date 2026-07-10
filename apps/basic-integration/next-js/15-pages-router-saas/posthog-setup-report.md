<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 SaaS starter (pages router). The integration covers client-side initialization via `instrumentation-client.ts`, a reverse proxy through Next.js rewrites, a server-side PostHog client for API routes, user identification on login/signup/page-refresh, and `posthog.reset()` on sign-out. Ten events are captured across five client-side components and seven API routes.

| Event | Description | File |
|---|---|---|
| `checkout_started` | User clicked 'Get Started' on a pricing plan and initiated checkout. | `pages/pricing.tsx` |
| `account_info_updated` | User successfully saved changes to their account name or email. | `pages/dashboard/general.tsx` |
| `user_signed_up` | A new user account was successfully created. | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | An existing user successfully authenticated and signed in. | `pages/api/auth/sign-in.ts` |
| `checkout_session_created` | A Stripe checkout session was successfully created for a user. | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | A Stripe subscription was updated via webhook (plan change, renewal, etc.). | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | A Stripe subscription was cancelled or deleted via webhook. | `pages/api/stripe/webhook.ts` |
| `customer_portal_accessed` | User opened the Stripe customer billing portal to manage their subscription. | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | A team owner sent an invitation to a new member. | `pages/api/team/invite.ts` |
| `team_member_removed` | A team member was removed from the team. | `pages/api/team/remove-member.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1829271)
- **New signups over time**: [View insight](https://us.posthog.com/project/483112/insights/8xpHizpZ)
- **Signup to checkout conversion funnel**: [View insight](https://us.posthog.com/project/483112/insights/jIqhWjmV)
- **Subscription cancellations over time**: [View insight](https://us.posthog.com/project/483112/insights/waJBzaWJ)
- **Team invitations sent**: [View insight](https://us.posthog.com/project/483112/insights/9ER01MuV)
- **Checkout started by plan**: [View insight](https://us.posthog.com/project/483112/insights/F9QActN2)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `PostHogUserSync` component in `_app.tsx` handles this via SWR, but verify it correctly re-identifies users on page refresh.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
