# PostHog setup report

PostHog product analytics, authenticated user identification, browser error tracking, server-side event capture, and a starter dashboard were added to the Next.js App Router application.

## Installed and initialized

- Installed `posthog-js` 1.407.8 and `posthog-node` 5.46.1 with pnpm; `package.json` and `pnpm-lock.yaml` were updated.
- Client initialization lives in `instrumentation-client.ts`, the Next.js 15.3+ initialization point. It creates one browser client only when `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` are configured, keeps default capture behavior, enables exception capture, and reports missing configuration during development while remaining a production no-op.
- The real environment values were configured in `.env` through the wizard; the variable names are documented in `.env.example`.
- Server captures use the guarded `lib/posthog-server.ts` helper with `posthog-node`, configured environment values, exception autocapture, stable authenticated database IDs, and an awaited flush before server actions and route handlers return.

## Events instrumented

These are instrumented events recorded in the run's event plan. The run did not observe any event arriving in PostHog, so this table describes instrumentation rather than confirmed delivered volume.

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | An authenticated user successfully signs in. | `app/(login)/actions.ts` |
| `user_signed_up` | A new user account is successfully created. | `app/(login)/actions.ts` |
| `user_signed_out` | An authenticated user signs out. | `app/(login)/actions.ts` |
| `account_updated` | An authenticated user updates account information. | `app/(login)/actions.ts` |
| `password_updated` | An authenticated user successfully changes their password. | `app/(login)/actions.ts` |
| `account_deleted` | An authenticated user deletes their account after the deletion succeeds. | `app/(login)/actions.ts` |
| `team_member_invited` | A team owner creates an invitation for a team member. | `app/(login)/actions.ts` |
| `team_member_removed` | A team member is removed by an authenticated team user. | `app/(login)/actions.ts` |
| `subscription_checkout_started` | An authenticated user starts a subscription checkout session. | `lib/payments/stripe.ts` |
| `subscription_checkout_completed` | A Stripe checkout completion updates a user's team subscription. | `app/api/stripe/checkout/route.ts` |

## Identity and error tracking

User identification was wired. `app/(dashboard)/layout.tsx` calls `posthog.identify` with the stable database `User.id` when authenticated dashboard state loads, placing email, optional name, and role on the person rather than event properties. Logout resets PostHog before clearing the session. Same-origin tracing headers were also enabled in `instrumentation-client.ts` for API requests.

A client global error boundary was added at `app/global-error.tsx`. It captures uncaught errors with `posthog.captureException(error)` in an effect and preserves recovery through `reset()`. No individual routes were wrapped. The run did not observe an exception arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924677)

The dashboard contains five wizard-tagged insights covering authentication activity, account lifecycle changes, team collaboration activity, subscription checkout conversion, and subscription checkout activity. The dashboard was created successfully, but its data is unconfirmed and may initially be empty until instrumented paths are exercised.

## Verification and unresolved build conflict

The review step ran `pnpm install` successfully. `pnpm build` compiled the integration and passed linting and type validity checks, but full production build completion was not verified: static page-data collection failed because the pre-existing `POSTGRES_URL` configuration is absent. The failure first surfaced through `/api/stripe/webhook` and, after the review fixes, through `/api/stripe/checkout`. This is unrelated to the PostHog changes. No lint command or standalone typecheck script exists in `package.json`, and no test suite was run.

The run did not verify that events flow to PostHog, that browser exception reports arrive, or that dashboard tiles contain data. Subscription webhook lifecycle events remain intentionally uninstrumented because that webhook path did not provide a trustworthy application user ID.

## Before you merge

- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deploy environment, matching the names documented in `.env.example`; do not rely only on local `.env` (`instrumentation-client.ts`, `.env.example`).
- [ ] Provide the application's required `POSTGRES_URL` and rerun the full production build; resolve any resulting errors, noting that the wizard only reached compilation/type validation (`app/api/stripe/webhook/route.ts`, `app/api/stripe/checkout/route.ts`).
- [ ] Run the test suite and update any mocks or fixtures affected by the new server captures and global error boundary (`app/(login)/actions.ts`, `lib/payments/stripe.ts`, `app/api/stripe/checkout/route.ts`, `app/global-error.tsx`).
- [ ] Exercise sign-in, sign-up, account/team actions, and subscription checkout in a non-automated browser session, then confirm the ten named events arrive in PostHog and populate the dashboard (`app/(login)/actions.ts`, `lib/payments/stripe.ts`, `app/api/stripe/checkout/route.ts`).
- [ ] Confirm a returning authenticated dashboard session identifies the same stable user and that logout resets identity (`app/(dashboard)/layout.tsx`).
- [ ] Trigger a controlled application error and confirm the global exception appears in PostHog (`app/global-error.tsx`).
