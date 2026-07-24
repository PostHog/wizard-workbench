# PostHog setup report

PostHog product analytics and global error tracking were added to the Next.js todo app, with a starter dashboard configured for the instrumented todo events.

## Installed and initialized

- Installed `posthog-js` `^1.407.2` and `posthog-node` `^5.46.1` with pnpm; the lockfile records resolved versions 1.407.2 and 5.46.1.
- Added `instrumentation-client.ts`, using the Next.js 15.3+ client initialization pattern. It reads `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`, initializes `posthog-js` once when both are present, enables exception capture, and fails loudly in non-production when configuration is missing while remaining a production no-op.
- Added `.env.example` documenting both public variables. The real values were configured in `.env` through wizard tools; deployment environments still need these variables configured.
- No CSP or same-origin proxy was found or added. The SDK sends directly to the configured PostHog host.

## Events instrumented

These captures are placed after successful todo API responses and intentionally exclude todo titles, descriptions, and other user-entered content.

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A visitor successfully creates a todo item. | `components/todos/todo-list.tsx` |
| `todo_completion_updated` | A visitor successfully marks a todo complete or incomplete. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A visitor successfully deletes a todo item. | `components/todos/todo-list.tsx` |

The run verified that the three `posthog.capture` calls exist at the intended successful action boundaries. It did **not** observe events arriving in PostHog; the dashboard insights may therefore be empty until the app is exercised in a real browser session.

## User identification

Identification was skipped. This is a client-only todo app with in-memory data and no login, registration, logout, session, authenticated API, or user model, so no stable non-PII distinct ID was available. Events remain anonymous. If authentication is added later, identify after successful authentication and on restored sessions, and reset on logout.

## Error tracking

Added `app/global-error.tsx`, a client global error boundary that reports the boundary error once with `posthog.captureException(error)` and provides the required reset UI. The run verified the file and capture call, but did not trigger a runtime error or observe an error arriving in PostHog.

## Dashboard

Created `Analytics basics (wizard)` in PostHog project 483112 with three daily trends tiles for the events above, all tagged `wizard`.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1901819)

## Build and unresolved issues

- `pnpm install` completed successfully with the lockfile up to date.
- `pnpm build` passed compilation, linting/type validation, static generation, and build traces.
- The build emitted a pre-existing warning that an ancestor workspace lockfile causes inferred workspace-root ambiguity. The warning is unrelated to this integration and did not prevent the build.
- No standalone lint or typecheck scripts are defined in the manifest.

## Before you merge

- [ ] Run the full production build again and fix any lint or type errors introduced by the generated code; review `instrumentation-client.ts`, `components/todos/todo-list.tsx`, and `app/global-error.tsx`.
- [ ] Run the test suite and update any mocks or fixtures affected by the captures in `components/todos/todo-list.tsx` and the global boundary in `app/global-error.tsx`.
- [ ] Configure `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deployment environment, not only `.env`; compare the names against `.env.example` and `instrumentation-client.ts`.
- [ ] Exercise create, completion-toggle, and delete actions in a real browser and confirm `todo_created`, `todo_completion_updated`, and `todo_deleted` arrive in PostHog; also trigger an application error and confirm error tracking receives it.
- [ ] If authentication is introduced, add stable-ID identification and logout reset at the relevant authentication boundaries before relying on person-level analytics.
