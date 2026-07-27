# PostHog setup report

PostHog browser analytics, lifecycle event capture, client-side exception autocapture, and a starter dashboard were set up for the Next.js todo app.

## What was installed and initialized

- Installed `posthog-js` 1.407.3 with pnpm.
- Added the Next.js 15.3+ `instrumentation-client.ts` initialization point.
- Initialization reads `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from the environment and initializes the singleton only when both are configured. Development reports a missing-variable error; production remains a no-op when unconfigured.
- `.env.example` documents the required variable names, and the run recorded both variables as present in the local `.env`.
- The application uses the direct `posthog-js` singleton in the client call site; no second client instance was added.
- No server SDK remains installed because no server-side PostHog instrumentation was retained.

## Events instrumented

These events are captured only after the corresponding API mutation returns successfully. The run did not start the app or observe events arriving in PostHog, so delivery and event volume remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A visitor successfully creates a todo; includes description presence and initial completion state. | `components/todos/todo-list.tsx` |
| `todo_completion_changed` | A visitor successfully marks a todo complete or active; includes the resulting completion state. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A visitor successfully deletes a todo. | `components/todos/todo-list.tsx` |

## Identity

User identification was skipped. The app has no authentication flow, account model, login or registration boundary, session, logout action, or stable user identifier. Events are therefore intentionally personless. If authentication is added later, identify once after successful login or registration with the account's stable ID, reset on logout, and use the same ID for server-side request context. Todo IDs, titles, or inferred values must not be used as user IDs.

## Error tracking

Client-side exception autocapture was enabled with `capture_exceptions: true` in `instrumentation-client.ts`, using the SDK's global browser error handler. No manual component or route `captureException` calls were added. Server-side API handlers catch errors locally, and no separate server PostHog client was configured.

The run did not trigger an exception and did not observe an error arriving in PostHog, so error delivery is unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1912855)

The dashboard contains four tiles: todo creations trend, completion changes trend, deletions trend, and a creation-to-completion funnel. They use the planned event names, cover the last 30 days, and the funnel uses a 14-day ordered conversion window. The insights were created from the event plan; newly instrumented app traffic was not observed during the run.

## Build verification and conflicts

`pnpm install` completed successfully and the production build completed successfully. The build compiled, ran Next.js lint/type validity checks, generated six static pages, and completed production build traces.

The build emitted an existing warning that multiple workspace lockfiles make Next.js's inferred tracing root potentially incorrect. This warning did not prevent the build from passing and was not resolved by the integration.

## Unresolved issues and impact

- No stable identity is available because the app has no auth or user model. Consequently, events cannot be attributed to accounts or users until authentication and stable-ID handling are introduced.
- Event delivery was not verified: the run did not start the app or observe `todo_created`, `todo_completion_changed`, `todo_deleted`, or exception events in PostHog. Dashboard tiles may therefore be empty until real actions occur.

## Before you merge

- [ ] Run the app and perform create, completion-toggle, and delete actions; confirm `todo_created`, `todo_completion_changed`, and `todo_deleted` arrive in PostHog. Review the capture branches in `components/todos/todo-list.tsx` around lines 39–43, 61–65, and 77–80.
- [ ] Trigger a controlled client-side exception in a non-production environment and confirm it appears in PostHog Error Tracking. Review `capture_exceptions: true` in `instrumentation-client.ts` around line 8.
- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`; verify the names documented in `.env.example`.
- [ ] Run the full production build and fix any lint or type errors introduced by the integration; the run verified a build, but the user should repeat it in the target environment.
- [ ] Run the test suite, if one is added, and update mocks or fixtures for the instrumented mutation handlers; no test script exists in the current package manifest.
