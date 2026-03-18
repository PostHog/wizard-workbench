<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. A shared `posthog_client.py` module was created to initialize the PostHog SDK using environment variables, with automatic exception capture and graceful shutdown via `atexit`. Event tracking was added to `server.py` (covering the full authentication and meeting lifecycle) and `user_service.py` (covering user registration and account management). User identification (`posthog_client.set`) is called on login and registration to associate person properties with each distinct ID.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated and started a session | `server.py` |
| `user_login_failed` | Authentication attempt failed (user not found or inactive) | `server.py` |
| `user_logged_out` | User ended their session | `server.py` |
| `meeting_created` | User submitted a meeting transcript and it was summarized by AI | `server.py` |
| `meeting_deleted` | User deleted a meeting record | `server.py` |
| `user_created` | A new user account was created via the API | `server.py` |
| `user_registered` | New user registered via the UserService | `user_service.py` |
| `user_deactivated` | User account was deactivated | `user_service.py` |
| `user_deleted` | User account was permanently deleted | `user_service.py` |

## Next steps

To view your analytics, navigate to your PostHog project and create a dashboard with insights based on the events above. Suggested insights:

- **Login funnel** — Conversion from `user_logged_in` to `meeting_created` to understand activation rate
- **Meeting creation trend** — Total count of `meeting_created` over time to track product usage growth
- **Login failure rate** — Ratio of `user_login_failed` to total login attempts to monitor auth health
- **Churn signals** — `user_deactivated` and `user_deleted` events over time
- **Session depth** — Average meetings created per user between `user_logged_in` and `user_logged_out`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
