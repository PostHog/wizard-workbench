# PostHog setup report

PostHog browser analytics, user identification, exception autocapture, eight product events, and a starter dashboard were added to the Next.js Pages Router app.

## Installed and initialized

- Installed `posthog-js` 1.407.3 with pnpm. The review step removed the unused `posthog-node` dependency because no server-side client or callsite was implemented.
- `instrumentation-client.ts` initializes `posthog-js` once using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from the environment. Development reports missing configuration loudly; production remains a no-op when configuration is absent.
- SDK defaults remain enabled, including autocapture and session recording behavior. Exception capture is enabled with `capture_exceptions: true`.
- The real environment keys were added to `.env`; `.env.example` documents the required variable names.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | An existing user successfully signs in. | `components/login.tsx` |
| `user_signed_up` | A new user successfully creates an account. | `components/login.tsx` |
| `user_signed_out` | An authenticated user successfully signs out. | `components/header.tsx` |
| `checkout_started` | An authenticated user begins checkout for a selected subscription plan. | `pages/pricing.tsx` |
| `subscription_management_opened` | An authenticated user opens the Stripe subscription management portal. | `pages/dashboard/index.tsx` |
| `team_member_removed` | An authenticated user successfully removes a member from their team. | `pages/dashboard/index.tsx` |
| `team_member_invited` | An authenticated owner successfully sends a team invitation. | `pages/dashboard/index.tsx` |
| `account_settings_updated` | An authenticated user successfully updates account settings. | `pages/dashboard/general.tsx` |

The capture step verified seven call sites covering these eight event contracts, with captures placed in successful action handlers and no PII in event properties. The run did **not** observe events arriving in PostHog, so ingestion is unconfirmed.

## Identity

User identification is wired. Login and signup identify with the database user primary key; email, name, and role are person properties rather than event properties. Refreshes re-establish identity from the session-backed user, and logout resets only after a successful sign-out response. The run verified the relevant database ID and authentication response flow, but did not observe identified events arriving in PostHog.

## Error tracking

Global uncaught browser exception capture is enabled by `capture_exceptions: true` in `instrumentation-client.ts`. No manual exception handlers or custom Pages Router error boundary were added. The run verified the configuration, but did not trigger or observe an exception in PostHog.

## Dashboard

The dashboard **Analytics basics (wizard)** was created with four insight tiles covering authentication activity, signup-to-checkout conversion, checkout starts by plan, and account/team actions. Insights use the exact event names above and the last 30 days. It may initially be empty because event arrival was not verified.

[Open the Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1912874)

## Unresolved issues and build conflict

- Three authenticated API mutations remain uninstrumented server-side: account update, team invitation, and team member removal. Checkout completion and Stripe webhooks are also uninstrumented. Leaving this unresolved means server-side actions and completed payments may be missing from analytics even when browser events work.
- The production build compiled successfully and passed linting and type checking, but the run could not complete static page-data collection because the pre-existing `POSTGRES_URL` environment variable is unset. This is a build-environment conflict, not an observed PostHog integration compile error. A deployment must provide the existing database configuration.
- No event flow, exception delivery, or dashboard population was confirmed during the run.

## Next steps

1. Configure `POSTGRES_URL` in the build/deployment environment and run the full production build again.
2. Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`.
3. Exercise sign-in, signup, logout, checkout start, subscription management, team actions, and account settings in a real browser, then confirm the eight events arrive in PostHog with the expected identified user.
4. Decide whether server-side instrumentation is required for the three API mutations, checkout completion, and Stripe webhooks. If added later, use the authenticated numeric user ID as `distinctId` and await flush before short-lived API responses.
5. Trigger an uncaught browser exception in a controlled environment and confirm it appears in PostHog Error Tracking.

## Before you merge

- [ ] Run a full production build and resolve any remaining errors; inspect the generated integration around `instrumentation-client.ts:1` and the instrumented handlers in `components/login.tsx`, `components/header.tsx`, `pages/pricing.tsx`, `pages/dashboard/index.tsx`, and `pages/dashboard/general.tsx`.
- [ ] Run the test suite and update mocks or fixtures for the new PostHog calls; inspect the event handlers in `components/login.tsx:1`, `components/header.tsx:1`, `pages/pricing.tsx:1`, `pages/dashboard/index.tsx:1`, and `pages/dashboard/general.tsx:1`.
- [ ] Confirm `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` are present in `.env.example:1` and configured in deployment environments, not only `.env`.
- [ ] Because authentication and identify are wired, verify the returning-session path calls identify again in `components/header.tsx:1` so refreshes do not fragment users onto anonymous IDs.
