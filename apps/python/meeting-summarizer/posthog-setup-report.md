<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer. The following files were created or modified:

- **`posthog_client.py`** *(new)* — Initializes the PostHog `Posthog` instance using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables, with `enable_exception_autocapture=True`.
- **`server.py`** — Imports `posthog_client` and adds event tracking for login, logout, user creation/deletion, meeting creation/deletion, exception capture on all request handlers, and `posthog_client.shutdown()` on server exit.
- **`user_service.py`** — Imports `posthog_client`, registers `posthog_client.shutdown` via `atexit`, and captures user registration, profile update, and deactivation events.
- **`requirements.txt`** — Added `posthog>=3.0.0` and `python-dotenv>=1.0.0`.
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.

## Events tracked

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated | `server.py` |
| `user_login_failed` | Login attempt failed (user not found or inactive) | `server.py` |
| `user_logged_out` | User ended their session | `server.py` |
| `user_created` | New user account created via API | `server.py` |
| `user_deleted` | User account deleted via API | `server.py` |
| `meeting_created` | Meeting transcript submitted and summary generated | `server.py` |
| `meeting_deleted` | Meeting record deleted | `server.py` |
| `user_registered` | New user registered via UserService | `user_service.py` |
| `user_profile_updated` | User profile fields updated via UserService | `user_service.py` |
| `user_deactivated` | User account deactivated via UserService | `user_service.py` |

## Next steps

Visit your PostHog project to explore the captured events and build insights:

- **PostHog project:** https://us.posthog.com/project/2

Recommended insights to create in an **"Analytics basics"** dashboard:

1. **Login funnel** — Conversion from `user_logged_in` to `meeting_created` (tracks how many users who log in actually create a meeting)
2. **Meeting creation trend** — Trend of `meeting_created` over time
3. **Login failure rate** — Ratio of `user_login_failed` to total login attempts
4. **User churn** — Trend of `user_deactivated` over time
5. **Active users** — Unique users who fired `user_logged_in` in the last 30 days

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
