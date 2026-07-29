# PostHog setup report

PostHog was initialized for the Next.js 15 App Router todo app, with three client-side todo events, global exception tracking, and a starter dashboard configured.

## Verified by this run

### Installation and initialization

- `posthog-js` 1.407.8 was installed with pnpm and remains in `package.json` and `pnpm-lock.yaml`.
- The browser SDK is initialized once in `instrumentation-client.ts` using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- Initialization keeps the SDK defaults, enables exception autocapture, and enables development-only debugging and missing-configuration validation.
- The environment variable names are documented in `.env.example`; the real values were set in `.env` during the run.
- The unused `posthog-node` dependency was removed during review because no server-side SDK import or capture remains.

### Events instrumented

These are planned/instrumented events. The run did **not** start the app or observe events arriving in PostHog, so capture and delivery are unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A visitor successfully creates a todo, with description presence and resulting active-todo count metadata. | `components/todos/todo-list.tsx` |
| `todo_completion_changed` | A visitor successfully marks a todo complete or active. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A visitor successfully deletes a todo, with whether the deleted item was complete. | `components/todos/todo-list.tsx` |

The captures occur only after successful API responses. They intentionally exclude todo titles, descriptions, and other user-entered content.

### User identification

Identification was skipped. The app has no authentication, session, login, registration, logout, or user model, and its in-memory todo records do not provide a stable non-PII identifier. Events therefore use the SDK's anonymous browser identity; no fabricated distinct ID was added. When authentication exists, identify should be wired at the point a stable identifier becomes available and reset on logout.

### Error tracking

`app/global-error.tsx` was added as a client global error boundary. It calls `posthog.captureException(error)` once for the boundary error and provides the Next.js reset UI. No individual routes or components were wrapped. This was configured but not exercised during the run, so error arrival in PostHog is unconfirmed.

### Dashboard

The dashboard `Analytics basics (wizard)` was created with four tagged insights: todo activity over time, todos created per day, completion changes per day, and a todo creation-to-completion funnel. Each uses the three exact event names over the last 30 days. Initial empty results are expected until events arrive.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1924653)

## Not verified by this run

- No app startup or user interaction was performed, so the three events were not observed arriving in PostHog.
- Exception delivery was not observed.
- The dashboard's event data was not validated; its initial empty state is expected.
- Tests were not run. No lint script is defined in `package.json`.

## Build conflict

Next.js emits a non-blocking workspace-root warning because an ancestor `pnpm-lock.yaml` is detected alongside this project's lockfile. The production build nevertheless passed twice, including compilation, linting/type validation, static generation, and build tracing.

## Before you merge

- [ ] Run a full production build in the deployment environment and fix any lint or type errors introduced by the instrumentation; review `instrumentation-client.ts`, `components/todos/todo-list.tsx`, and `app/global-error.tsx`.
- [ ] Run the test suite and update any mocks or fixtures affected by the PostHog import or the capture calls in `components/todos/todo-list.tsx`.
- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`; confirm the names against `.env.example`.
- [ ] Start the app and exercise create, completion toggle, and delete actions, then confirm `todo_created`, `todo_completion_changed`, and `todo_deleted` arrive in PostHog.
- [ ] Trigger an application-level error and confirm the global boundary capture from `app/global-error.tsx` arrives in PostHog.
