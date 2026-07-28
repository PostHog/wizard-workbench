# PostHog setup report

PostHog product analytics, browser identity, server-side event capture, exception autocapture, and a starter dashboard were added to this Next.js Pages Router app.

## Installed and initialized

- Added `posthog-js` 1.407.5 and `posthog-node` 5.46.1 with pnpm; `package.json` and `pnpm-lock.yaml` were updated.
- Browser initialization lives in `instrumentation-client.ts` and is guarded by `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`. Missing configuration is reported in development and is a production no-op. Default capture behavior remains enabled, including exception capture.
- The real PostHog environment values were configured in `.env`; `.env.example` documents the required variable names.
- Server/API capture uses `lib/posthog-server.ts`, authenticated stable database user IDs, `flushAt: 1`, `flushInterval: 0`, and an awaited shutdown for short-lived API routes. Capture properties exclude PII.

## Events instrumented

The run documented 11 instrumented events. The run verified capture call sites in source, but did **not** observe events arriving in PostHog; the dashboard insights therefore may have no data until the flows are exercised.

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | An authenticated user successfully signs in. | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | A new user account is created successfully. | `pages/api/auth/sign-up.ts` |
| `team_created` | A new workspace is created during sign-up. | `pages/api/auth/sign-up.ts` |
| `team_invitation_accepted` | A new user accepts a pending team invitation during sign-up. | `pages/api/auth/sign-up.ts` |
| `checkout_started` | An authenticated user starts a Stripe checkout session. | `pages/api/stripe/create-checkout.ts` |
| `subscription_activated` | A successful Stripe checkout activates a team subscription. | `pages/api/stripe/checkout.ts` |
| `customer_portal_opened` | An authenticated user opens Stripe’s customer billing portal. | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | An authenticated user sends a team invitation. | `pages/api/team/invite.ts` |
| `team_member_removed` | An authenticated user removes a team member. | `pages/api/team/remove-member.ts` |
| `account_updated` | An authenticated user successfully updates account details. | `pages/api/account/update.ts` |
| `user_signed_out` | An authenticated user completes sign-out before analytics state resets. | `components/header.tsx` |

## Identification and attribution

User identification **was wired**. `pages/_app.tsx` reads the authenticated user from `/api/user` and identifies once per stable database user ID; successful login and sign-up responses provide the ID and person properties, and logout resets analytics only after successful sign-out. Email, name, and role are person properties rather than event properties. Server events use authenticated database IDs.

No unresolved `DISTINCT_ID` placeholder was reported by the run. Attribution was implemented in source, but event delivery and resulting attribution were not observed in PostHog.

## Error tracking

`instrumentation-client.ts` enables `capture_exceptions: true`, providing one global browser mechanism for uncaught exceptions and unhandled promise rejections. No additional error wrapper or manual error-capture calls were added. Server/API exception tracking was not added in this run.

## Dashboard

The dashboard **Analytics basics (wizard)** was created in project 483112 with five tagged insights covering signup, checkout-to-subscription, authentication, team collaboration, and billing/account engagement over the rolling 30-day period.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1919783)

The dashboard and insights are configured from the instrumented event names, but the run did not verify that any event has arrived.

## Verification and build conflict

- `pnpm install` completed successfully and reported the expected SDK versions.
- The review run reports that linting, type validation, and optimized compilation completed successfully after the integration changes.
- The full production build did **not** complete. During page-data collection for `/`, the pre-existing application database configuration failed because `POSTGRES_URL` is not set. The reported error came from `lib/db/drizzle.ts`: `POSTGRES_URL environment variable is not set`. This is an application configuration conflict, not a reported PostHog compilation or type-validation failure.
- No standalone lint or typecheck script is defined in `package.json`.
- No Content-Security-Policy was detected, so no CSP change or CSP verification was needed.

## Next steps

1. Configure `POSTGRES_URL` for the application and rerun the full production build.
2. Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deployment environment, not only locally.
3. Exercise sign-in, sign-up, workspace/team, billing, account-update, and sign-out flows in a real browser, then confirm the corresponding events arrive in PostHog and are attributed to the expected stable user.
4. Run the application test suite after adding or updating mocks for the instrumented API routes.
5. Confirm the five dashboard insights populate after test events arrive.

## Before you merge

- [ ] Run a full production build after setting `POSTGRES_URL`; inspect `pages/index.tsx` and `lib/db/drizzle.ts` if page-data collection still fails.
- [ ] Run the test suite and update mocks or fixtures for the instrumented handlers in `pages/api/auth/sign-in.ts`, `pages/api/auth/sign-up.ts`, `pages/api/stripe/create-checkout.ts`, `pages/api/stripe/checkout.ts`, `pages/api/stripe/customer-portal.ts`, `pages/api/team/invite.ts`, `pages/api/team/remove-member.ts`, and `pages/api/account/update.ts`.
- [ ] Confirm `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` are present in deployment configuration, matching the names documented in `.env.example` and read by `instrumentation-client.ts` and `lib/posthog-server.ts`.
- [ ] Exercise an already-authenticated returning-visitor path and verify `pages/_app.tsx` identifies the stable user on refresh rather than leaving events on an anonymous distinct ID.
