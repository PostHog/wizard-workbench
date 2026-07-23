# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. PostHog event tracking was added to `server.py` (the main HTTP API server) and `user_service.py` (the CLI user management service). A `Posthog()` client is initialised per-module using environment variables, with `enable_exception_autocapture=True` for automatic exception tracking, and `atexit.register(client.shutdown)` to ensure all buffered events are flushed on exit. The `posthog` and `python-dotenv` packages were added to `requirements.txt`.

User identity is set via `posthog_client.set()` on login (server) and on registration (service), storing `username` and `is_active` as person properties without any PII in event properties.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fires when a user successfully authenticates via the login endpoint. | server.py |
| `user_login_failed` | Fires when a login attempt fails because the user is not found or inactive. | server.py |
| `user_logged_out` | Fires when a user ends their session via the logout endpoint. | server.py |
| `meeting_created` | Fires when a user successfully submits a meeting transcript and it is saved. | server.py |
| `meeting_deleted` | Fires when a user permanently removes a meeting from their account. | server.py |
| `user_created` | Fires when an admin creates a new user account through the API. | server.py |
| `user_registered` | Fires when the CLI user service successfully registers a new user. | user_service.py |
| `user_deactivated` | Fires when a user account is soft-deleted via the user service. | user_service.py |
| `user_deleted` | Fires when a user account is permanently deleted via the user service. | user_service.py |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1897384)
- [Login to Meeting Creation Funnel](https://us.posthog.com/project/483112/insights/kHnXjYXj)
- [Meetings Created Over Time](https://us.posthog.com/project/483112/insights/swjmRpQA)
- [Login Success vs Failure](https://us.posthog.com/project/483112/insights/jdNx7EtH)
- [User Logouts Over Time](https://us.posthog.com/project/483112/insights/4BwC2HkA)
- [Meetings Deleted Over Time](https://us.posthog.com/project/483112/insights/aksaxPBw)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `set()` — the current server-side implementation identifies on login, but a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs if the session expires.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
