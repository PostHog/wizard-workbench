# PostHog setup report

PostHog browser analytics, exception tracking, three todo events, and a starter dashboard were added to this Next.js App Router todo application.

## What was installed and initialized

- Installed `posthog-js` 1.407.3 and `posthog-node` 5.46.1 with pnpm. The server SDK is available, but no server-side business events were added because the client captures happen after successful API mutations and separate server capture would duplicate them.
- Initialized the browser SDK in `instrumentation-client.ts` using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`. Exception autocapture is enabled. The real values are configured in `.env`; `.env.example` documents the required names. No CSP configuration was present or changed.
- No PostHog events were observed arriving during this run. The build and code review verify implementation and compilation only; they do not verify delivery to PostHog.

## Instrumented events

| Event | Measures | Source |
| --- | --- | --- |
| `todo_created` | A new todo was successfully created from the todo form. | `components/todos/todo-list.tsx` |
| `todo_completion_changed` | An existing todo was successfully marked completed or active from the task list. | `components/todos/todo-list.tsx` |
| `todo_deleted` | An existing todo was successfully deleted from the task list. | `components/todos/todo-list.tsx` |

Each event is captured only after its matching API request succeeds. Properties are limited to non-PII operational context (`has_description` and/or `is_completed`). Captures are intentionally personless.

## User identification

Identification was skipped, not failed: the application has no authentication, registration, session, account, user record, or stable user identifier. Numeric todo IDs are not user identities. If authentication is introduced later, identify on successful login or registration with the stable authenticated ID, keep PII as person properties, and reset on logout.

## Error tracking

`app/global-error.tsx` was added as the Next.js global error boundary. It calls `posthog.captureException(error)` and preserves recovery through the supplied `reset` callback. Initialization also enables exception autocapture. Error delivery was not observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914266)

The dashboard contains three tagged daily trend insights for the instrumented events over the last 30 days. It is expected to remain empty until events arrive; its creation was verified, but event volume was not.

## Build and review status

The review step reported no integration fixes required. `pnpm install` was already up to date, and `pnpm build` completed compilation, linting, type checking, static generation, and build-trace collection successfully. No separate lint or typecheck scripts are defined in the manifest.

The only build conflict/warning was Next.js's workspace-root/multiple-lockfiles warning. It did not affect the successful build and is outside this integration's changeset. No other build conflict was reported.

## Unresolved issue to follow up

- **Stable attribution remains unresolved.** Because no user model exists, all three browser events and captured exceptions are personless. If the app later needs user-level funnels or retention, leaving this unresolved means activity cannot be reliably attributed to authenticated users; introduce identification as part of the future auth work rather than inventing an ID now.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code; review `instrumentation-client.ts`, `components/todos/todo-list.tsx`, and `app/global-error.tsx`.
- [ ] Run the test suite and update mocks or fixtures for the PostHog calls in `components/todos/todo-list.tsx` and `app/global-error.tsx` if needed.
- [ ] Confirm `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only locally; inspect `instrumentation-client.ts` for the reads.
- [ ] Exercise create, completion-toggle, and delete flows in a deployed environment and confirm `todo_created`, `todo_completion_changed`, and `todo_deleted` arrive in PostHog; the run did not observe event delivery.
- [ ] If authentication is added, wire stable-user identification and logout reset before relying on user-level attribution; the current implementation intentionally has no identify call.
