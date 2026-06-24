# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. PostHog was added to two files: `server.py` (the HTTP server handling all API routes) and `user_service.py` (the standalone user management service). The `posthog` and `python-dotenv` packages were added to `requirements.txt`, and credentials are loaded from a `.env` file via environment variables. The `Posthog` client is initialized once at module startup using the instance-based API, with `enable_exception_autocapture=True` and `atexit.register(client.shutdown)` to flush all queued events on exit. User identification (`posthog_client.set()`) is called on successful login to keep person profiles up to date. Exception capture (`capture_exception()`) was added to all four HTTP method handlers for automatic error tracking.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates via the login endpoint. | `server.py` |
| `user_login_failed` | Fired when a login attempt fails due to invalid credentials or inactive account. | `server.py` |
| `user_logged_out` | Fired when a user explicitly logs out and their session is destroyed. | `server.py` |
| `meeting_created` | Fired when a meeting transcript is submitted and successfully analyzed by the AI summarizer. | `server.py` |
| `meeting_viewed` | Fired when a user opens the detail view of a meeting summary. | `server.py` |
| `meeting_deleted` | Fired when a user permanently deletes a meeting from their account. | `server.py` |
| `user_created` | Fired when an authenticated user creates a new account via the admin API. | `server.py` |
| `user_registered` | Fired when a new user account is successfully registered via the UserService. | `user_service.py` |
| `user_deactivated` | Fired when a user account is deactivated (soft-deleted) via the UserService. | `user_service.py` |
| `user_deleted` | Fired when a user account is permanently deleted via the UserService. | `user_service.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1751155
- Login to Meeting Creation Funnel: https://us.posthog.com/project/483112/insights/5IDl4Srs
- Meeting Creation Trend: https://us.posthog.com/project/483112/insights/xh3NsfxW
- Meeting Deletions (Churn Signal): https://us.posthog.com/project/483112/insights/9lWUrLOw
- User Registrations: https://us.posthog.com/project/483112/insights/ckM79AFC
- Failed Login Attempts: https://us.posthog.com/project/483112/insights/K41wdgHl

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
