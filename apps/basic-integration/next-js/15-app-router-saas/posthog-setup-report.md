# PostHog setup report

PostHog product analytics, authenticated identity, server-side event capture, browser exception tracking, and a starter dashboard were added to the Next.js App Router application.

## What was installed and initialized

- Installed `posthog-js` 1.407.3 and `posthog-node` 5.46.1 with pnpm; `package.json` and `pnpm-lock.yaml` were updated.
- Initialized the browser SDK once in `instrumentation-client.ts` using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- Added the variable names to `.env.example`; the configured values are present in the local `.env` according to the environment-key check. Secrets are referenced through environment variables rather than source code.
- Server-side capture uses `posthog-node` in `lib/posthog-server.ts`, with exception autocapture, immediate flushing, and a production-safe no-op when configuration is absent.
- No reverse proxy or Content-Security-Policy changes were made.

## Instrumented events

These are event definitions recorded by the run. The run verified that the calls exist in the changed files; it did **not** observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | An authenticated user successfully signs in. | `app/(login)/actions.ts` |
| `user_signed_up` | A new account is successfully created. | `app/(login)/actions.ts` |
| `user_signed_out` | An authenticated user signs out. | `app/(login)/actions.ts` |
| `account_updated` | An authenticated user successfully updates account details. | `app/(login)/actions.ts` |
| `password_updated` | An authenticated user successfully changes their password. | `app/(login)/actions.ts` |
| `account_deleted` | An authenticated user successfully deletes their account. | `app/(login)/actions.ts` |
| `team_member_invited` | A team owner successfully sends a member invitation. | `app/(login)/actions.ts` |
| `team_member_removed` | A team member is successfully removed. | `app/(login)/actions.ts` |
| `checkout_started` | An authenticated user starts Stripe subscription checkout. | `lib/payments/stripe.ts` |
| `subscription_checkout_completed` | A Stripe checkout successfully updates the team subscription. | `app/api/stripe/checkout/route.ts` |

Server events use the authenticated database user ID as `distinctId` and do not put PII in event properties. Stripe webhook-only subscription changes were not instrumented because that callback did not expose a stable user ID; the user-attributable checkout completion route is instrumented instead.

## User identification

Identification was wired in `app/(dashboard)/layout.tsx`. When the session-backed `/api/user` response provides an authenticated user, the browser SDK calls `identify()` with the stable numeric user ID and keeps email, name, and role as person properties. Logout calls `reset()` before clearing the application session. This covers authenticated dashboard loads and refreshes. The run did not execute a browser session, so it did not confirm that identify calls or events arrived in PostHog.

## Error tracking

Global browser exception tracking is enabled through `capture_exceptions: true` in `instrumentation-client.ts`. No second provider, manual boundary, or server error handler was added. The run verified configuration in source; it did not trigger or observe an exception in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1912862)

The dashboard contains three tagged insights: an account acquisition funnel, a checkout conversion funnel, and an authentication activity trend. It is expected to be empty or incomplete until the application sends events; arrival of those events was not observed during this run.

## Build and verification status

`pnpm install` completed successfully and reported the lockfile was current. `pnpm build` compiled successfully and completed Next.js linting and type validation. It then failed during page-data collection for `/api/stripe/webhook` because the pre-existing database module requires `POSTGRES_URL`, which is absent from this environment:

> `POSTGRES_URL environment variable is not set`

This is an environment/provisioning blocker unrelated to the PostHog changes. The build therefore did not complete end-to-end. No dedicated lint or standalone type-check script exists in `package.json`. The run did not verify event delivery, dashboard population, or production deployment configuration.

## Next steps

1. Provide `POSTGRES_URL` in the build/deployment environment and rerun the full production build.
2. Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deployed environment, not only the local `.env`; keep the exact names documented in `.env.example`.
3. Exercise sign-up, sign-in, sign-out, account changes, team membership, and checkout in a real browser session, then confirm the ten event names arrive with stable user IDs in PostHog.
4. Confirm the dashboard insights populate after those flows run.
5. Run the project test suite and update any mocks or fixtures affected by the new server-side capture calls.

## Before you merge

- [ ] Run a full production build after setting `POSTGRES_URL`; inspect `app/api/stripe/webhook/route.ts` and the existing database configuration if page-data collection still fails.
- [ ] Run the test suite; review the instrumented action paths in `app/(login)/actions.ts`, `lib/payments/stripe.ts`, and `app/api/stripe/checkout/route.ts` for mocks or fixtures that need updates.
- [ ] Verify `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from `.env.example` are configured in each deployment environment; check initialization in `instrumentation-client.ts`.
- [ ] In an authenticated browser session, verify returning dashboard loads identify the user and logout resets identity; inspect `app/(dashboard)/layout.tsx` around the `identify()` and `reset()` calls.
- [ ] Trigger a representative client exception and confirm it appears in PostHog Error Tracking; inspect `instrumentation-client.ts` around `capture_exceptions: true`.
