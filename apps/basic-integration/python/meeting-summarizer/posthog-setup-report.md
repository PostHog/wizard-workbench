# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics have been added to the AI Meeting Summarizer application. The `posthog` and `python-dotenv` packages were added to `requirements.txt`. A single `Posthog` client instance is initialized in `server.py` using environment variables, with `enable_exception_autocapture=True` for automatic unhandled-exception tracking and `atexit` shutdown to ensure all events are flushed on exit. Six server-side events are captured across the authentication, user management, and meeting workflows.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates via the login endpoint. Person properties (`username`) are set at the same time. | `server.py` |
| `user_logged_out` | Fired when a user ends their session via the logout endpoint. | `server.py` |
| `user_registered` | Fired when a new user account is successfully created. Person properties (`username`) are set at the same time. | `server.py` |
| `transcript_analyzed` | Fired after the AI summarizer processes a transcript. Properties: `transcript_word_count`, `participant_count`, `action_item_count`, `key_point_count`, `duration_minutes`. | `server.py` |
| `meeting_created` | Fired when a meeting record is successfully saved. Properties: `duration_minutes`, `participant_count`, `action_item_count`, `key_point_count`, `transcript_word_count`. | `server.py` |
| `meeting_deleted` | Fired when a user deletes one of their meetings. | `server.py` |

## Next steps

Visit your PostHog project to build insights on the events above. Suggested charts:

- **Login trend** — Trends chart for `user_logged_in` over time to track daily active users.
- **Meeting creation funnel** — Funnel from `user_logged_in` → `transcript_analyzed` → `meeting_created` to see where users drop off.
- **Meetings created per user** — Trends chart for `meeting_created` grouped by `distinct_id` to identify power users.
- **Transcript size distribution** — Trends chart for `transcript_analyzed` with `transcript_word_count` aggregated as average.
- **Churn signal** — Trends chart for `meeting_deleted` over time to monitor deletion activity.

[PostHog Dashboard](/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
