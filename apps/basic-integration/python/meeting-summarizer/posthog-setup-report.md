# PostHog post-wizard report

The wizard has completed a deep integration of the AI Meeting Summarizer Python application. PostHog is now initialized in `server.py` using the instance-based `Posthog()` class, loaded from environment variables via `python-dotenv`. Seven key business events are captured across the authentication and meeting lifecycle flows. User identification is performed on login and registration via `posthog_client.set()` to set person properties (email, username). Exception autocapture is enabled. Shutdown is registered with `atexit` to ensure all events are flushed when the server stops.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `server.py` |
| `user_login_failed` | Fired when a login attempt fails (user not found or inactive) | `server.py` |
| `user_logged_out` | Fired when a user logs out | `server.py` |
| `meeting_created` | Fired when a user submits a transcript and a new AI-summarized meeting is saved | `server.py` |
| `meeting_deleted` | Fired when a user deletes a meeting | `server.py` |
| `user_registered` | Fired when a new user account is created via the API | `server.py` |
| `user_deleted` | Fired when a user account is permanently deleted | `server.py` |

## Next steps

We recommend building an **Analytics basics** dashboard in PostHog to monitor user behavior and meeting activity. Here are five suggested insights to add:

1. **Login trends over time** — Trends chart for `user_logged_in` showing daily active logins: [Create insight](/insights/new)
2. **Login success vs failure** — Trends chart comparing `user_logged_in` and `user_login_failed` to monitor authentication health: [Create insight](/insights/new)
3. **Meeting creation funnel** — Funnel from `user_logged_in` → `meeting_created` to measure how many logged-in users create a meeting: [Create insight](/insights/new)
4. **Meetings created over time** — Trends chart for `meeting_created` broken down by `participants_count` or `duration_minutes`: [Create insight](/insights/new)
5. **Churn signal: meeting deletions** — Trends chart for `meeting_deleted` vs `meeting_created` to detect when users are removing more than they create: [Create insight](/insights/new)

Create a new dashboard at [/dashboard](/dashboard) and add these insights to get started.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
