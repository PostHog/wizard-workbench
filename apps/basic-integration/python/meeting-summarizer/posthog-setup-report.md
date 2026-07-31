# PostHog setup report

PostHog analytics was added to the Python meeting summarizer with shared initialization, authenticated identity context, seven business-event captures, exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed the Python `posthog` package, resolved as version 7.35.4, and declared `posthog` in `requirements.txt`.
- Added a process-wide `Posthog` instance in `posthog_client.py`, configured from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Enabled `enable_exception_autocapture=True` and registered `shutdown` with `atexit` so queued events flush at process exit.
- Missing configuration remains a production no-op and raises a clear development/debug error instead of silently disabling analytics.
- `.env.example` documents the required keys. The run verified both keys are present in the configured environment; the application itself does not load dotenv files, so deployment must provide them to the process.

## Events instrumented

These events are defined in `.posthog-wizard-cache/.posthog-events.json` and are captured on successful authenticated mutation paths in `server.py`.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | An authenticated user successfully creates a session. | `server.py` |
| `user_logged_out` | An authenticated user ends their session. | `server.py` |
| `user_created` | An authenticated user successfully creates a user account. | `server.py` |
| `user_updated` | An authenticated user successfully updates a user account. | `server.py` |
| `user_deleted` | An authenticated user successfully deletes a user account. | `server.py` |
| `meeting_created` | An authenticated user successfully creates and summarizes a meeting. | `server.py` |
| `meeting_deleted` | An authenticated user successfully deletes one of their meetings. | `server.py` |

Event properties are aggregate metadata such as transcript length, duration, generated-item counts, and target/current-user booleans. User email, name, and username are sent as person properties through `set()`, not as event properties.

## Identity

User identification was wired. After request headers are parsed, authenticated sessions bind the shared PostHog context to stable `user.user_id`. Successful login re-identifies the newly authenticated user before `user_logged_in` is captured and sets person properties. Returning authenticated requests therefore use the stable account identity.

## Error tracking

The shared client enables Python SDK exception autocapture. No additional route-level manual exception capture was added; existing handlers convert their own exceptions into HTTP 500 responses.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935664)

The dashboard contains five insights covering user activity, meeting creation, account changes, a login-to-meeting funnel, and meeting lifecycle comparisons over the last 30 days. The run verified that the dashboard and insights were created successfully. It did **not** verify that application events arrived; the dashboard may remain empty until traffic generates events.

## What the run verified, and what it did not

- Verified: dependency installation, environment-key presence, the shared SDK initialization shape, event definitions and call sites, authenticated context wiring, exception-autocapture configuration, and Python compilation with `python3 -m compileall server.py posthog_client.py`.
- Not verified: runtime event delivery to PostHog, event counts, dashboard population, production startup, lint/type checks, or the full test suite. A passing compile proves the code compiles, not that events flow.
- No CSP or browser SDK changes apply because this is a standard-library Python HTTP server.

## Unresolved issue

Runtime delivery and attribution were not exercised. If left unverified, events could be queued or configured correctly in code yet fail to reach PostHog in the deployed process, and dashboard conclusions would remain unsupported.

## Before you merge

- [ ] Run the full production/startup verification for the deployed Python process and confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are supplied by deployment configuration, not only local `.env` setup; inspect `posthog_client.py` and `.env.example`.
- [ ] Run the test suite and update any mocks or fixtures affected by the new shared client and captures; inspect `server.py` capture paths.
- [ ] Exercise login, logout, user mutations, and meeting create/delete in a configured environment, then confirm the seven named events arrive in PostHog with the expected stable user identity; inspect the capture call sites in `server.py`.
- [ ] Confirm the returning authenticated-session path reaches `identify_context(user.user_id)` after headers are parsed; inspect `server.py` `parse_request()`.
- [ ] Run lint/type checks if the deployment provides them; compile verification covered only `server.py` and `posthog_client.py`.
