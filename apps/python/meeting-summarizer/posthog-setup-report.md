<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer project. The `posthog` and `python-dotenv` packages were added as dependencies. A `Posthog` client instance is initialized using environment variables (`POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`) in both `server.py` and `user_service.py`. Exception autocapture is enabled via `enable_exception_autocapture=True`, and `atexit.register(posthog_client.shutdown)` ensures all events are flushed cleanly on exit. Key business events are captured across two files, covering the full user and meeting lifecycle.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates | `server.py` |
| `user_login_failed` | Fired when a login attempt fails (user not found or inactive) | `server.py` |
| `user_logged_out` | Fired when a user ends their session | `server.py` |
| `user_created` | Fired when a new user account is created via the API | `server.py` |
| `meeting_created` | Fired when a meeting transcript is submitted and saved | `server.py` |
| `meeting_summarized` | Fired when the AI engine processes a transcript | `server.py` |
| `meeting_deleted` | Fired when a user deletes a meeting | `server.py` |
| `user_deleted` | Fired when a user account is deleted via the API | `server.py` |
| `user_registered` | Fired when a user is registered via the UserService | `user_service.py` |
| `user_deactivated` | Fired when a user account is deactivated via the UserService | `user_service.py` |

## Next steps

To build insights and a dashboard for these events, visit your PostHog project and create an **"Analytics basics"** dashboard with the following recommended insights:

1. **Meeting creation trend** — Trends chart for `meeting_created` over time (tracks core product usage growth)
2. **Login-to-meeting funnel** — Funnel from `user_logged_in` → `meeting_created` (conversion rate of active users)
3. **User registration trend** — Trends chart for `user_registered` over time (user acquisition)
4. **Login failure rate** — Trends chart for `user_login_failed` (authentication health)
5. **Churn signal: meeting deletions** — Trends chart for `meeting_deleted` (engagement/churn signal)

Visit your PostHog project at: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
