# PostHog setup report

PostHog server-side analytics was added to the Express todo API, with three todo lifecycle events, global Express error tracking, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-node` (`^5.46.1`) and `dotenv`; `npm install` completed successfully with 0 vulnerabilities.
- `posthog.js` loads project-local environment variables with `dotenv`, reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, and exports one shared `PostHog` client.
- The client enables `enableExceptionAutocapture: true`. Missing configuration fails loudly outside production and becomes a production no-op, as required by the framework rules.
- `.env.example` documents the required variables. The run confirmed both keys are present in the local `.env`; deployment environments still need their own configuration.
- No browser SDK or reverse proxy was added because this is server-side Node.js instrumentation.

## Events instrumented

These events are implemented in `index.js` and are enqueued only after the corresponding state mutation succeeds. The run did **not** exercise the running API or observe events arriving in PostHog, so delivery and dashboard population remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A todo was successfully created through the API, including its initial completion state. | `index.js` |
| `todo_updated` | A todo title and/or completion state was successfully updated, including which fields changed and the resulting completion state. | `index.js` |
| `todo_deleted` | A todo was successfully deleted through the API, including its prior completion state. | `index.js` |

Event properties intentionally exclude todo titles, IDs, and other potentially user-entered content. Events are personless because no stable authenticated user or session identifier exists in the application.

## User identification

Identification was skipped. The application has no authentication, session, user model, login/signup flow, or incoming stable user identifier. No `identify()` call was added, and no todo ID, title, username, or request content was substituted as a distinct ID. If authentication is introduced later, establish PostHog request context from the application-owned stable user ID at the Express request boundary.

## Error tracking

`index.js` imports `setupExpressErrorHandler` from `posthog-node` and registers it after the routes and before `app.listen`. The shared client also enables exception autocapture. The run verified the wiring by code review, but did not trigger an exception or observe an error event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902556) contains three saved daily trend insights over the last 30 days for the instrumented event names. The dashboard and insights were created successfully, but may remain empty until the application sends events; no event arrival was observed during this run.

## Verification and unresolved issues

- Dependency installation and review completed successfully; `npm install` reported 0 vulnerabilities.
- No build, typecheck, lint, or test command was available in `package.json`, which defines only `start` and `dev` scripts. The run therefore did not verify compilation, startup, route behavior, or event delivery.
- A generic `npm run` listing was attempted during review but blocked by the runtime command policy; it did not execute a project command and caused no code change.
- No build conflict was identified. The full verification limitation is that the project exposes no build, typecheck, lint, or test script, and the app was not started to confirm runtime behavior or PostHog delivery.
- Attribution remains unresolved because the API has no stable identity source. Leaving events personless limits user-level funnels, retention, and attribution until authenticated identity is available; inventing an ID would make the analytics misleading.

## Next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only local `.env`.
2. Start the API and exercise successful create, update, and delete requests; then confirm `todo_created`, `todo_updated`, and `todo_deleted` arrive in PostHog and appear in the dashboard.
3. Trigger a controlled Express error and confirm it appears in PostHog Error Tracking.
4. Add a production build, test, lint, or typecheck command if appropriate for the project, then run the available verification before merging.
5. If authentication is added, wire a stable application-owned user ID into the Express request context before adding `identify()` or person-level analysis.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; no build, lint, or typecheck script was available during this run.
- [ ] Run the test suite, or add one if the project currently has none, covering the instrumented create, update, delete, and error paths in `index.js`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in each deployment environment, not just local `.env`; inspect `posthog.js` and deployment configuration.
- [ ] Start the API and verify the three events and an error arrive in PostHog; the run only verified code wiring, not event flow.
