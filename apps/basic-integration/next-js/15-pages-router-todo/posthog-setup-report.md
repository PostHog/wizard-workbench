# PostHog setup report

PostHog browser analytics and exception autocapture were added to the anonymous Next.js Pages Router todo app, with three lifecycle events and a starter dashboard.

## What was installed and initialized

- Installed `posthog-js` `^1.407.3` in `package.json` and `pnpm-lock.yaml`.
- Initialized the browser singleton once in `instrumentation-client.ts` using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- The real environment values were configured in `.env` through the wizard; `.env.example` documents both variable names. The report does not reproduce secret values.
- Default autocapture and session behavior were preserved. Development builds fail loudly when either required variable is missing; production safely skips initialization when configuration is absent.
- No server SDK remains installed or used: review removed the unused `posthog-node` dependency because events are captured in the browser after successful API responses.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A visitor successfully creates a todo; includes whether a description was present. | `components/todos/todo-list.tsx` |
| `todo_completion_changed` | A visitor successfully marks a todo complete or active; includes the resulting completion state. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A visitor successfully deletes a todo. | `components/todos/todo-list.tsx` |

The calls are placed in successful response branches. Event properties contain no todo content, identifiers, or other user-entered PII. The run did **not** exercise the browser, so it did not observe any event arriving in PostHog; the dashboard may remain empty until traffic occurs.

## User identification

Identification was skipped. The app has no authentication, login, registration, session, user record, or stable user identifier. Todo IDs identify resources, not people, so they were not used as distinct IDs. Events remain anonymous/personless by design. If authentication is added later, identify with the authenticated account's stable primary key after login or registration, identify returning authenticated sessions, and reset on logout.

## Error tracking

Global browser exception autocapture was enabled with `capture_exceptions: true` in `instrumentation-client.ts`. No manual exception flow or server-side error tracking was added. The run did not trigger an exception and therefore did not observe an error event arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1912850) contains four wizard-tagged tiles: daily todo creations, daily completion changes, daily deletions, and an ordered todo lifecycle funnel. It uses the exact event names listed above and may remain empty until the app receives traffic.

## Verification and unresolved items

- `pnpm install` completed with dependencies current.
- `pnpm build` passed lint/type validation, production compilation, and page/route generation.
- The configured environment keys were confirmed present by the wizard without exposing their values.
- No standalone test or typecheck script exists in `package.json`.
- Build conflict: none reported.
- Event delivery, exception delivery, and dashboard population were not verified because no browser session was run.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; review `instrumentation-client.ts` and `components/todos/todo-list.tsx`.
- [ ] Run the test suite, if one is added or supplied for this app, and update mocks or fixtures for the three `posthog.capture()` calls in `components/todos/todo-list.tsx`.
- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deployment environment, not only `.env`; confirm the names in `.env.example` and the initialization in `instrumentation-client.ts`.
- [ ] Exercise create, completion toggle, and delete flows in a real browser and confirm `todo_created`, `todo_completion_changed`, and `todo_deleted` arrive in PostHog; also trigger a controlled browser exception and confirm exception autocapture.
- [ ] Confirm the dashboard tiles populate after the browser verification: https://us.posthog.com/project/483112/dashboard/1912850.

## Next steps

1. Configure the two documented environment variables in each deployment environment.
2. Perform the browser smoke test described above and verify events and exceptions in PostHog.
3. Revisit identity only if the product gains authentication; do not substitute todo IDs for user identity.
