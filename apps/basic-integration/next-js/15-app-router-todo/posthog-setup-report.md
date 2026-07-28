# PostHog setup report

A browser-only PostHog integration was added to the Next.js 15 App Router todo app, with anonymous todo activity events, global exception tracking, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` 1.407.5 with pnpm. The unused `posthog-node` dependency was removed during review because no server-side PostHog implementation was added.
- PostHog is initialized once in `instrumentation-client.ts` through the `posthog-js` singleton.
- Configuration uses `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- Both keys are present in local `.env.local`, and both names are documented in `.env.example`. The actual values were not exposed in the run report.
- Default PostHog capture behavior remains enabled. No CSP is configured in this app.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A visitor successfully creates a todo. | `components/todos/todo-list.tsx` |
| `todo_completion_changed` | A visitor successfully marks a todo complete or active; includes the non-PII boolean `completed`. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A visitor successfully deletes a todo. | `components/todos/todo-list.tsx` |

Each event is captured only after its corresponding POST, PATCH, or DELETE request succeeds. The run did **not** observe events arriving in PostHog, so event delivery and dashboard population remain unconfirmed. Captures intentionally omit todo content and identifiers.

## User identification

Identification was skipped. The app has no authentication, registration, session, account-switching, logout flow, or persisted user model, and todo identifiers or content are not suitable stable user IDs. Events therefore use the browser SDK's anonymous session attribution. No `identify()` or `reset()` wiring was added. If authentication is added later, identify with a stable non-PII user ID after login and when an authenticated session is restored, then reset on logout.

## Error tracking

`app/global-error.tsx` is a client global error boundary. It reports the framework-provided error once with `posthog.captureException(error)` and includes the required reset UI. No route-level wrappers or additional manual exception calls were added. Error delivery was not observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918864)

The dashboard contains three `(wizard)` insights: todo activity over time, completion changes broken down by `completed`, and a creation-to-completion funnel. These are based on the event definitions above; their live data is unconfirmed because the run did not observe events arriving.

## Verification and conflicts

- `pnpm install` completed with the lockfile current.
- `pnpm build` passed compilation, Next.js linting/type validation, static generation, and build-trace collection.
- No standalone lint or typecheck script exists in `package.json`.
- The build emitted the pre-existing workspace-root/multiple-lockfile warning. It also reported pnpm's ignored dependency build scripts during installation; these were not introduced by this integration. The run did not identify an integration-caused build conflict.
- The integration review confirmed the event call sites are reachable from the todo form, checkbox, and delete-button handlers, and that captures contain no user-entered content or identifiers.

## Open issues and user follow-up

- **Event delivery is unresolved:** the run verified code placement and a passing build, but did not run the app or observe `todo_created`, `todo_completion_changed`, or `todo_deleted` arrive in PostHog. If left unresolved, the dashboard can remain empty even though the code compiles.
- **Error delivery is unresolved:** the global boundary was added, but no runtime exception was generated and observed in PostHog. If left unresolved, production errors may not appear in Error Tracking.
- **Attribution is intentionally anonymous:** no stable authenticated identity exists. If accounts are introduced without adding identification, activity will remain fragmented across anonymous IDs.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code; the integration run verified `pnpm build`, but this checklist is for the merge environment (`package.json`, build configuration).
- [ ] Run the test suite and update mocks or fixtures if needed; no test script is defined in `package.json`, so add or run the repository's applicable test command.
- [ ] Confirm `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only `.env.local` (`.env.example`, `instrumentation-client.ts`).
- [ ] Exercise todo creation, completion changes, and deletion in a deployed or local running app, then confirm the three exact event names arrive in PostHog (`components/todos/todo-list.tsx`).
- [ ] Trigger a controlled global application error and confirm it appears in PostHog Error Tracking (`app/global-error.tsx`).
- [ ] If authentication is introduced, add stable non-PII `identify()` on login/session restoration and `reset()` on logout at the authentication boundary; do not use todo content or identifiers (`instrumentation-client.ts` and the future auth boundary).
