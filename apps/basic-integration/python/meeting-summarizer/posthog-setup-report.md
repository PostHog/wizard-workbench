<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your AI Meeting Summarizer project with PostHog analytics. The Python SDK was installed and configured via environment variables. A PostHog client is initialized at startup using `enable_exception_autocapture=True` and registered with `atexit` for clean shutdown. Six business-critical events were instrumented in `server.py`, covering the full user lifecycle and the core product value action. User identification is performed on every successful login via `posthog_client.set()`, associating person properties (username and email) with the user's stable `user_id` as the PostHog `distinct_id`. Unhandled exceptions in all HTTP verb handlers (`do_GET`, `do_POST`, `do_PUT`, `do_DELETE`) are forwarded to PostHog error tracking via `capture_exception()`.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | A user successfully authenticated and started a session. | `server.py` |
| `user_logged_out` | A user explicitly ended their session by logging out. | `server.py` |
| `meeting_created` | A meeting transcript was submitted and AI analysis completed successfully. This is the core product value event. Properties: `transcript_word_count`, `action_items_count`, `key_points_count`, `participant_count`, `duration_minutes`. | `server.py` |
| `meeting_deleted` | A user deleted a meeting from their account. Properties: `duration_minutes`, `action_items_count`. | `server.py` |
| `user_registered` | A new user account was created via the admin API. | `server.py` |
| `user_deactivated` | A user account was permanently deleted from the system. | `server.py` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights to monitor your key metrics:

1. **[User Logins Over Time](https://us.posthog.com/project/2/insights/new)** — Trends chart for `user_logged_in`, showing daily active users logging in.
2. **[Meetings Created Over Time](https://us.posthog.com/project/2/insights/new)** — Trends chart for `meeting_created`, your core product value metric.
3. **[Login → Meeting Funnel](https://us.posthog.com/project/2/insights/new)** — Funnel from `user_logged_in` → `meeting_created`, showing conversion from login to value delivery.
4. **[Meeting Deletions](https://us.posthog.com/project/2/insights/new)** — Trends chart for `meeting_deleted`, a churn signal to monitor.
5. **[New User Registrations](https://us.posthog.com/project/2/insights/new)** — Trends chart for `user_registered`, tracking user acquisition growth.

Create your dashboard at [PostHog Dashboards](https://us.posthog.com/project/2/dashboards).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
