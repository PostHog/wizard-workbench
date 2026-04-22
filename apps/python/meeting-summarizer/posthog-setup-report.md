<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. A new shared `posthog_client.py` module was created to initialize the PostHog SDK using environment variables, and event tracking was added to `server.py` (the HTTP API server) and `user_service.py` (the user management service). User identification is performed on login and registration via `posthog_client.set()`. Anonymous hashed distinct IDs are used for failed login attempts to avoid sending PII. The `posthog` and `python-dotenv` packages were added to `requirements.txt`.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `server.py` |
| `user_login_failed` | Fired when a login attempt fails (user not found or inactive) | `server.py` |
| `user_logged_out` | Fired when a user logs out | `server.py` |
| `meeting_created` | Fired when a meeting is created and summarized successfully | `server.py` |
| `meeting_deleted` | Fired when a user deletes a meeting | `server.py` |
| `meeting_viewed` | Fired when a user views a specific meeting (top of meeting detail funnel) | `server.py` |
| `user_registered` | Fired when a new user account is created via API | `server.py` |
| `meeting_stats_viewed` | Fired when a user views their meeting statistics dashboard | `server.py` |
| `user_deactivated` | Fired when a user is deactivated | `user_service.py` |
| `user_deleted` | Fired when a user account is permanently deleted | `user_service.py` |

## Next steps

Visit your PostHog project to explore these events and build insights. Here are some recommended dashboards and insights to create based on the events instrumented:

1. **Login funnel** — Trend of `user_logged_in` vs `user_login_failed` to monitor authentication health
2. **Meeting creation funnel** — Steps: `user_logged_in` → `meeting_created` → `meeting_viewed` to track engagement
3. **Meeting activity** — Trend of `meeting_created` and `meeting_deleted` over time to understand churn signals
4. **Stats engagement** — Trend of `meeting_stats_viewed` to see how often users check their analytics
5. **User lifecycle** — Trend of `user_registered`, `user_deactivated`, and `user_deleted` to monitor growth and churn

To create an "Analytics basics" dashboard in PostHog:
1. Go to your PostHog project at https://us.i.posthog.com
2. Navigate to **Dashboards** → **New dashboard**
3. Name it "Analytics basics" and add insights using the event names above

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
