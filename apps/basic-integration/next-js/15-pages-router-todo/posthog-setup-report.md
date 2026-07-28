# PostHog setup report

PostHog product analytics was added to the Next.js Pages Router todo app, with anonymous todo-action events, global browser exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` 1.407.5 and `posthog-node` 5.46.1 with pnpm. The server SDK is installed for possible future API-route instrumentation; this run added no server-side captures.
- Added `instrumentation-client.ts` as the single Next.js 15.5 client initialization point. It reads `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from the environment, enables the SDK defaults and exception autocapture, and fails loudly in development when configuration is missing while remaining a production no-op.
- Added `.env.example` documenting the required public environment variables. The real values were configured in `.env` through environment tooling; production deployments must provide them too.
- No CSP changes were needed because the reviewed app has no CSP configuration.

## Events instrumented

Captures run only after the corresponding API mutation succeeds. The run did not observe events arriving in PostHog, so these are instrumented event definitions, not confirmed deliveries.

| Event | Measures | Source |
|---|---|---|
| `todo_created` | A visitor successfully creates a todo, including whether it has a description and its initial completion state. | `components/todos/todo-list.tsx` |
| `todo_completion_toggled` | A visitor successfully changes a todo's completion state. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A visitor successfully deletes a todo. | `components/todos/todo-list.tsx` |

Events are intentionally anonymous: the app has no authentication, account, session, or stable user identifier. No todo text or other user-entered content is sent as event properties.

## Identification

User identification was skipped. The app maintains an in-memory shared todo collection and has no user boundary from which a stable non-PII identifier could be obtained. Todo IDs must not be used as user IDs. If authentication is added later, identify the stable account ID after login and session restoration, and reset on logout.

## Error tracking

Global browser exception autocapture is enabled through `capture_exceptions: true` in `instrumentation-client.ts`. No manual error boundary or wrapped capture was added. Server-side API error autocapture was not added or verified.

## Dashboard

Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918280) (dashboard ID `1918280`). It contains three tagged trends insights for the three events over the last 30 days. The dashboard and insights were created successfully, but may remain empty until events are sent; event delivery was not observed during this run.

## What the run verified

- `pnpm install` completed with the dependency and lockfile state current.
- `pnpm build` completed successfully, including compilation, linting/type validation, static generation, and build traces.
- Environment tooling confirmed both required environment keys are present locally.
- The review found no unused PostHog helpers, unrelated integration changes, or CSP requirement.

## What the run did not verify

- No browser session or live PostHog ingestion was exercised, so no event was confirmed captured or received.
- No authentication or identify flow exists to test.
- Server-side API-route capture and server-side error tracking were not implemented.
- The test suite was not run; no standalone lint or typecheck script exists. The production build supplied lint and type validation.

## Unresolved issues and impact

- **Anonymous attribution remains unresolved by design:** `components/todos/todo-list.tsx` emits all three events without a stable user ID because the app has no authentication. If account-level attribution is required, adding identity at a future authentication boundary is necessary; otherwise users and actions cannot be tied to accounts.
- **Event delivery remains unconfirmed:** the run only verified source instrumentation and build success. Without exercising the app in a real browser and checking PostHog, ingestion problems could go unnoticed and dashboard tiles may stay empty.
- **Server coverage is unresolved:** the API routes mutate todo data but have no server-side PostHog capture or error autocapture. Adding server events later without a deliberate deduplication strategy could double-count the same action.

## Before you merge

- [ ] Run a full production build in the target environment and fix any lint or type errors introduced by the integration; the wizard verified `pnpm build` locally, but deployment configuration can differ.
- [ ] Run the test suite and update mocks or fixtures if the instrumented `components/todos/todo-list.tsx` call sites require them.
- [ ] Confirm `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from `.env.example` are configured in every deploy environment, not only local `.env`.
- [ ] Exercise create, completion-toggle, and delete actions in a real browser, then confirm `todo_created`, `todo_completion_toggled`, and `todo_deleted` arrive in PostHog and populate dashboard `1918280`.
- [ ] If authentication is introduced, wire stable-ID identification on login and restored sessions and call reset on logout before relying on account-level attribution.
