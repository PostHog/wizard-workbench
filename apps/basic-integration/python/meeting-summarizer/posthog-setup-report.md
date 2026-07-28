# PostHog setup report

PostHog was added to the Python meeting summarizer with one process-wide SDK client, authenticated request identity, seven server-side event call sites, exception autocapture, and a starter dashboard.

## What was installed and initialized

- Added the `posthog` Python SDK to `requirements.txt`; review installed `posthog 7.32.0` successfully.
- Added `python-dotenv` to `requirements.txt`; review installed `python-dotenv 1.2.2` successfully.
- `posthog_client.py` loads `.env`, reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, and creates the process-wide instance-based `Posthog` client.
- The client enables `enable_exception_autocapture=True` and registers `client.shutdown` with `atexit` so queued events and errors can flush on exit.
- Missing configuration is loud in development and disables analytics with a warning in production, as recorded by the initialization and review handoffs.
- The real project configuration was written to `.env` by the initialization step. `.env.example` documents the variable names with placeholders; secrets are not included in this report.

## Events instrumented

The run verified seven `capture` call sites in `server.py` and recorded the following event contract. These are instrumented events, not events observed arriving in PostHog: no runtime application test or event-delivery observation was recorded.

| Event | What it measures | File |
|---|---|---|
| `login_succeeded` | An existing user successfully authenticates and receives a session. | `server.py` |
| `logout_completed` | An authenticated user ends their active session. | `server.py` |
| `user_created` | An authenticated user creates a user account. | `server.py` |
| `user_updated` | An authenticated user successfully updates a user record. | `server.py` |
| `user_deleted` | An authenticated user successfully deletes a user record. | `server.py` |
| `meeting_created` | An authenticated user submits a transcript that is successfully summarized and stored. | `server.py` |
| `meeting_deleted` | An authenticated user successfully deletes one of their saved meetings. | `server.py` |

Meeting event properties use aggregate metadata only (such as transcript length, generated item counts, participant count, and duration). The capture handoff recorded that raw transcripts, titles, participant names, emails, and other PII were excluded.

## Identification

Identification was wired. The `identified_request` decorator in `server.py` opens a fresh PostHog context for `do_GET`, `do_POST`, `do_PUT`, and `do_DELETE`, and applies `identify_context(user.user_id)` when a session-authenticated user is present. Successful login establishes identity in a fresh context and sends email, username, and full name through `posthog_client.set` as person properties rather than event properties. No browser SDK exists, so no frontend identify/reset path was added.

## Error tracking

Global uncaught-exception tracking is enabled through `enable_exception_autocapture=True` on the singleton in `posthog_client.py`. The existing `atexit` shutdown registration flushes captured data. No additional per-route exception hooks were added. The run did not observe an exception event arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919805) was created with five tagged insights: user activity trends, meeting creation activity, account management actions, a login-to-meeting activation funnel, and session endings/meeting deletions. The dashboard handoff states that the insights use the seven exact event names and last-30-days windows; empty results are expected until events arrive.

## What the run verified, and what it did not

### Verified by the run

- Dependency installation completed successfully.
- Static review found the singleton initialization, environment loading, request identity contexts, exception autocapture, shutdown registration, and seven capture call sites.
- The event plan was recorded in `.posthog-wizard-cache/.posthog-events.json`.
- The dashboard and five insights were created successfully in PostHog.

### Not verified by the run

- No production build, application start, test suite, typecheck, or lint command was run; the review found no project-defined build, typecheck, or lint command.
- No instrumented event was observed arriving in PostHog. The dashboard may remain empty until the application is exercised with valid requests.
- No end-to-end confirmation was recorded for the configured deployment environment or for event delivery after shutdown.

## Build conflicts

No dependency, environment, or build conflict was reported. The review explicitly recorded no conflict and no available project-defined build, typecheck, or lint command. The only defect found was that the server did not load its configured `.env`; review fixed it by adding `python-dotenv` and `load_dotenv()` in `posthog_client.py`.

## Next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only the local `.env`.
2. Exercise successful login, logout, user-management, and meeting create/delete paths in a safe environment, then confirm the seven named events arrive in PostHog and populate the dashboard.
3. Confirm authenticated events are attributed to the expected stable `user.user_id` values and that person properties appear on the corresponding profiles.
4. Run the full application verification checks before merging, especially because the run only performed dependency installation and static review.

## Before you merge

- [ ] Run a full production build or startup verification and fix any errors introduced by the integration; this run did not have a project-defined build command.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures.
- [ ] Verify `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in deployment environments, not just locally in `.env`; inspect `posthog_client.py:12` and `posthog_client.py:35-42`.
- [ ] Because auth identification was wired, exercise a returning authenticated request and verify it continues to use `user.user_id`; inspect `server.py:68-83` and the `@identified_request` handlers at `server.py:161`, `server.py:270`, and `server.py:439`.
- [ ] Trigger each successful action and confirm the corresponding events arrive in PostHog; inspect the capture call sites at `server.py:312`, `server.py:341`, `server.py:376`, `server.py:416`, `server.py:459`, `server.py:489`, and `server.py:512`.
