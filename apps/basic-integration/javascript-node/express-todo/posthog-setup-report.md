# PostHog setup report

PostHog was added to the Express todo API with a shared server-side client, three todo-event captures, centralized Express error tracking, and a starter dashboard.

## Installed and initialized

- Added `posthog-node` (`^5.46.1`) and `dotenv` to `package.json`; dependencies were installed successfully with zero vulnerabilities.
- `posthog.js` loads `.env` through `dotenv`, reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, and creates one shared `PostHog` client with `enableExceptionAutocapture: true`.
- Missing configuration fails loudly in development/debug operation with the required variable-specific error, while production remains a no-op. The configured keys were confirmed present locally; their values are not reproduced here.
- `index.js` reuses the shared client rather than creating another instance.

## Events instrumented

These are instrumented call sites, not events verified as received by PostHog. The run did not start the app or observe event delivery.

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A todo was successfully created. | `index.js` |
| `todo_updated` | An existing todo was successfully updated; properties record whether the title or completion state changed and its resulting completion state. | `index.js` |
| `todo_deleted` | An existing todo was successfully deleted. | `index.js` |

Captures are intentionally personless. The API has no authentication, account, session, or verified stable user identifier, so no `distinct_id` was available and no identity was invented. User-entered todo titles are not sent as event properties.

## User identification

Identification was skipped. The application has no user model, authentication, session, login/signup route, or incoming stable user ID. If authentication is added later, establish request context from that authenticated stable ID; do not substitute todo IDs, emails, or usernames.

## Error tracking

`index.js` installs PostHog Express request context middleware before the routes and `setupExpressErrorHandler` after the routes. This configures centralized capture for uncaught Express errors. The run verified the wiring in source, but did not trigger an error or observe an error event arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926561) contains daily trends for the three events and an ordered todo lifecycle funnel. The dashboard and four insights were created successfully. Because traffic was not generated during the run, the dashboard may be empty until the API receives events.

## Build and verification status

- Dependency installation completed successfully; npm reported zero vulnerabilities.
- No build, typecheck, lint, test run, app startup, or live event-delivery verification was performed. `package.json` has only `start` and `dev` scripts, with no build, typecheck, or lint scripts.
- No build conflict was reported. This is not evidence that a production build or runtime delivery succeeds.

## Issues to follow up

- **Event delivery is unresolved:** the run confirmed capture calls exist but did not confirm that `todo_created`, `todo_updated`, or `todo_deleted` arrived in PostHog. If left unresolved, the dashboard and funnel may remain empty or fail to represent real usage.
- **Identity attribution is unresolved by design:** all current events are personless because no stable user identity exists. If left unchanged after authentication is introduced, user-level attribution and returning-user analysis will remain unavailable.

## Next steps

1. Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, using `.env.example` for the exact names; do not rely only on the local `.env`.
2. Run the API and exercise create, update, and delete requests, then confirm the three event names arrive in PostHog and populate the dashboard.
3. Trigger an intentional test error in a safe environment and confirm it appears in PostHog Error Tracking.
4. If authentication is added, wire the verified stable user ID into request context before relying on user-level analytics.
5. Run the project’s full production-equivalent checks before merging.

## Before you merge

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the integration.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in deployment environments, not just locally; inspect `.env.example` and `posthog.js`.
- [ ] Start the API and verify the three instrumented events arrive in PostHog; inspect the capture call sites in `index.js` and the dashboard.
- [ ] Trigger and verify centralized error tracking in a safe environment; inspect the middleware setup in `index.js`.
