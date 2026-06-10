<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics have been added to the AI Meeting Summarizer application across two key files: `server.py` (the HTTP server) and `user_service.py` (the user management background service). The integration uses the instance-based `Posthog()` constructor pattern with `enable_exception_autocapture=True`, environment-variable-driven configuration, and `atexit`-registered shutdown to ensure all events are flushed cleanly on exit. User identification (`posthog_client.set()`) is performed at login and registration to populate person profiles. Exception capture is added to all HTTP handler error paths.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully authenticates via the login endpoint | `server.py` |
| `user_login_failed` | Fired when a login attempt fails due to invalid credentials or inactive account | `server.py` |
| `user_logged_out` | Fired when a user logs out and their session is destroyed | `server.py` |
| `meeting_created` | Fired when a meeting transcript is submitted and successfully analyzed and stored | `server.py` |
| `meeting_deleted` | Fired when a user deletes a meeting from their account | `server.py` |
| `user_created` | Fired when an authenticated user creates a new user account via the API | `server.py` |
| `user_registered` | Fired when a new user is successfully registered through the UserService | `user_service.py` |
| `user_deactivated` | Fired when a user account is deactivated through the UserService | `user_service.py` |

## Next steps

We recommend creating a dashboard named **"Analytics basics (wizard)"** in PostHog with the following five insights:

1. **Meeting creation trend** — Trends chart for `meeting_created` over time, to monitor product adoption.
2. **Login funnel** — Funnel from `user_logged_in` → `meeting_created`, to measure activation rate.
3. **Churn signal** — Trend for `meeting_deleted` vs `meeting_created` ratio over time.
4. **Login failure rate** — Trends chart comparing `user_logged_in` and `user_login_failed` side by side.
5. **User registration over time** — Trend for `user_registered`, to track new user growth.

You can create these insights directly in PostHog:
- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboard)
- [Create new insight](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
