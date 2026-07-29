# PostHog setup report

PostHog browser analytics, user identification, global browser error capture, eight client-side event call sites, and a starter dashboard were set up for this Next.js Pages Router app.

## Installed and initialized

- Installed `posthog-js` `^1.407.8` and `posthog-node` `^5.46.1` with `pnpm add posthog-js posthog-node`; `pnpm install` subsequently completed successfully.
- Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to the local `.env` through the wizard tools and documented the variable names in `.env.example`.
- Centralized browser initialization in `instrumentation-client.ts`, using those environment variables, `defaults: '2026-01-30'`, `capture_exceptions: true`, development debugging, and same-origin tracing headers.
- No server-side PostHog event instrumentation was added. `posthog-node` is installed for future Pages Router API/server work.

## Events instrumented

These are client-side capture call sites recorded in `.posthog-wizard-cache/.posthog-events.json`. The run did not exercise the application or observe events arriving in PostHog, so these should be treated as instrumented/planned events, not confirmed deliveries.

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | An existing account successfully completes sign-in. | `components/login.tsx` |
| `user_signed_up` | A new account successfully completes registration. | `components/login.tsx` |
| `checkout_started` | A visitor selects a plan and successfully starts checkout. | `pages/pricing.tsx` |
| `subscription_management_opened` | A team member opens the billing customer portal. | `pages/dashboard/index.tsx` |
| `team_member_removed` | A team member is successfully removed from the team. | `pages/dashboard/index.tsx` |
| `team_member_invited` | An owner successfully sends a team invitation. | `pages/dashboard/index.tsx` |
| `account_updated` | An authenticated user successfully saves account settings. | `pages/dashboard/general.tsx` |
| `user_signed_out` | An authenticated user successfully signs out. | `components/header.tsx` |

## Identity and error tracking

User identification was wired for the browser. `pages/_app.tsx` identifies authenticated users with the stable database user ID (`String(user.id)`) and person properties, and resets when authenticated state clears. The sign-in and sign-up captures identify from the successful API response before capturing; other browser events inherit the centralized identity. Sign-out also resets PostHog in `components/header.tsx`.

Global browser error tracking was already available through `capture_exceptions: true` in `instrumentation-client.ts`; no additional error boundary or scattered manual error captures were added.

## Dashboard

Created `Analytics basics (wizard)` with four tagged `(wizard)` insights: authentication activity, checkout starts by plan, team engagement activity, and the signup-to-checkout funnel.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1924729)

The dashboard and its insights were created successfully, but may initially be empty because event delivery was not exercised during this run.

## What the run verified

- SDK installation and dependency resolution completed successfully.
- The integration compiled successfully and Next.js linting/type validation completed during the build attempts.
- The configured PostHog environment keys were present according to the environment-key check.
- The dashboard and four insights were created successfully.
- The recorded source review confirmed captures occur after their corresponding successful client actions and that capture properties do not contain PII.

## What the run did not verify

- No application session was started and no event was observed arriving in PostHog.
- No test suite, standalone lint command, or end-to-end event-delivery check was run.
- Server-side/API and webhook events remain uninstrumented.

## Build conflict

`pnpm build` was run three times. Each run compiled successfully and completed Next.js linting/type validation, but the build could not finish static page-data collection because the existing local `.env` lacks the pre-existing required `POSTGRES_URL`. The final run reported `Failed to collect page data for /`; an earlier run reported the same environment failure for `/pricing`. This environment failure prevented a complete production build; it was not a PostHog compilation or type-validation failure.

## Before you merge

- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deploy environment, not only local `.env`; verify the names documented in `.env.example`.
- [ ] Provide the required existing `POSTGRES_URL` and run a full production build; inspect `instrumentation-client.ts`, `pages/_app.tsx`, and each instrumented file if lint or type errors appear.
- [ ] Run the test suite and update any mocks or fixtures affected by captures in `components/login.tsx`, `pages/pricing.tsx`, `pages/dashboard/index.tsx`, `pages/dashboard/general.tsx`, and `components/header.tsx`.
- [ ] Exercise sign-in, sign-up, checkout, subscription management, team invitation/removal, account updates, and sign-out, then confirm the corresponding events arrive in PostHog and appear in the dashboard.
- [ ] Verify a returning authenticated session identifies through the effect in `pages/_app.tsx`, so returning users do not fragment onto anonymous distinct IDs.
- [ ] If production browser bundles are minified, configure source-map upload in CI so PostHog error stack traces are readable.
