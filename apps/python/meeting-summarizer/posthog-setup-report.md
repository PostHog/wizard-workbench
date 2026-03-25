<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. A new shared `posthog_client.py` module was created to initialize the PostHog instance using environment variables, with `atexit` registration to ensure events are flushed on exit and `enable_exception_autocapture=True` for automatic exception tracking. Event tracking was added to `server.py` (the HTTP server handling authentication and meeting management) and `user_service.py` (the standalone user management service). Environment variables `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` were written to `.env`.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully logs in; also sets person properties (`username`) | `server.py` |
| `user_logged_out` | Fired when a user logs out | `server.py` |
| `user_registered` | Fired when a new user account is created via the API | `server.py` |
| `meeting_created` | Fired when a meeting transcript is submitted and summarized; includes `participant_count`, `duration_minutes`, `action_item_count`, `key_point_count`, `transcript_length` | `server.py` |
| `meeting_deleted` | Fired when a meeting is deleted | `server.py` |
| `user_registered` | Fired when a new user is registered via the user service | `user_service.py` |
| `user_deactivated` | Fired when a user account is deactivated | `user_service.py` |
| `user_deleted` | Fired when a user account is permanently deleted | `user_service.py` |

## Next steps

You can build a dashboard in PostHog to monitor user behavior. Here are some suggested insights to create:

- **Login trend** — Trends chart for `user_logged_in` over time
- **Registration trend** — Trends chart for `user_registered` over time
- **Meeting creation trend** — Trends chart for `meeting_created` over time
- **Login → Meeting creation funnel** — Funnel from `user_logged_in` → `meeting_created`
- **User churn** — Trends chart for `user_deactivated` and `user_deleted` over time

Visit your PostHog project to create the dashboard:
- [PostHog Dashboard](https://us.posthog.com/project/238460/dashboard)
- [New Insight](https://us.posthog.com/project/238460/insights/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
