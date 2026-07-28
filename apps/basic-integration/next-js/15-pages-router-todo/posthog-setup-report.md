# PostHog setup report

PostHog product analytics and browser error tracking were added to the Next.js 15 Pages Router todo app, with a dashboard prepared for the instrumented todo events.

## Installed and initialized

- Added `posthog-js` `^1.407.5` to `package.json`; the lockfile was updated with the resolved dependency.
- Initialized the singleton browser SDK in `instrumentation-client.ts`, using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` as environment configuration.
- Browser ingestion uses the `/ingest` reverse proxy configured in `next.config.ts`, including the required static and array asset rewrites. Default capture behavior remains enabled.
- Missing configuration fails loudly outside production and is a production no-op, so the app does not break when PostHog configuration is absent in production.
- `.env.example` documents the required environment variable names. The real values were set in the local `.env` through the wizard; deployment environments still need their own configuration.

## Events instrumented

These calls are placed after successful API responses in `components/todos/todo-list.tsx`. The run verified the calls in source code, but did **not** observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A todo was successfully created; includes whether a description was present and the resulting aggregate todo count. | `components/todos/todo-list.tsx` |
| `todo_completion_changed` | A todo was successfully marked complete or reopened; includes the resulting completion state. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A todo was successfully deleted; includes the remaining aggregate todo count. | `components/todos/todo-list.tsx` |

The events intentionally contain no todo text or other user-entered content. API routes were not separately instrumented, avoiding duplicate events for the same browser action.

## User identification

Identification was skipped. The app has no authentication flow, user/session model, or stable user identifier, and todo records are not an identity boundary. The events therefore remain personless/anonymous. If authentication is added later, use a stable non-PII user id with `identify` after login and on authenticated refresh, and `reset` on logout.

## Error tracking

Global browser exception autocapture is enabled with `capture_exceptions: true` in `instrumentation-client.ts`. No server-side error handler or manual route error capture was added. The run verified the configuration in source; it did not verify an exception arriving in PostHog.

## Dashboard

The run created the **Analytics basics (wizard)** dashboard with four wizard-tagged insights covering todo activity over time, creation volume, completion changes by completed state, and a creation-to-completion funnel. The insights use the captured event names and may initially be empty because event delivery was not observed.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1918873)

## Build verification and conflicts

The final `pnpm install` completed successfully, and `pnpm build` compiled successfully, completed Next.js lint/type validation, generated static pages, and finalized build traces. This verifies compilation and build-time validation only; it does not prove that events flow to PostHog.

The build emitted a pre-existing workspace-root warning because an ancestor pnpm lockfile is also present. Next.js selected an ancestor workspace root; this did not prevent the build from succeeding. No standalone lint or typecheck script is defined.

## Follow-up issues

- **Stable attribution remains unresolved:** no stable user identifier exists, so all three todo events and browser exceptions remain anonymous. If left unresolved, user-level retention, account attribution, and cross-session behavior analysis cannot be tied to authenticated users. Revisit the identity boundary before adding authentication; the current capture call sites are in `components/todos/todo-list.tsx` (approximately lines 41–45, 64–67, and 82–85).
- **Event delivery was not observed:** the run inspected source and completed a build, but did not run the app and confirm events in PostHog. The dashboard may remain empty until the actions are exercised in a deployed or local environment with the variables configured.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the recorded run already passed `pnpm build`, but this should be repeated in the merge environment.
- [ ] Run the test suite, if one is present, because the instrumented call sites in `components/todos/todo-list.tsx` may require updated mocks or fixtures.
- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deploy environment, matching the names documented in `.env.example`, rather than relying only on local `.env`.
- [ ] Exercise create, completion toggle, and delete actions, then confirm `todo_created`, `todo_completion_changed`, and `todo_deleted` arrive in PostHog and populate the dashboard.
- [ ] If authentication is introduced, add stable-id identification on login and authenticated refresh plus reset on logout before relying on person-level attribution.
