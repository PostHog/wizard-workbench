<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. The PostHog Python SDK was installed and configured with environment variables. Event tracking was added to `server.py` covering all critical user lifecycle and meeting management actions, including user login (successful and failed), logout, user creation, user deletion, meeting creation (the primary conversion event), and meeting deletion. User identification is performed on login, setting person properties so that all subsequent events can be correlated to a named user profile.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully logs in. Includes user identification via `posthog_client.set()`. | `server.py` |
| `user_login_failed` | Fired when a login attempt fails (user not found or inactive). Includes failure reason property. | `server.py` |
| `user_logged_out` | Fired when a user logs out. | `server.py` |
| `user_created` | Fired when a new user account is created via the API. Includes `has_full_name` flag. | `server.py` |
| `meeting_created` | Fired when a meeting is created with AI summary. Includes `transcript_word_count`, `participant_count`, `action_item_count`, `key_point_count`, and `duration_minutes`. | `server.py` |
| `meeting_deleted` | Fired when a user deletes one of their meetings. Includes `meeting_id` and `duration_minutes`. | `server.py` |
| `user_deleted` | Fired when a user account is permanently deleted by another user. | `server.py` |

## Next steps

Build an "Analytics basics" dashboard in PostHog with these recommended insights to monitor user behavior:

- **[Login conversion funnel](https://us.posthog.com/project/2/insights/new#insight=FUNNELS)** — Track the steps: `user_logged_in` → `meeting_created` to measure how many users that log in go on to create a meeting.
- **[Meeting creation trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — Chart `meeting_created` events over time to track growth in meeting submissions.
- **[Login failures](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — Chart `user_login_failed` events to identify authentication issues.
- **[Meeting churn rate](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — Chart `meeting_deleted` alongside `meeting_created` to understand meeting retention.
- **[User deletion churn](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — Chart `user_deleted` events to track account churn.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
