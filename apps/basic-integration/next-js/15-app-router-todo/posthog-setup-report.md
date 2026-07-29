# PostHog setup report

PostHog was initialized for this Next.js 15 App Router todo app, with anonymous browser analytics, global client error capture, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-js` `^1.408.0` with pnpm. The unused `posthog-node` dependency was removed during review because no server-side PostHog code uses it.
- Added `instrumentation-client.ts`, the single Next.js 15.3+ client initialization point. It reads `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from the environment, fails loudly in non-production when either is missing, and otherwise initializes `posthog-js` with the documented defaults and exception autocapture enabled.
- Configured the real environment values in local `.env.local` and documented the variable names in `.env.example`. No CSP changes were needed because the project has no CSP configuration.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A todo was successfully created; includes only whether it has a description and its initial completion state. | `components/todos/todo-list.tsx` |
| `todo_completion_changed` | A todo was successfully marked complete or active; includes the resulting completion state. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A todo was successfully deleted. | `components/todos/todo-list.tsx` |

The run verified that all three `capture()` calls are in successful response branches and use static snake_case names with non-PII properties. The run did **not** observe events arriving in PostHog, so ingestion and dashboard population remain unconfirmed. Events use PostHog's anonymous browser identity.

## Identification

User identification was skipped. Review found no authentication, registration, session, user model, or stable user identifier. Todo IDs identify resources rather than users and must not be used as distinct IDs. When authentication is added, wire `identify()` after login and persisted-session restoration, and `reset()` at logout.

## Error tracking

Added `app/global-error.tsx` as the global Next.js error boundary. It reports boundary errors once with `posthog.captureException(error)` and preserves recovery through the required `reset` callback. Initialization also enables exception autocapture. The run verified the implementation and build compatibility; it did not trigger a runtime error or observe an exception arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926602) contains three saved insights: a daily creation trend, completion changes broken down by completion state, and a todo lifecycle funnel. The dashboard and insight definitions were created successfully, but may remain empty until events are ingested.

## Build verification and conflict

The review step ran `pnpm install` successfully and `pnpm build` passed compilation, type validation, static-page generation, and trace collection. The only build conflict was a Next.js warning that it inferred an outer workspace root because multiple pnpm lockfiles exist. The build still completed successfully; this warning is unrelated to the PostHog integration.

No test suite or lint command was reported as run, and no live event or error delivery was verified.

## Next steps

1. Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deployment environment, using `.env.example` as the naming reference; local configuration alone is insufficient.
2. Exercise create, completion-toggle, and delete flows in a deployed build, then confirm `todo_created`, `todo_completion_changed`, and `todo_deleted` arrive in PostHog and populate the dashboard.
3. Trigger a safe test error in a non-production environment and confirm the exception appears in PostHog.
4. If authentication is added later, assign a stable user identifier and wire identification and logout reset as described above.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the recorded build passed, but this checklist is for the merge environment.
- [ ] Run the test suite and update any mocks or fixtures affected by the new `posthog-js` import in `components/todos/todo-list.tsx` and `app/global-error.tsx`.
- [ ] Confirm `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from `.env.example` are configured in deployment environments, not only local `.env.local` (`instrumentation-client.ts`).
- [ ] Exercise the instrumented flows and verify event delivery in PostHog; the run verified code placement only, not ingestion (`components/todos/todo-list.tsx`).
- [ ] Trigger and verify global error delivery in PostHog; the run verified the boundary code but did not observe a delivered exception (`app/global-error.tsx`).
