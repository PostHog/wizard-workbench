# PostHog setup report

PostHog was added to the Next.js App Router app with browser and server SDK initialization, authenticated-user attribution, ten event call sites, global client error tracking, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` `1.408.0` and `posthog-node` `5.46.1` with pnpm; `package.json` and `pnpm-lock.yaml` were updated.
- Browser PostHog is initialized once in `instrumentation-client.ts` using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`, with defaults, exception capture, and development debug logging.
- `.env.example` documents both environment variable names. The real values were set in `.env` through the wizard environment tooling; secrets are not embedded in source.
- Server-side events use the guarded, environment-configured helper in `lib/posthog-server.ts`, with an explicit flush for each capture.
- No Content-Security-Policy was present, so no CSP changes were required.

## Events instrumented

These are event call sites recorded in `.posthog-wizard-cache/.posthog-events.json`. The run verified their instrumentation locations, not that events were received by PostHog.

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | An authenticated user successfully signs in. | `app/(login)/actions.ts` |
| `user_signed_up` | A new user account and team membership are created. | `app/(login)/actions.ts` |
| `password_updated` | An authenticated user successfully changes their password. | `app/(login)/actions.ts` |
| `account_updated` | An authenticated user successfully updates account details. | `app/(login)/actions.ts` |
| `account_deleted` | An authenticated user successfully deletes their account. | `app/(login)/actions.ts` |
| `team_member_invited` | A team owner successfully sends a team invitation. | `app/(login)/actions.ts` |
| `team_member_removed` | A team member is removed by an authenticated team member. | `app/(login)/actions.ts` |
| `user_signed_out` | An authenticated user signs out. | `app/(dashboard)/layout.tsx` |
| `checkout_started` | An authenticated user begins a subscription checkout. | `app/(dashboard)/pricing/submit-button.tsx` |
| `subscription_checkout_completed` | A completed Stripe checkout updates the team subscription. | `app/api/stripe/checkout/route.ts` |

The capture step confirmed that server events run after successful mutations, checkout start is in the actual submit handler, checkout completion follows the subscription update, and logout capture precedes reset. No Stripe webhook event was added because the webhook has no verified actor identity; the identifiable checkout-success route is the authoritative completion path.

## Identification and attribution

Identification was **wired** in `app/(dashboard)/layout.tsx`. The authenticated user's stable database ID is used as the distinct ID, while email, optional name, and role are sent as person properties rather than event properties. The dashboard boundary identifies on entry and refresh, and successful logout calls `posthog.reset()` so a later user does not inherit the previous identity.

Server captures explicitly use the authenticated database ID. Browser events and browser exceptions rely on the dashboard identification boundary. The run did not observe events arriving in PostHog, so delivery and runtime attribution remain unconfirmed.

## Error tracking

`app/global-error.tsx` was added as the Next.js App Router global error boundary. It captures the boundary error once with the initialized `posthog-js` singleton and preserves the framework reset/retry behavior. The run verified the boundary was created and that the build reached compilation/type validation; it did not trigger an error and observe an exception event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926609) was created with four `(wizard)` insights:

- signup/sign-in trends
- checkout starts/completions trends
- signup-to-checkout completion funnel
- account/team activity trends

The insights use the captured event names and were created for a 30-day range; the funnel uses a 14-day ordered conversion window. They may currently be empty because the run did not observe instrumented events arriving.

## Verification and unresolved build conflict

- `pnpm install` completed with an up-to-date lockfile.
- The production build compiled successfully and completed Next.js lint/type validation.
- The production build then failed during page-data collection for `/_not-found` because `POSTGRES_URL environment variable is not set`.
- This is a pre-existing environment configuration issue outside the PostHog changeset. No standalone lint or typecheck script exists in `package.json`.
- No event delivery, dashboard population, or error-event delivery was observed during the run.

## Before you merge

- [ ] Run a full production build with the app's required database configuration, then confirm the existing `POSTGRES_URL` issue is resolved; inspect `app/(login)/actions.ts`, `instrumentation-client.ts`, and `lib/posthog-server.ts` if new build, lint, or type errors appear.
- [ ] Run the test suite and update any mocks or fixtures affected by captures in `app/(login)/actions.ts`, `app/(dashboard)/layout.tsx`, `app/(dashboard)/pricing/submit-button.tsx`, and `app/api/stripe/checkout/route.ts`.
- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deploy environment, not only locally; verify the names against `.env.example` and `instrumentation-client.ts`.
- [ ] Exercise sign-in, sign-up, logout, checkout start, checkout completion, and account/team actions, then confirm the ten named events arrive in PostHog and are attributed as intended; inspect the corresponding call sites listed in the events table.
- [ ] Exercise the global error boundary and confirm the exception appears in PostHog; inspect `app/global-error.tsx`.
- [ ] For authenticated returning sessions, confirm the dashboard refresh path still calls `identify` before meaningful browser activity; inspect `app/(dashboard)/layout.tsx`.
