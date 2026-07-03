<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js Pages Router SaaS starter. PostHog client initialization was added through `instrumentation-client.ts` and imported in `pages/_app.tsx`, reverse-proxy rewrites were added in `next.config.ts`, server-side PostHog helpers were added in `lib/posthog-server.ts`, and event capture was instrumented across authentication, billing, account settings, and team management flows. Environment variables were written to `.env.local` using local env tooling, and PostHog dependencies were installed with pnpm.

| Event name | Description | File |
| --- | --- | --- |
| user_signed_up | Captures successful account creation and initial workspace setup. | components/login.tsx |
| user_signed_in | Captures successful authentication from the sign-in flow. | components/login.tsx |
| user_signed_out | Captures successful sign-out from the authenticated header menu. | components/header.tsx |
| pricing_checkout_started | Captures when a visitor starts checkout from the pricing page. | pages/pricing.tsx |
| account_updated | Captures successful account profile updates from settings. | pages/dashboard/general.tsx |
| team_member_invited | Captures successful team invitation submissions from team settings. | pages/dashboard/index.tsx |
| team_member_removed | Captures successful team member removals from team settings. | pages/dashboard/index.tsx |
| server_user_signed_in | Captures successful authenticated sign-in on the server. | pages/api/auth/sign-in.ts |
| server_user_signed_up | Captures successful account creation on the server, including invite and checkout context. | pages/api/auth/sign-up.ts |
| server_checkout_session_created | Captures successful Stripe checkout session creation on the server. | pages/api/stripe/create-checkout.ts |
| checkout_completed | Captures successful Stripe checkout completion and plan activation. | pages/api/stripe/checkout.ts |
| billing_portal_opened | Captures successful customer billing portal session creation. | pages/api/stripe/customer-portal.ts |
| stripe_subscription_changed | Captures Stripe webhook subscription updates and cancellations. | pages/api/stripe/webhook.ts |
| server_team_member_invited | Captures successful server-side team invitation creation. | pages/api/team/invite.ts |
| server_team_member_removed | Captures successful server-side team member removal. | pages/api/team/remove-member.ts |
| server_account_updated | Captures successful account profile updates on the server. | pages/api/account/update.ts |

## Next steps

We've built some insights and a dashboard for ongoing visibility into user behavior:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1796160
- Insight: Sign-up to checkout conversion funnel (wizard) — https://us.posthog.com/project/483112/insights/zF6yV5zR
- Insight: Authentication events trend (wizard) — https://us.posthog.com/project/483112/insights/ihlxzZXe
- Insight: Team management actions (wizard) — https://us.posthog.com/project/483112/insights/mU1GxDCm
- Insight: Billing operations trend (wizard) — https://us.posthog.com/project/483112/insights/U7UWK4YL
- Insight: Checkout completions total (wizard) — https://us.posthog.com/project/483112/insights/HXvf7oJG

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here to `.env.example` and any bootstrap/setup docs so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or equivalent CI step) into production builds so browser error stack traces de-minify in PostHog.
- [ ] Confirm the returning-visitor path also calls `identify` so existing authenticated sessions are consistently linked to the same distinct ID.
- [ ] Provide required runtime data sources such as `POSTGRES_URL` before re-running the production build, since page data collection currently fails without it.

### Agent skill

The project now includes a PostHog skill folder under `.claude/skills/integration-nextjs-pages-router`. This can be reused by future coding agents to follow the same current integration guidance and framework-specific patterns.

</wizard-report>
