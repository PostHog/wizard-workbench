<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. The following changes were made:

- Added `posthog` and `python-dotenv` to `requirements.txt`.
- Added a `_init_posthog()` helper in `server.py` that reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables, constructs a `Posthog` instance with `enable_exception_autocapture=True`, and registers `client.shutdown` via `atexit` so all queued events are flushed on exit.
- Instrumented nine business-critical events across the login, logout, user registration/deletion, meeting creation/view/deletion, and stats endpoints.
- Added `posthog_client.set()` calls at login and user registration to keep person properties (`username`, `is_active`) up-to-date.
- Added `posthog_client.capture_exception(e)` in all four HTTP method error handlers (`do_GET`, `do_POST`, `do_PUT`, `do_DELETE`) to surface runtime errors in PostHog's error tracking.
- Created `.env` with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (`.gitignore` coverage ensured by wizard-tools).

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully authenticates | `server.py` |
| `user_login_failed` | Fired when a login attempt fails (user not found or inactive) | `server.py` |
| `user_logged_out` | Fired when a user logs out and their session is destroyed | `server.py` |
| `meeting_created` | Fired when a meeting is created and its transcript analyzed | `server.py` |
| `meeting_deleted` | Fired when a user deletes one of their meetings | `server.py` |
| `meeting_viewed` | Fired when a user fetches a specific meeting detail | `server.py` |
| `user_registered` | Fired when a new user account is created via the API | `server.py` |
| `user_deleted` | Fired when a user account is permanently deleted | `server.py` |
| `stats_viewed` | Fired when a user retrieves their meeting statistics | `server.py` |

## Next steps

To build dashboards and insights from these events, visit your PostHog project and create an **"Analytics basics"** dashboard with insights such as:

- **Login funnel** — `user_logged_in` → `meeting_created` (conversion from login to first meeting)
- **Meeting activity trend** — `meeting_created` over time (daily/weekly active usage)
- **Churn signal** — users with `user_logged_out` but no subsequent `user_logged_in`
- **Stats engagement** — `stats_viewed` count by user (power-user identification)
- **Error rate** — exceptions captured via autocapture over time

Navigate to [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) to get started.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
