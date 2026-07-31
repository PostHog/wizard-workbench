# PostHog setup report

PostHog was added to the Next.js todo app with browser initialization, anonymous todo lifecycle events, client exception autocapture, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-js` (`^1.409.5`) and `posthog-node` (`^5.47.2`) with pnpm; the manifest and lockfile were updated. The server SDK is installed, but no server-side capture was added.
- `instrumentation-client.ts` is the sole browser initialization point. It reads `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`, initializes `posthog-js` with standard defaults, and enables `capture_exceptions: true`.
- The real project token and host were configured in the local `.env` through wizard environment tooling. `.env.example` documents the required variable names.
- No Content-Security-Policy was present in the reviewed configuration, so no CSP changes were needed.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A visitor successfully creates a todo item; includes only whether a description was provided. | `components/todos/todo-list.tsx` |
| `todo_completed` | A visitor successfully marks a todo item complete. | `components/todos/todo-list.tsx` |
| `todo_reopened` | A visitor successfully changes a completed todo back to active. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A visitor successfully deletes a todo item. | `components/todos/todo-list.tsx` |

Each capture is client-side and follows a successful API response. Todo titles and descriptions are not sent as event properties.

## Identity status

User identification was skipped. The inspected app has no authentication, account, session, login, registration, logout, or stable user identity concept. Events therefore remain anonymous/personless. No event capture was observed arriving in PostHog during this run.

### Follow-up issue: stable attribution is unresolved

Without authentication or a stable distinct ID, events cannot be reliably attributed to returning users or accounts. If authentication is introduced, wire `identify` at login and persisted-session restoration, and reset on logout; keep email/name as person properties rather than event properties.

## Error tracking

Global browser exception autocapture was enabled with `capture_exceptions: true` in `instrumentation-client.ts`. No manual component or server-side exception capture was added. Error ingestion was not observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935639)

The dashboard contains four wizard-tagged insights for todo activity, creation volume, completion, and removals. The insights were created from the event plan, but the run did not confirm that production events have reached PostHog.

## Verification and build status

Verified during this run:

- `pnpm install` completed with the declared SDKs resolved successfully.
- `pnpm build` completed successfully, including compilation, linting/type validation, static-page generation, and trace collection.
- The integration review found one browser initialization point and four static snake_case lifecycle events that fire only after successful browser API responses.

Not verified during this run:

- No production browser session was exercised.
- No event or error was observed arriving in PostHog.
- Environment delivery in a deployment environment was not confirmed.

Build conflict: the build passed, but Next.js emitted a pre-existing workspace-root warning because an ancestor pnpm lockfile is also present.

## Next steps

1. Configure `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deployment environment using the names documented in `.env.example`; do not rely only on the local `.env`.
2. Exercise create, complete, reopen, and delete flows in a deployed browser session and confirm the four corresponding events appear in PostHog.
3. Trigger a controlled client exception in a non-production environment and confirm Error Tracking receives it.
4. If user authentication is added later, implement stable-ID identification and logout reset before relying on user-level attribution.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the wizard ran `pnpm build`, which passed, but deployment-specific verification remains yours to confirm.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures.
- [ ] Confirm the exact variables `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from `.env.example` are set in deployment environments, not just locally; inspect `.env.example` and `instrumentation-client.ts`.
