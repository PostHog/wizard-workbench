<wizard-report>
# PostHog post-wizard report

The wizard has completed a full integration of PostHog analytics into the AI Meeting Summarizer Python project. A new `posthog_client.py` module was created to initialise the PostHog SDK from environment variables, and event tracking was added to `server.py` and `user_service.py`. User identification (`posthog_client.set()`) is called on login and registration to attach person properties to each distinct ID. `atexit.register(posthog_client.shutdown)` ensures all queued events are flushed before the process exits.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates | `server.py` |
| `user_login_failed` | Fired when a login attempt fails (unknown user or inactive account) | `server.py` |
| `user_logged_out` | Fired when a user explicitly logs out and their session is destroyed | `server.py` |
| `meeting_created` | Fired when a user submits a transcript and a new meeting summary is saved | `server.py` |
| `meeting_deleted` | Fired when a user deletes one of their meetings | `server.py` |
| `user_registered` | Fired when a new user account is successfully created | `user_service.py` |
| `user_deactivated` | Fired when a user account is deactivated (soft delete) | `user_service.py` |

## Next steps

Head to your PostHog project to explore these events and build insights:

- **PostHog project**: https://us.i.posthog.com/project/2/dashboards
- **Suggested insights to create**:
  - **Login trend** — `user_logged_in` over time (daily/weekly active users)
  - **Login failure rate** — `user_login_failed` vs `user_logged_in` to spot auth issues
  - **Registration funnel** — `user_registered` → `user_logged_in` → `meeting_created`
  - **Meeting creation trend** — `meeting_created` over time with `participant_count` and `duration_minutes` breakdowns
  - **Churn signal** — `user_deactivated` over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
