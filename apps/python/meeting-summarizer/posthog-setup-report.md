<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer project. The `posthog` and `python-dotenv` packages were added to `requirements.txt`. A `Posthog` client instance is initialized at module level in `server.py` using environment variables, with `enable_exception_autocapture=True` for automatic exception tracking. The client is registered with `atexit` to ensure all events are flushed on shutdown. Event tracking was added across the full user and meeting lifecycle.

| Event | Description | File |
|-------|-------------|------|
| `user logged in` | A user successfully authenticated and started a session | `server.py` |
| `user login failed` | A login attempt failed due to invalid credentials or inactive account | `server.py` |
| `user logged out` | A user ended their session | `server.py` |
| `meeting created` | A user submitted a transcript and a meeting record was created with AI-generated summary | `server.py` |
| `meeting deleted` | A user deleted one of their meeting records | `server.py` |
| `user registered` | A new user account was created in the system | `server.py` |
| `user deleted` | A user account was permanently removed from the system | `server.py` |
| `transcript analyzed` | AI summarizer processed a meeting transcript and extracted summary, action items, and key points | `server.py` |

## Next steps

To visualize your analytics, create an **"Analytics basics"** dashboard in PostHog with the following suggested insights:

1. **Login funnel** — Funnel from `user logged in` → `meeting created` to measure activation rate
2. **Daily logins** — Trend of `user logged in` over time to track daily active users
3. **Meeting creation rate** — Trend of `meeting created` grouped by day/week
4. **Login failure rate** — Trend of `user login failed` to spot authentication issues
5. **Churn signal** — Trend of `user deleted` to track account cancellations

You can create these in PostHog at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
