<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS project. Client-side tracking is initialized via `instrumentation-client.ts` (Next.js 15.3+ pattern) with a reverse proxy configured in `next.config.ts` to route analytics through `/ingest`. A shared server-side PostHog client is provided by `lib/posthog-server.ts`. Users are identified on sign-in and sign-up (both client-side via `components/header.tsx` and server-side in the API routes). Ten business-critical events are now tracked across authentication, billing, and team management flows.

| Event Name | Description | File |
|---|---|---|
| `pricing_plan_selected` | User clicks 'Get Started' on a pricing plan card. | `pages/pricing.tsx` |
| `user_signed_out` | User clicks the sign out button from the user menu. | `components/header.tsx` |
| `user_signed_up` | A new user account is successfully created via the sign-up API. | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | A user successfully authenticates via the sign-in API. | `pages/api/auth/sign-in.ts` |
| `checkout_started` | A Stripe checkout session is successfully created for a user. | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | A Stripe subscription is updated via the webhook handler. | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | A Stripe subscription is deleted/cancelled via the webhook handler. | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | A team owner sends an invitation to a new team member. | `pages/api/team/invite.ts` |
| `team_member_removed` | A team member is removed from the team. | `pages/api/team/remove-member.ts` |
| `account_updated` | A user updates their account name or email via the settings page. | `pages/api/account/update.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818143)
- [New signups](https://us.posthog.com/project/483112/insights/IJyAhpDq) — Daily signup trend over the last 30 days
- [Signup to checkout funnel](https://us.posthog.com/project/483112/insights/LDRZtykj) — Conversion from signup to initiating checkout
- [Pricing plan selections by plan](https://us.posthog.com/project/483112/insights/lnQN1Zrw) — Which plans users click on, broken down by plan name
- [Subscription cancellations](https://us.posthog.com/project/483112/insights/1vVAq2bZ) — Weekly churn signal over the last 90 days
- [Team growth activity](https://us.posthog.com/project/483112/insights/c7Eu0Dwn) — Members invited vs removed per week

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `UserMenu` component identifies on mount when a user session is present, covering page refreshes; verify this fires correctly in your environment.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
