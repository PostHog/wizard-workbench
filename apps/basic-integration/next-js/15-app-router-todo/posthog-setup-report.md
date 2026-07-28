# PostHog setup report

PostHog product analytics and client-side error tracking were added to the Next.js 15 App Router todo application, with a starter dashboard and three lifecycle events defined.

## What was installed and initialized

- Installed `posthog-js` 1.407.5 and `posthog-node` 5.46.1 with pnpm; both are recorded in `package.json` and `pnpm-lock.yaml`.
- Initialized the browser SDK once in `instrumentation-client.ts`, using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- Exception capture is enabled through the initialization configuration, while default capture behavior remains enabled.
- Added `.env.example` documenting the two configuration keys. The real values were set in `.env`; deploy environments still need equivalent configuration.
- No CSP changes were needed because the reviewed app had no CSP configuration.

## Events instrumented

These are defined in `.posthog-wizard-cache/.posthog-events.json` and captured from `components/todos/todo-list.tsx` only after the corresponding API request succeeds.

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A visitor successfully creates a todo item. | `components/todos/todo-list.tsx` |
| `todo_completion_changed` | A visitor successfully marks a todo complete or reopens it. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A visitor successfully deletes a todo item. | `components/todos/todo-list.tsx` |

Event properties are non-PII: creation records `has_description`; completion changes record `completed`; deletion has no additional properties. The run did **not** observe events arriving in PostHog, so delivery and ingestion remain unconfirmed.

## Identification status

User identification was skipped. The application has no authentication, login/logout flow, session, account model, or stable user identifier. Todo numeric IDs identify resources rather than people, so no `identify()` or `reset()` calls were added. The three lifecycle events are intentionally personless captures. If authentication is added later, identify with the authenticated stable user ID after login and on returning authenticated sessions, and reset on logout or account switching.

### Follow-up issue: attribution is unresolved

Because no stable identity exists, events cannot currently be attributed to a known user. Leaving this unresolved means the dashboard can show aggregate todo behavior but cannot reliably support user-level journeys, retention, or account attribution. Do not replace this with todo IDs or placeholders.

## Error tracking

Added `app/global-error.tsx` as a client global error boundary. It calls `posthog.captureException(error)` from an effect keyed to the error, avoiding duplicate capture on re-renders, and preserves recovery through `reset()`. The run verified the code builds; it did not trigger an application error or observe an exception arrive in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919757)

The dashboard contains four tagged insights: todo creations trend, completion changes broken down by `completed`, a todo lifecycle funnel, and deletion trend. The dashboard and insight definitions are live, but they may remain empty until events arrive.

## Verification and build status

- `pnpm install` completed successfully with the lockfile up to date.
- `pnpm build` completed successfully, including compilation, Next.js validation/typechecking, static generation, and trace collection.
- No separate lint or typecheck scripts are defined.
- The build does not prove that analytics events flow. PostHog delivery was not exercised in this environment.
- A non-blocking Next.js warning remains: an ancestor pnpm lockfile causes workspace-root inference ambiguity. The build still passed, and this warning was not introduced by the integration.

## Before you merge

- [ ] Run the full production build in the target repository/CI environment and fix any lint or type errors introduced by the generated integration.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures.
- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deploy environment, matching the names documented in `.env.example`; do not rely only on local `.env`.
- [ ] Exercise create, completion/reopen, and delete flows in a real browser session and confirm `todo_created`, `todo_completion_changed`, and `todo_deleted` arrive in PostHog; this was not confirmed by the run.
- [ ] Trigger the global error boundary and confirm the resulting exception appears in PostHog Error Tracking; this was not confirmed by the run.
- [ ] If authentication is added, wire stable-user identification and reset behavior in the authentication flow before relying on user-level attribution.
