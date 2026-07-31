# PostHog setup report

**Summary:** PostHog browser and server analytics, authenticated-user identification, exception capture, a starter dashboard, and ten product-event call sites were added and reviewed for this Next.js 15 App Router application.

## Installed and initialized

- Installed `posthog-js` `^1.409.5` and `posthog-node` `^5.47.2`; `package.json` and `pnpm-lock.yaml` were updated. The install completed successfully with pnpm.
- Browser initialization lives in `instrumentation-client.ts`. It reads `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`, initializes once, keeps default capture behavior, enables exception autocapture, and sends browser traffic through the `/ingest` proxy.
- `next.config.ts` routes `/ingest/static/*` and `/ingest/array/*` to the derived assets host and other `/ingest/*` traffic to the configured PostHog host. No application CSP was found or changed.
- Server instrumentation lives in `lib/posthog-server.ts`, uses `posthog-node`, reads the same environment variables, and flushes after each short-lived server event. Missing configuration is a development error and a production no-op, per the integration contract.
- `.env.example` documents `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`; the real values were configured in the local `.env` through wizard tools. Deploy environments still need these variables.

## Events instrumented

These are instrumented call sites recorded in `.posthog-wizard-cache/.posthog-events.json`. The run did **not** observe events arriving in PostHog, so these are not claimed as captured in production.

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | An authenticated user successfully signs in. | `app/(login)/actions.ts` |
| `user_signed_up` | A new user account is created and a session is established. | `app/(login)/actions.ts` |
| `user_signed_out` | An authenticated user ends their session. | `app/(login)/actions.ts` |
| `password_updated` | An authenticated user successfully changes their password. | `app/(login)/actions.ts` |
| `account_updated` | An authenticated user successfully updates account details. | `app/(login)/actions.ts` |
| `account_deleted` | An authenticated user successfully deletes their account. | `app/(login)/actions.ts` |
| `team_member_invited` | An authenticated owner successfully sends a team invitation. | `app/(login)/actions.ts` |
| `team_member_removed` | An authenticated user successfully removes a member from their team. | `app/(login)/actions.ts` |
| `checkout_started` | An authenticated user begins Stripe subscription checkout. | `lib/payments/stripe.ts` |
| `subscription_checkout_completed` | A Stripe checkout return successfully updates the user's team subscription. | `app/api/stripe/checkout/route.ts` |

Suggested future coverage from the capture handoff, not implemented in this run: Stripe webhook lifecycle events, customer-portal interactions, and failed authentication or payment outcomes.

## Identity and error tracking

- **Identification was wired.** `app/(dashboard)/layout.tsx` identifies the authenticated database user with `String(user.id)` after `/api/user` resolves, placing email, optional name, and role in person properties rather than event properties. It resets before an account switch and after sign-out. The run did not verify identity or events arriving in PostHog.
- `app/global-error.tsx` calls `posthog.captureException(error)` from the global Next.js error boundary. Initialization also enables exception autocapture. The run verified the boundary exists and is wired, but did not trigger an error or observe an error event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935637)

The dashboard was created successfully with five wizard-tagged insights covering authentication activity, signup-to-checkout conversion, subscription checkout completions, account/team changes, and account deletions. The insights may initially be empty because event delivery was not observed during this run.

## Verification and unresolved issue

The SDK install completed. Two production builds compiled successfully and completed Next.js lint/type validation. Both stopped during page-data collection for `/api/team` because `POSTGRES_URL environment variable is not set`.

This is a pre-existing environment/build conflict, not an observed PostHog code compilation failure. A complete production build remains unverified until `POSTGRES_URL` is supplied.

No lint or standalone typecheck script is defined in `package.json`. No automated test suite was run by the recorded steps.

## Before you merge

- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`; verify the names against `.env.example` (lines 11–12).
- [ ] Provide the required `POSTGRES_URL` and rerun the full production build; the current run cannot complete page-data collection for `/api/team` without it.
- [ ] Run the test suite and update any mocks or fixtures affected by the server captures in `app/(login)/actions.ts`, `lib/payments/stripe.ts`, and `app/api/stripe/checkout/route.ts`.
- [ ] Exercise sign-in, sign-up, account/team actions, checkout start, checkout return, sign-out, and the global error boundary, then confirm the corresponding events and exception appear in PostHog; this run only verified code placement and build compilation.
- [ ] Confirm the returning authenticated-session path reaches the identify effect in `app/(dashboard)/layout.tsx` (the identity wiring is present, but runtime delivery was not observed).
- [ ] If production serves minified browser bundles, add source-map upload to CI so Error Tracking stack traces are de-minified.
