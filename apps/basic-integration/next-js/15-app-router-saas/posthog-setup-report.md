# PostHog setup report

PostHog product analytics and error tracking were added to the Next.js App Router application, with browser and server SDKs, authenticated identity, eleven business events, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` 1.407.3 and `posthog-node` 5.46.1 with pnpm.
- Browser analytics is initialized once in `instrumentation-client.ts` from `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`, with exception capture enabled. Missing configuration fails loudly in development and remains a production no-op.
- Server-side events use `lib/posthog-server.ts` and `posthog-node`, with immediate flushing for short-lived Next.js requests.
- The configured environment keys are present, and `.env.example` documents both names. Event delivery itself was not exercised or observed during this run.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | An authenticated user successfully signs in. | `app/(login)/actions.ts` |
| `user_signed_up` | A new user account and initial team membership are created. | `app/(login)/actions.ts` |
| `password_updated` | An authenticated user successfully changes their password. | `app/(login)/actions.ts` |
| `account_updated` | An authenticated user successfully updates account details. | `app/(login)/actions.ts` |
| `account_deleted` | An authenticated user successfully deletes their account. | `app/(login)/actions.ts` |
| `team_member_removed` | An authenticated user removes a team member. | `app/(login)/actions.ts` |
| `team_member_invited` | An authenticated user sends a team invitation. | `app/(login)/actions.ts` |
| `checkout_started` | An authenticated user starts subscription checkout for a selected price. | `lib/payments/stripe.ts` |
| `subscription_checkout_completed` | Stripe checkout successfully updates a team subscription. | `app/api/stripe/checkout/route.ts` |
| `subscription_status_changed` | A Stripe webhook changes a team subscription status. | `lib/payments/stripe.ts` |
| `user_signed_out` | An authenticated browser user signs out. | `app/(dashboard)/layout.tsx` |

These are instrumented call sites verified by code review; no event was observed arriving in PostHog during the run.

## Identity

User identification is wired at the authenticated dashboard boundary in `app/(dashboard)/layout.tsx`: the stable application user ID is passed to `identify`, while email, name, and role are person properties. The browser identity is reset on sign-out after `user_signed_out` is captured. Server-side events use authenticated stable user IDs where available; Stripe webhook events use `team:<teamId>` because no individual authenticated actor exists in that request. Team-level attribution and cross-surface identity were not independently validated.

## Error tracking

`app/global-error.tsx` is a client global error boundary. It reports the received error once with `posthog.captureException(error)` through the initialized browser singleton and preserves recovery through the supplied reset callback. Exception delivery was not observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914270) contains five tagged insights covering account signups, signup-to-checkout conversion, subscription changes, team collaboration, and account lifecycle actions. The dashboard may remain empty until the application sends events.

## What the run verified

- `pnpm install` completed and the lockfile was current.
- Next.js compilation completed successfully, and Next.js type validation completed successfully.
- The changed integration files were reviewed for client/server SDK separation, stable identity, non-PII event properties, reset ordering, and awaited server flushes.
- No CSP was present in the project, so no CSP changes were required.

## What remains unconfirmed or unresolved

- Event and exception delivery were not exercised, so capture, ingestion, and dashboard population remain unconfirmed.
- A full production build was not completed: page-data collection for `/api/stripe/webhook` failed because the pre-existing `lib/db/drizzle.ts` requires `POSTGRES_URL`. This is unrelated to the PostHog changes but prevents end-to-end build verification.
- The webhook has no authenticated user context; its `team:<teamId>` distinct ID provides team-scoped attribution, but it does not establish an individual actor. If individual subscription attribution is required, the webhook’s identity mapping must be resolved.

## Next steps

1. Configure `POSTGRES_URL` in the build/deploy environment and rerun the production build.
2. Sign in, sign up, update an account, invite/remove a team member, start and complete checkout, change subscription status, and sign out in a real browser; verify the eleven event names and their properties in PostHog.
3. Trigger a controlled application error and verify the exception appears in PostHog Error Tracking.
4. Confirm the identified user ID, person properties, sign-out reset, and team-scoped webhook attribution are correct for the product’s reporting needs.
5. Ensure the two `NEXT_PUBLIC_POSTHOG_*` variables are configured in every deployment environment, not only locally.

## Before you merge

- [ ] Run a full production build after setting `POSTGRES_URL`; inspect `lib/db/drizzle.ts:8-9` if page-data collection still fails, and fix any lint or type errors introduced by the integration.
- [ ] Run the test suite (no test script is defined in `package.json`); update mocks or fixtures for the instrumented call sites if needed.
- [ ] Confirm `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from `.env.example` are set in each deployment environment; review `instrumentation-client.ts:4-8` and `lib/posthog-server.ts`.
- [ ] Exercise the authenticated returning-visitor path and confirm `app/(dashboard)/layout.tsx:30-34` identifies the existing user on page refresh.
- [ ] Verify event delivery and error delivery in PostHog by exercising the call sites listed above; the run only verified compilation and code placement, not arrival.
