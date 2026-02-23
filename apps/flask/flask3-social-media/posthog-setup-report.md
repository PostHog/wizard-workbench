<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Flask microblogging application. PostHog is now initialized globally in `create_app()` using `posthog.api_key` and `posthog.host` set from environment variables. All 13 events across 5 files have been instrumented, covering user authentication, social interactions, content creation, API usage, and error tracking. User identification uses `new_context()` / `identify_context()` to associate each event with the correct user.

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | Fired when a new user completes registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully authenticates via the login form | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out of the application | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user requests a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password | `app/auth/routes.py` |
| `post_created` | Fired when a user publishes a new post to the feed | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a private message to another user | `app/main/routes.py` |
| `posts_export_started` | Fired when a user initiates a post export task | `app/main/routes.py` |
| `api_user_created` | Fired when a new user is created via the REST API | `app/api/users.py` |
| `api_token_granted` | Fired when an API token is issued to an authenticated user | `app/api/tokens.py` |
| `api_token_revoked` | Fired when a user revokes their API token | `app/api/tokens.py` |

**Error tracking:** `posthog.capture_exception()` is called in the 500 error handler in `app/errors/handlers.py`.

**Configuration files edited:**
- `config.py` — Added `POSTHOG_API_KEY`, `POSTHOG_HOST`, `POSTHOG_DISABLED` config values
- `app/__init__.py` — PostHog initialized globally in `create_app()`
- `requirements.txt` — Added `posthog` dependency
- `.env` — `POSTHOG_API_KEY` and `POSTHOG_HOST` set (gitignore-covered)

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **[PostHog Dashboards](https://us.posthog.com/project/2/dashboards)** — Create a new "Analytics basics" dashboard and add the insights below

- 🔵 **[Insight 1 — Signup → Login → Post Creation Funnel](https://us.posthog.com/project/2/insights/new#%7B%22kind%22%3A%20%22InsightVizNode%22%2C%20%22source%22%3A%20%7B%22kind%22%3A%20%22FunnelsQuery%22%2C%20%22series%22%3A%20%5B%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22event%22%3A%20%22user_registered%22%2C%20%22custom_name%22%3A%20%22Register%22%7D%2C%20%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22event%22%3A%20%22user_logged_in%22%2C%20%22custom_name%22%3A%20%22First%20Login%22%7D%2C%20%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22event%22%3A%20%22post_created%22%2C%20%22custom_name%22%3A%20%22Create%20First%20Post%22%7D%5D%2C%20%22dateRange%22%3A%20%7B%22date_from%22%3A%20%22-30d%22%7D%2C%20%22funnelsFilter%22%3A%20%7B%22funnelWindowInterval%22%3A%2014%2C%20%22funnelWindowIntervalUnit%22%3A%20%22day%22%7D%7D%7D)** — Conversion funnel from registration to first post

- 📈 **[Insight 2 — Daily Active Users](https://us.posthog.com/project/2/insights/new#%7B%22kind%22%3A%20%22InsightVizNode%22%2C%20%22source%22%3A%20%7B%22kind%22%3A%20%22TrendsQuery%22%2C%20%22series%22%3A%20%5B%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22math%22%3A%20%22dau%22%2C%20%22event%22%3A%20%22user_logged_in%22%2C%20%22custom_name%22%3A%20%22DAU%22%7D%5D%2C%20%22interval%22%3A%20%22day%22%2C%20%22dateRange%22%3A%20%7B%22date_from%22%3A%20%22-30d%22%7D%2C%20%22trendsFilter%22%3A%20%7B%22display%22%3A%20%22ActionsLineGraph%22%7D%2C%20%22version%22%3A%202%7D%7D)** — DAU based on login events over last 30 days

- 🤝 **[Insight 3 — Social Engagement](https://us.posthog.com/project/2/insights/new#%7B%22kind%22%3A%20%22InsightVizNode%22%2C%20%22source%22%3A%20%7B%22kind%22%3A%20%22TrendsQuery%22%2C%20%22series%22%3A%20%5B%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22math%22%3A%20%22total%22%2C%20%22event%22%3A%20%22post_created%22%2C%20%22custom_name%22%3A%20%22Posts%22%7D%2C%20%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22math%22%3A%20%22total%22%2C%20%22event%22%3A%20%22user_followed%22%2C%20%22custom_name%22%3A%20%22Follows%22%7D%2C%20%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22math%22%3A%20%22total%22%2C%20%22event%22%3A%20%22message_sent%22%2C%20%22custom_name%22%3A%20%22Messages%22%7D%5D%2C%20%22interval%22%3A%20%22week%22%2C%20%22dateRange%22%3A%20%7B%22date_from%22%3A%20%22-30d%22%7D%2C%20%22trendsFilter%22%3A%20%7B%22display%22%3A%20%22ActionsLineGraph%22%7D%2C%20%22version%22%3A%202%7D%7D)** — Weekly volume of posts, follows, and messages

- 📉 **[Insight 4 — Acquisition vs Churn Signals](https://us.posthog.com/project/2/insights/new#%7B%22kind%22%3A%20%22InsightVizNode%22%2C%20%22source%22%3A%20%7B%22kind%22%3A%20%22TrendsQuery%22%2C%20%22series%22%3A%20%5B%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22math%22%3A%20%22total%22%2C%20%22event%22%3A%20%22user_registered%22%2C%20%22custom_name%22%3A%20%22New%20Users%22%7D%2C%20%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22math%22%3A%20%22total%22%2C%20%22event%22%3A%20%22user_logged_out%22%2C%20%22custom_name%22%3A%20%22Logouts%22%7D%5D%2C%20%22interval%22%3A%20%22week%22%2C%20%22dateRange%22%3A%20%7B%22date_from%22%3A%20%22-60d%22%7D%2C%20%22trendsFilter%22%3A%20%7B%22display%22%3A%20%22ActionsBarValue%22%7D%2C%20%22version%22%3A%202%7D%7D)** — Weekly new signups vs logouts

- 🔌 **[Insight 5 — API Usage Trend](https://us.posthog.com/project/2/insights/new#%7B%22kind%22%3A%20%22InsightVizNode%22%2C%20%22source%22%3A%20%7B%22kind%22%3A%20%22TrendsQuery%22%2C%20%22series%22%3A%20%5B%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22math%22%3A%20%22total%22%2C%20%22event%22%3A%20%22api_token_granted%22%2C%20%22custom_name%22%3A%20%22Token%20Grants%22%7D%2C%20%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22math%22%3A%20%22total%22%2C%20%22event%22%3A%20%22api_token_revoked%22%2C%20%22custom_name%22%3A%20%22Token%20Revokes%22%7D%2C%20%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22math%22%3A%20%22total%22%2C%20%22event%22%3A%20%22api_user_created%22%2C%20%22custom_name%22%3A%20%22API%20Signups%22%7D%5D%2C%20%22interval%22%3A%20%22week%22%2C%20%22dateRange%22%3A%20%7B%22date_from%22%3A%20%22-30d%22%7D%2C%20%22trendsFilter%22%3A%20%7B%22display%22%3A%20%22ActionsLineGraph%22%7D%2C%20%22version%22%3A%202%7D%7D)** — Weekly API token activity and API-based signups

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
