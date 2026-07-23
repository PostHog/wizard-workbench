# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route analytics through `/ingest` and reduce ad-blocker interference. A shared server-side PostHog client (`lib/posthog-server.ts`) powers event capture in server actions and API route handlers. Users are identified by their database ID on sign-in, sign-up, and on every dashboard page load, and the session is reset on sign-out.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticates with email and password. | `app/(login)/actions.ts` |
| `user_signed_up` | User creates a new account and team. | `app/(login)/actions.ts` |
| `invitation_accepted` | User signs up using a valid team invitation link. | `app/(login)/actions.ts` |
| `account_updated` | User saves changes to their name or email. | `app/(login)/actions.ts` |
| `password_updated` | User successfully changes their password. | `app/(login)/actions.ts` |
| `account_deleted` | User permanently deletes their account. | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sends an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removes a member from the team. | `app/(login)/actions.ts` |
| `subscription_completed` | Stripe checkout session completes and subscription is activated. | `app/api/stripe/checkout/route.ts` |
| `subscription_changed` | Stripe webhook fires when a subscription is updated or cancelled. | `app/api/stripe/webhook/route.ts` |
| `user_signed_out` | User clicks the sign-out button in the navigation header. | `app/(dashboard)/layout.tsx` |
| `pricing_plan_selected` | User clicks to start checkout for a pricing plan on the pricing page. | `app/(dashboard)/pricing/submit-button.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1897362)
- [Signup conversion funnel](https://us.posthog.com/project/483112/insights/CLt95TEZ)
- [Signups over time](https://us.posthog.com/project/483112/insights/n1aNgzg1)
- [Subscription completions by plan](https://us.posthog.com/project/483112/insights/cK5zqe14)
- [Churn events](https://us.posthog.com/project/483112/insights/d5Q3VSrw)
- [Team growth](https://us.posthog.com/project/483112/insights/mKzr6WjO)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
