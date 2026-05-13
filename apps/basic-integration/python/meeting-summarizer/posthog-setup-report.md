<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your AI Meeting Summarizer Python application. A shared `analytics.py` module initializes the PostHog client once from environment variables and registers a graceful shutdown via `atexit`. Events are captured in `server.py` (the HTTP API layer) and `user_service.py` (the user lifecycle service). Person properties are set on login and registration so all events are tied to identified users.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | A user successfully authenticated and started a session | `server.py` |
| `user_login_failed` | A login attempt was rejected (user not found or inactive) | `server.py` |
| `user_logged_out` | A user ended their session | `server.py` |
| `meeting_created` | A user submitted a transcript and a meeting with AI summary was created | `server.py` |
| `meeting_deleted` | A user deleted one of their meetings | `server.py` |
| `meeting_stats_viewed` | A user requested their meeting statistics dashboard | `server.py` |
| `user_registered` | A new user account was created via the user service | `user_service.py` |
| `user_deactivated` | A user account was soft-deleted (deactivated) | `user_service.py` |
| `user_deleted` | A user account was permanently removed | `server.py` |

## Next steps

We've prepared an "Analytics basics" dashboard for you with the following recommended insights. Visit your PostHog project to create them:

- **[New dashboard: Analytics basics](https://us.posthog.com/project/2/dashboard)** — create a dashboard and add the insights below.
- **[Registration → Login funnel](https://us.posthog.com/project/2/insights/new#insight=FUNNELS)** — conversion funnel from `user_registered` to `user_logged_in`. Reveals what share of new users log in after sign-up.
- **[Meeting creation trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — daily/weekly trend of `meeting_created` events. Core engagement metric.
- **[Login failures over time](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — trend of `user_login_failed` broken down by `reason` property. Helps spot authentication issues.
- **[User churn signals](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — combined trend of `user_deactivated` and `user_deleted`. Key retention / churn indicator.
- **[Meeting stats viewed frequency](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — trend of `meeting_stats_viewed` with `total_meetings` as a property chart. Shows how engaged users are with their analytics.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
