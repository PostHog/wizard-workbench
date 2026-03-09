<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. The PostHog Python SDK was added as a dependency, a client is initialized from environment variables at startup (with `enable_exception_autocapture=True`), and shutdown is registered with `atexit` to ensure events are flushed on process exit.

**Files modified:**

- `requirements.txt` — Added `posthog>=3.0.0` and `python-dotenv>=1.0.0`
- `server.py` — PostHog client initialization; event capture on login, login failure, logout, user registration, user deletion, meeting creation, meeting deletion; exception capture on all unhandled API errors
- `user_service.py` — PostHog client initialization; event capture on user deactivation

**Environment variables** were written to `.env`:
- `POSTHOG_PROJECT_API_KEY` — your PostHog project API key
- `POSTHOG_HOST` — `https://us.i.posthog.com`

## Event tracking summary

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated and a session was created | `server.py` |
| `user_login_failed` | Login attempt failed because user was not found or account is inactive | `server.py` |
| `user_logged_out` | User explicitly logged out and their session was destroyed | `server.py` |
| `meeting_created` | A new meeting was submitted with a transcript and AI analysis completed successfully | `server.py` |
| `meeting_deleted` | A user deleted one of their meetings | `server.py` |
| `user_registered` | A new user account was created in the system | `server.py` |
| `user_deactivated` | A user account was deactivated (soft delete) | `user_service.py` |
| `user_deleted` | A user account was permanently deleted from the system | `server.py` |
| API exceptions | Unhandled exceptions in GET/POST/PUT/DELETE handlers auto-captured via `capture_exception` | `server.py` |

## Next steps

To monitor user behavior with the events we've instrumented, create an **"Analytics basics"** dashboard in PostHog with these insights:

1. **User Acquisition** — Trend of `user_registered` and `user_logged_in` events over time
2. **Authentication Funnel** — Funnel from `user_logged_in` → `meeting_created` (shows activation rate)
3. **Meeting Activity** — Trend of `meeting_created` and `meeting_deleted` events, with properties like `transcript_word_count`, `participant_count`, `duration_minutes`
4. **Churn Signals** — Trend of `user_deactivated` and `user_deleted` events over time
5. **Login Health** — Ratio of `user_login_failed` to `user_logged_in` over time (authentication error rate)

You can create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
