# PostHog setup report

PostHog server-side analytics was added to the native Node.js contacts API with four mutation events, centralized exception tracking, and a starter dashboard.

## Installed and initialized

- Installed `posthog-node` (`^5.46.1`) and recorded the resolved dependency in `package-lock.json`; `npm install` completed successfully with four packages audited and zero vulnerabilities.
- Added a shared singleton in `posthog.js`, initialized from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- The client uses `enableExceptionAutocapture: true`, `flushAt: 1`, and `flushInterval: 0`. Route captures and exception captures await `posthog.flush()`.
- Configuration is documented in `.env.example`; the run confirmed both variables are present in the local `.env`. Production without configuration is guarded as a no-op, while development reports the missing variable.
- This is server-only Node.js integration; no browser CSP changes were needed.

## Events instrumented

| Event | What it measures | File |
| --- | --- | --- |
| `group_created` | A new contact group is created through the public API. | `index.js` |
| `contact_created` | A new contact is created through the public API. | `index.js` |
| `contact_updated` | An existing contact is updated through the public API. | `index.js` |
| `contact_deleted` | An existing contact is deleted through the public API. | `index.js` |

Captures occur after successful mutations and use non-PII operational properties. The run verified the call sites and event plan, but did **not** run the server or observe events arriving in PostHog. Event delivery therefore remains unconfirmed.

## Identification

User identification was skipped. The API has no authentication, sessions, or stable caller identifier. Contact IDs, names, emails, request headers, and IP-derived values were not used as caller identity; the mutation events remain personless by design.

## Error tracking

The centralized `try/catch` around the native HTTP server handler calls `posthog.captureException()` and awaits a flush before returning the 500 response. Exception metadata includes endpoint, method, and status code without user-entered PII. Exception delivery was not observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914239) — dashboard ID `1914239`, with four daily trend tiles for the instrumented events over a rolling 30-day range. The dashboard and insights were created successfully; they may remain empty until traffic generates events.

## Verification and conflicts

- Dependency installation and review succeeded; `npm install` reported zero vulnerabilities.
- No finite build, typecheck, lint, or test script exists in `package.json`. The long-running `start` and `dev` commands were not launched, so compilation, startup, route behavior, and telemetry flow were not verified.
- No build conflict was reported by any step: **none**.

## Before you merge

- [ ] Run the production/runtime verification available for this API and confirm the PostHog initialization and route behavior in `posthog.js` and `index.js` (the project has no finite build script).
- [ ] Run the test suite, if one is added or available, and update mocks or fixtures for the capture calls in `index.js`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only the local `.env`.
- [ ] Exercise the mutation routes and confirm `group_created`, `contact_created`, `contact_updated`, and `contact_deleted` arrive in PostHog; the run itself did not observe delivery.
- [ ] If authenticated callers are introduced later, replace the personless setup with a stable non-PII caller identifier in the request path before relying on attribution; currently no identity wiring exists.
