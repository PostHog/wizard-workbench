# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the AI Meeting Summarizer Python application. The following changes were made:

- **`requirements.txt`** — Added `posthog>=3.0.0` and `python-dotenv>=1.0.0` as dependencies.
- **`server.py`** — Added PostHog SDK initialization using environment variables (`POSTHOG_KEY`, `POSTHOG_HOST`). The client is initialized once at module load and shut down gracefully via `atexit`. Event capture calls were added for all key user and content actions. User identification (`set()` and `set_once()`) is performed on login to enrich person profiles. Exception autocapture is enabled on the client, and `capture_exception()` is called in all `except` handlers for the GET, POST, PUT, and DELETE request handlers.
- **`.env`** — Created with `POSTHOG_KEY` and `POSTHOG_HOST` values (gitignored).

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in via `/api/auth/login` | `server.py` |
| `user_login_failed` | Fired when a login attempt fails (user not found or inactive) | `server.py` |
| `user_logged_out` | Fired when a user logs out via `/api/auth/logout` | `server.py` |
| `meeting_created` | Fired when a user submits a transcript and a new meeting is created with AI analysis | `server.py` |
| `meeting_deleted` | Fired when a user deletes a meeting | `server.py` |
| `user_registered` | Fired when a new user account is created via `/api/users` | `server.py` |
| `user_deleted` | Fired when a user account is permanently deleted | `server.py` |

## Next steps

To explore your analytics data, visit your PostHog project:

- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboards)
- [Insights](https://us.posthog.com/project/2/insights)
- [People](https://us.posthog.com/project/2/persons)
- [Error Tracking](https://us.posthog.com/project/2/error_tracking)

Suggested insights to create manually based on the instrumented events:

1. **Login conversion funnel** — `user_logged_in` → `meeting_created` (measures how many users who log in go on to create a meeting)
2. **Login failure rate** — Trend of `user_login_failed` vs `user_logged_in` over time
3. **Meeting creation trend** — Daily/weekly count of `meeting_created` events
4. **User churn signal** — `user_deleted` + `user_logged_out` without subsequent `user_logged_in`
5. **User registration trend** — Weekly count of `user_registered` events

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
