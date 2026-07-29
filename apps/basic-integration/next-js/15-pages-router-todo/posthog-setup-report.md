# PostHog setup report

PostHog product analytics and browser error autocapture were added to the anonymous Next.js 15 Pages Router todo app, with a starter dashboard for todo lifecycle activity.

## What was installed and initialized

- Installed `posthog-js` 1.407.8 with pnpm; `package.json` and `pnpm-lock.yaml` were updated.
- Added `instrumentation-client.ts` as the single client initialization point. It reads `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from environment variables, initializes `posthog-js` when both are configured, throws a descriptive error in development when configuration is missing, and safely no-ops in production when it is missing.
- Added the variable names to `.env.example`; the real values were configured in `.env` through the wizard environment tooling.
- The integration preserves PostHog defaults, including autocapture and session recording behavior. No CSP or reverse-proxy configuration was added.

## Events instrumented

Captures are issued from `components/todos/todo-list.tsx` only after the corresponding API mutation succeeds. The event plan is recorded in `.posthog-wizard-cache/.posthog-events.json`.

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A new todo was successfully created. | `components/todos/todo-list.tsx` |
| `todo_completed` | An existing todo was successfully marked complete. | `components/todos/todo-list.tsx` |
| `todo_reopened` | A completed todo was successfully marked incomplete. | `components/todos/todo-list.tsx` |
| `todo_deleted` | An existing todo was successfully deleted. | `components/todos/todo-list.tsx` |

The run did not exercise the browser or observe events arriving in PostHog. These events are therefore instrumented but their live delivery is unconfirmed. Captures intentionally contain no todo title, description, or other user-entered content.

## User identification

Identification was skipped. The app has no authentication, registration, session, account-switching flow, user model, or stable browser-visible user ID. The events are deliberately anonymous and contain no `DISTINCT_ID` placeholder. Add `identify` only when a real stable authenticated ID exists, and add `reset` at a genuine logout boundary.

## Error tracking

Global browser exception autocapture is enabled through `capture_exceptions: true` in `instrumentation-client.ts`. No additional error boundary or scattered `captureException` calls were added. The run confirmed the configuration is present, but did not run the app to observe an exception arrive in PostHog.

## Dashboard

Created **Analytics basics (wizard)** with five tagged insights: trends for creation, completion, reopening, and deletion, plus a creation-to-completion lifecycle funnel. The dashboard may remain empty until the app sends events.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1924658)

## Verification and conflicts

- `pnpm install` completed successfully and kept `posthog-js` installed.
- `pnpm build` completed successfully: compilation, type validation, static generation, and build tracing passed. There are no separate lint or typecheck scripts in `package.json`.
- The build emitted Next.js's workspace-root/multiple-lockfile warning. This is unrelated to the PostHog integration and was not resolved by the run.
- No browser runtime, automated browser, or live PostHog delivery check was performed. A passing build proves the code compiles; it does not prove that events or exceptions were captured.

## Before you merge

- [ ] Run a full production build again and fix any lint or type errors introduced by the integration; the PostHog call sites are in `components/todos/todo-list.tsx` (lines 43, 64, and 78), and initialization is in `instrumentation-client.ts` (lines 4–17).
- [ ] Run the test suite, if one is added or available, and update mocks or fixtures for the PostHog singleton imported by `components/todos/todo-list.tsx` (line 5).
- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from `.env.example` in every deploy environment, not only local `.env`; verify the names in `.env.example` (lines 2–3).
- [ ] Exercise create, complete, reopen, and delete actions in a real browser and confirm `todo_created`, `todo_completed`, `todo_reopened`, and `todo_deleted` arrive in PostHog; the instrumented handlers are in `components/todos/todo-list.tsx` (lines 43, 64, and 78).
- [ ] Trigger a representative browser exception in a deployed or development environment and confirm error tracking receives it through `instrumentation-client.ts` (line 13).
- [ ] Confirm whether anonymous analytics is acceptable for the product; if authentication is introduced later, wire stable-ID identification and logout reset at the corresponding auth files and boundaries before relying on attribution.
