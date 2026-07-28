# PostHog setup report

PostHog browser analytics, authenticated-user attribution, exception capture, seven action events, and a starter dashboard were added to this Next.js 15 App Router application.

## Installed and initialized

- Installed `posthog-js` 1.407.5 with pnpm.
- Initialized the browser SDK once in `instrumentation-client.ts`, using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from the environment.
- Kept default capture behavior enabled, including exception autocapture, and enabled development debugging.
- Documented the variables in `.env.example`; the configured local `.env` contains both values.
- No `posthog-node` server SDK was added. Existing server actions and route handlers therefore do not emit confirmed server-side outcome events.
- No CSP change was needed because the review found no application CSP.

## Events instrumented

These are client-side `posthog.capture()` calls placed in authenticated action handlers. The run did not start the application or observe any event arriving in PostHog, so all event delivery remains **unconfirmed**.

| Event | What it measures | File |
|---|---|---|
| `checkout_started` | An authenticated user starts checkout from a pricing plan. | `app/(dashboard)/pricing/submit-button.tsx` |
| `subscription_management_opened` | An authenticated user opens the Stripe subscription management portal. | `app/(dashboard)/dashboard/page.tsx` |
| `account_update_submitted` | An authenticated user submits account information changes. | `app/(dashboard)/dashboard/general/page.tsx` |
| `password_update_submitted` | An authenticated user submits a password change. | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_deletion_submitted` | An authenticated user submits an account deletion request. | `app/(dashboard)/dashboard/security/page.tsx` |
| `team_member_removal_submitted` | An authenticated user submits a team member removal request. | `app/(dashboard)/dashboard/page.tsx` |
| `team_invitation_submitted` | An authenticated user submits a team invitation; the event includes the selected `invited_role`. | `app/(dashboard)/dashboard/page.tsx` |

## Identity and error tracking

User identification was wired. The dashboard layout identifies the loaded database user exactly once per user ID using `String(user.id)`, stores email/name/role as person properties rather than event properties, resets on account switching, and resets on logout. The run did not verify identity or event delivery in a live browser session.

A framework-level global error boundary was added at `app/global-error.tsx`. It calls `posthog.captureException(error)` once and preserves recovery through the existing `reset()` flow. Exception autocapture also remains enabled in `instrumentation-client.ts`. The run did not trigger an application error or observe an exception in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918867)

The dashboard contains five wizard-tagged insights covering checkout, subscription management, account/security actions, invitation roles, and the checkout-to-subscription funnel. The dashboard and insights were created successfully, but their data is intentionally unconfirmed because no app events were observed during this run.

## Verified versus unconfirmed

**Verified by the run:** the dependency installation completed; the lockfile was current; the integration files and event plan were reviewed; PostHog-related compilation and TypeScript validation completed during both build attempts; the dashboard and five insights were created; and the dashboard response returned the link above.

**Not verified:** live application startup, successful event delivery, event volume, exception delivery, identity attribution in collected events, or populated dashboard data. The run did not run an automated browser or trigger the instrumented actions.

## Build conflict

`pnpm build` compiled successfully and completed lint/type validation twice, but could not finish static page-data collection for `/_not-found` because the pre-existing required `POSTGRES_URL` environment variable was not set. This is an environment configuration issue unrelated to PostHog; configure `POSTGRES_URL` and rerun the production build before merging.

## Follow-up issue

Server-side successful outcomes remain unresolved: Stripe checkout completion/webhook subscription changes and server actions are not instrumented. If business reporting depends on confirmed outcomes rather than button submissions, add `posthog-node` server instrumentation using the authenticated `user.id` and await `flush()` in short-lived handlers. Leaving this unresolved means the dashboard can measure intent and submissions, but cannot establish completed billing or server-side mutations.

## Next steps

1. Configure `POSTGRES_URL` in the build/deploy environment and rerun the production build.
2. Run the app in a real browser with the two PostHog public environment variables configured; sign in and exercise each instrumented action.
3. Confirm the seven event names and the identified user appear in PostHog, then check that the dashboard tiles populate.
4. Decide whether confirmed server-side billing and mutation outcomes are required; if so, implement the server-side follow-up described above.

## Before you merge

- [ ] Run a full production build with `POSTGRES_URL` configured and fix any lint or type errors introduced by the integration; inspect `instrumentation-client.ts`, `app/global-error.tsx`, `app/(dashboard)/layout.tsx`, and the instrumented dashboard/pricing files if errors occur.
- [ ] Run the test suite, including any mocks or fixtures covering the handlers in `app/(dashboard)/pricing/submit-button.tsx`, `app/(dashboard)/dashboard/page.tsx`, `app/(dashboard)/dashboard/general/page.tsx`, and `app/(dashboard)/dashboard/security/page.tsx`.
- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`; verify the exact names in `.env.example` and `instrumentation-client.ts`.
- [ ] With an authenticated browser session, verify returning visitors still call `identify` in `app/(dashboard)/layout.tsx` and that captured events are attributed to the stable database user ID.
