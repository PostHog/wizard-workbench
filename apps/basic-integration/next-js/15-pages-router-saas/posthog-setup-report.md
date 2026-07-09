<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 SaaS application (pages router). The integration covers both client-side and server-side event tracking, user identification, exception capture, and a reverse proxy configuration to minimise ad-blocker interference.

**Files created:**
- `instrumentation-client.ts` — initialises PostHog on the client with `capture_exceptions: true` and routes events through the `/ingest` reverse proxy
- `lib/posthog-server.ts` — singleton `posthog-node` client for all API route tracking
- `.env.local` — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` added

**Files modified:**
- `next.config.ts` — added `/ingest/*` rewrites to proxy PostHog traffic server-side and set `skipTrailingSlashRedirect: true`
- `pages/_app.tsx` — identifies returning users on every page load using server-side-rendered user data from `pageProps.fallback`
- `components/login.tsx` — sends the client `distinct_id` as `X-PostHog-Distinct-Id` header on submit and captures `captureException` on network errors
- `components/header.tsx` — captures `signed_out` and calls `posthog.reset()` on sign-out
- `pages/pricing.tsx` — captures `checkout_started` with `plan_name`, `price_id`, `price`, and `interval` properties
- `pages/dashboard/general.tsx` — captures `account_updated` on successful save
- `pages/dashboard/index.tsx` — captures `customer_portal_opened` with `plan_name` and `subscription_status`
- `pages/api/auth/sign-in.ts` — captures `signed_in` server-side with user identify; uses client distinct ID from `X-PostHog-Distinct-Id` header for session correlation
- `pages/api/auth/sign-up.ts` — captures `signed_up` server-side with user identify and `via_invitation` flag
- `pages/api/stripe/webhook.ts` — captures `subscription_updated` and `subscription_cancelled` from Stripe webhook events
- `pages/api/team/invite.ts` — captures `team_member_invited` with `invited_role` and `team_id`
- `pages/api/team/remove-member.ts` — captures `team_member_removed` with `team_id` and `removed_member_id`

| Event name | Description | File |
|---|---|---|
| `signed_up` | User successfully created a new account. | `pages/api/auth/sign-up.ts` |
| `signed_in` | User successfully signed in to their account. | `pages/api/auth/sign-in.ts` |
| `signed_out` | User signed out of their account. | `components/header.tsx` |
| `checkout_started` | User initiated a Stripe checkout session for a subscription plan. | `pages/pricing.tsx` |
| `subscription_updated` | A subscription was updated via Stripe webhook. | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | A subscription was cancelled via Stripe webhook. | `pages/api/stripe/webhook.ts` |
| `customer_portal_opened` | User opened the Stripe customer portal to manage their subscription. | `pages/dashboard/index.tsx` |
| `team_member_invited` | A team owner sent an invitation to a new team member. | `pages/api/team/invite.ts` |
| `team_member_removed` | A team owner removed a member from the team. | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account name or email. | `pages/dashboard/general.tsx` |

## Next steps

We've built a dashboard and five insights to monitor user behaviour based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824530)
- **Insight**: [Signup to Checkout Funnel (wizard)](https://us.posthog.com/project/483112/insights/4PHlwLWC) — conversion funnel from signup → checkout → subscription
- **Insight**: [New Signups Over Time (wizard)](https://us.posthog.com/project/483112/insights/TyqCogh6) — daily signups and sign-ins over 30 days
- **Insight**: [Checkout Started by Plan (wizard)](https://us.posthog.com/project/483112/insights/PVeld3r4) — checkout attempts broken down by plan name
- **Insight**: [Subscription Events (wizard)](https://us.posthog.com/project/483112/insights/0Hf6VOOU) — weekly subscription updates vs cancellations (churn signal)
- **Insight**: [Team Activity (wizard)](https://us.posthog.com/project/483112/insights/WNszrCVU) — weekly team member invitations and removals

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any CI/CD environment configuration so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog Error Tracking.
- [ ] Confirm the returning-visitor path also calls `identify` — the `_app.tsx` handler identifies users from `pageProps.fallback`, which is populated by `getServerSideProps` on dashboard pages. Ensure any additional protected pages also pass `user` in their `fallback` prop.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
