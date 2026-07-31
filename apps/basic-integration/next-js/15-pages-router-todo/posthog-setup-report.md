# PostHog setup report

PostHog browser analytics and exception autocapture were initialized for the Pages Router todo app, with three successful-mutation events and a starter dashboard.

## What was installed and initialized

- Installed `posthog-js` `^1.409.5` and `posthog-node` `^5.47.2` with pnpm; the manifest and lockfile were updated.
- Added the single browser initialization point in `instrumentation-client.ts`, guarded by `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`. The initialization includes PostHog defaults `2026-01-30`, exception autocapture, and development debug behavior. `.env.example` documents the variable names, and the configured values were written to `.env` through wizard tooling.
- No CSP directives were changed because the source review found no shipped CSP.
- The server SDK is installed, but no server-side captures were added; the current mutation events are emitted in the browser after successful API responses.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A visitor successfully creates a todo. | `components/todos/todo-list.tsx` |
| `todo_completion_toggled` | A visitor successfully changes a todo's completion state. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A visitor successfully deletes a todo. | `components/todos/todo-list.tsx` |

Event properties are limited to non-PII operational context. The captures are placed after successful POST, PATCH, and DELETE responses. No runtime event delivery was observed, so capture in PostHog remains unconfirmed.

## Identification

User identification was skipped. The app has no authentication, session, account, or user model; todo IDs represent resources rather than people. The three events are intentionally personless. If authentication is added later, identify with a stable authenticated user ID after login or registration and reset on logout.

## Error tracking

Global browser exception and unhandled-rejection autocapture is enabled through `capture_exceptions: true` in `instrumentation-client.ts`. No manual exception calls or error boundary were added. This configuration was verified by source review; runtime error arrival in PostHog was not observed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935655)

The dashboard contains three insights: todo activity over time, the todo completion funnel, and todo deletions by day. The definitions were created successfully; fresh insights may be empty until traffic arrives.

## Build and conflicts

`pnpm install` completed with the lockfile up to date, and `pnpm build` passed compilation, type validation, linting, static generation, and build-trace collection.

The full reported build/install conflict was: `pnpm install` reported ignored dependency build scripts, and Next.js warned about an inferred workspace root because of an ancestor lockfile. Neither affected the successful build, and neither was caused by this integration.

## Unresolved issue to follow up

Runtime PostHog delivery was not tested or observed. Until a real browser session confirms events arriving, the dashboard and event pipeline should be treated as configured but unconfirmed. Leaving this unresolved risks assuming analytics coverage that may be blocked by deployment environment, browser delivery, or configuration issues.

## Before you merge

- [ ] Run a full production build and resolve any lint or type errors introduced by the integration; review `instrumentation-client.ts` at the `posthog.init` call and `components/todos/todo-list.tsx` at each `posthog.capture` call.
- [ ] Run the test suite and update any mocks or fixtures affected by the captures in `components/todos/todo-list.tsx`.
- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from `.env.example` in every deploy environment, not only local `.env`; verify the initialization guard in `instrumentation-client.ts`.
- [ ] Exercise create, completion-toggle, and delete in a real browser session, then confirm `todo_created`, `todo_completion_toggled`, and `todo_deleted` arrive in PostHog; inspect the capture branches in `components/todos/todo-list.tsx`.
- [ ] Confirm uncaught browser errors appear in PostHog Error Tracking by reviewing the `capture_exceptions` option in `instrumentation-client.ts` and testing the deployed app.
