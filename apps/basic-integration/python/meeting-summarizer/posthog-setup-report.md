<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics has been added to the AI Meeting Summarizer Python web application. The `posthog` and `python-dotenv` packages were added to `requirements.txt`, a `Posthog` client instance is initialized at startup in `server.py` using environment variables, and `atexit` is used to ensure events are flushed on shutdown. Exception autocapture is enabled via `enable_exception_autocapture=True`. User identification (`posthog_client.set()`) is called on login and user creation to associate person properties. Exception capture (`posthog_client.capture_exception()`) is added to all four HTTP method error handlers for automatic error tracking.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated and a session was created | `server.py` |
| `user_logged_out` | User explicitly ended their session | `server.py` |
| `meeting_created` | User submitted a transcript and AI summarization completed | `server.py` |
| `meeting_deleted` | User permanently deleted a meeting | `server.py` |
| `meeting_viewed` | User fetched the details of a specific meeting | `server.py` |
| `stats_viewed` | User requested their meeting statistics dashboard | `server.py` |
| `user_created` | A new user account was created in the system | `server.py` |
| `user_deleted` | A user account was permanently deleted | `server.py` |

## Next steps

We attempted to create an "Analytics basics" dashboard automatically, but the configured API key lacks the required write scopes for this project. You can create the dashboard and insights manually in the PostHog UI. Here are the five recommended insights to build:

1. **Login-to-Meeting Funnel** — Funnel insight with steps: `user_logged_in` → `meeting_created`. Measures what fraction of logged-in users actually create a meeting (key conversion metric).

2. **Daily Logins (Trend)** — Trends insight for `user_logged_in` over time. Tracks daily active user engagement.

3. **Meeting Creation Rate (Trend)** — Trends insight for `meeting_created` over time. Core product usage signal.

4. **Meeting Deletion Rate (Trend)** — Trends insight for `meeting_deleted` over time. A rising deletion rate is an early churn warning.

5. **Engagement: Stats Viewed (Trend)** — Trends insight for `stats_viewed` over time. Users who check their stats are more likely to be retained.

Visit [PostHog Insights](https://us.posthog.com/project/2/insights) to create each insight, then add them to a new "Analytics basics" dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
