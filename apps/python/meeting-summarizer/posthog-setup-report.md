<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer application.

## Changes made

### New files
- **`posthog_client.py`** — Shared PostHog client module. Initializes the `Posthog` instance from `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables with `enable_exception_autocapture=True`, and registers `shutdown()` via `atexit` so events are always flushed on exit.
- **`.env`** — Environment variable file containing `POSTHOG_API_KEY` and `POSTHOG_HOST` (covered by `.gitignore`).

### Modified files
- **`requirements.txt`** — Added `posthog>=3.0.0` and `python-dotenv>=1.0.0`.
- **`server.py`** — Added PostHog event capture for all key user and meeting lifecycle events (see table below). User person properties (`username`, `has_full_name`) are set via `ph.set()` on login — no PII is placed in `capture()` event properties.
- **`user_service.py`** — Added PostHog event capture for user deactivation and deletion.

## Tracked events

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully authenticated and a session was created | `server.py` |
| `user_login_failed` | User attempted to log in but authentication failed | `server.py` |
| `user_logged_out` | User session was destroyed via the logout endpoint | `server.py` |
| `meeting_created` | A new meeting was submitted, transcribed and summarized | `server.py` |
| `meeting_deleted` | A meeting was permanently deleted by its owner | `server.py` |
| `user_registered` | A new user account was created via the API | `server.py` |
| `user_deactivated` | A user account was deactivated | `user_service.py` |
| `user_deleted` | A user account was permanently deleted | `user_service.py` |

## Next steps

Explore your events and build insights in PostHog:

- **PostHog project dashboard**: https://us.posthog.com/project/238460/dashboard
- **Explore events**: https://us.posthog.com/project/238460/events
- **Build a login conversion funnel** (`user_registered` → `user_logged_in`): https://us.posthog.com/project/238460/insights/new?insight=FUNNELS
- **Track daily active users** (trend of `user_logged_in`): https://us.posthog.com/project/238460/insights/new?insight=TRENDS
- **Monitor churn signals** (trend of `user_deactivated` + `user_deleted`): https://us.posthog.com/project/238460/insights/new?insight=TRENDS

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
