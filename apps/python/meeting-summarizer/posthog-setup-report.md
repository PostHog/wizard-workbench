<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics have been added to `server.py` and `user_service.py`. Both files now initialize a `Posthog` instance using environment variables (`POSTHOG_API_KEY`, `POSTHOG_HOST`), register `posthog_client.shutdown` with `atexit` to ensure events are flushed on exit, and capture key user and meeting lifecycle events. User properties are set on login and registration using `posthog_client.set()`. Exception autocapture is enabled via `enable_exception_autocapture=True`. The `posthog` and `python-dotenv` packages have been added to `requirements.txt`.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated via `/api/auth/login` | `server.py` |
| `user_login_failed` | Login attempt failed (user not found or account inactive) | `server.py` |
| `user_logged_out` | User session ended via `/api/auth/logout` | `server.py` |
| `user_created` | New user account created via `/api/users` POST | `server.py` |
| `user_deleted` | User account permanently deleted via `/api/users` DELETE | `server.py` |
| `meeting_created` | New meeting submitted; includes transcript word count and participant count | `server.py` |
| `meeting_summarized` | AI analysis completed; includes action item count, key point count, participant count, and duration | `server.py` |
| `meeting_deleted` | Meeting deleted via `/api/meetings` DELETE | `server.py` |
| `user_registered` | New user registered via `UserService.register_user()`; sets username and has_full_name person properties | `user_service.py` |
| `user_deactivated` | User account deactivated via `UserService.deactivate_user()` | `user_service.py` |

## Next steps

No dashboard creation tool was available during this run. You can build insights manually in PostHog using the events above. Here are five recommended insights:

1. **Login funnel** — Funnel from `user_logged_in` → `meeting_created` → `meeting_summarized`. Tracks how many logged-in users go on to submit and summarize a meeting.
2. **Meeting summarization trend** — Trend of `meeting_summarized` over time, broken down by `participant_count` and `duration_minutes`.
3. **Login failure rate** — Trend comparing `user_logged_in` vs `user_login_failed`, to monitor authentication health.
4. **User churn signals** — Trend of `user_deactivated` and `user_deleted` over time, to track account churn.
5. **Meeting engagement** — Average `action_item_count` and `key_point_count` per `meeting_summarized` event to gauge output quality.

You can create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
