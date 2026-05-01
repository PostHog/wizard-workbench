<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. PostHog is now initialized in the app lifespan with module-level configuration (`posthog.api_key` / `posthog.host`) and flushed cleanly on shutdown. Nine events are tracked across five files covering the full user lifecycle — from signup through content generation and account management.

**Files modified:**

- `app/config.py` — Added `posthog_api_key` and `posthog_host` settings fields
- `app/main.py` — PostHog initialized in the lifespan context manager; `posthog.flush()` called on shutdown
- `app/routers/auth.py` — User identification (`posthog.set`) and signup/login/logout event capture
- `app/routers/generate.py` — Content generation and credit exhaustion event capture
- `app/routers/api_keys.py` — API key creation and revocation event capture
- `app/routers/settings.py` — Profile update and password change event capture
- `requirements.txt` — Added `posthog>=3.0.0`

**Environment variables set in `.env`:**

- `POSTHOG_API_KEY` — PostHog project token
- `POSTHOG_HOST` — PostHog ingest host

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully completes registration | `app/routers/auth.py` |
| `user_logged_in` | Fired when a user successfully authenticates and logs in | `app/routers/auth.py` |
| `user_logged_out` | Fired when a user logs out of the application | `app/routers/auth.py` |
| `content_generated` | Fired when AI content is successfully generated, including type and credits used | `app/routers/generate.py` |
| `generation_failed_insufficient_credits` | Fired when a generation request fails because the user lacks sufficient credits | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user revokes (deactivates) an API key | `app/routers/api_keys.py` |
| `profile_updated` | Fired when a user successfully updates their email/profile settings | `app/routers/settings.py` |
| `password_changed` | Fired when a user successfully changes their password | `app/routers/settings.py` |

## Next steps

We've prepared insights for an "Analytics basics" dashboard. Use these links to open each insight in PostHog, then save them to a new dashboard:

- [Signup trend (last 30 days)](https://app.posthog.com/project/2/insights/new#q=%7B%22kind%22%3A%20%22InsightVizNode%22%2C%20%22source%22%3A%20%7B%22kind%22%3A%20%22TrendsQuery%22%2C%20%22series%22%3A%20%5B%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22event%22%3A%20%22user_signed_up%22%2C%20%22name%22%3A%20%22user_signed_up%22%2C%20%22math%22%3A%20%22total%22%7D%5D%2C%20%22dateRange%22%3A%20%7B%22date_from%22%3A%20%22-30d%22%7D%2C%20%22interval%22%3A%20%22day%22%2C%20%22trendsFilter%22%3A%20%7B%22display%22%3A%20%22ActionsLineGraph%22%7D%7D%7D) — Daily new user registrations
- [Content generation volume](https://app.posthog.com/project/2/insights/new#q=%7B%22kind%22%3A%20%22InsightVizNode%22%2C%20%22source%22%3A%20%7B%22kind%22%3A%20%22TrendsQuery%22%2C%20%22series%22%3A%20%5B%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22event%22%3A%20%22content_generated%22%2C%20%22name%22%3A%20%22content_generated%22%2C%20%22math%22%3A%20%22total%22%7D%5D%2C%20%22dateRange%22%3A%20%7B%22date_from%22%3A%20%22-30d%22%7D%2C%20%22interval%22%3A%20%22day%22%2C%20%22trendsFilter%22%3A%20%7B%22display%22%3A%20%22ActionsLineGraph%22%7D%7D%7D) — Daily AI content generation requests
- [Signup → first generation funnel](https://app.posthog.com/project/2/insights/new) — Create a Funnels insight with steps: `user_signed_up` → `content_generated`
- [Credit exhaustion rate](https://app.posthog.com/project/2/insights/new) — Create a Trends insight for `generation_failed_insufficient_credits` to find users hitting credit walls
- [Active users (login trend)](https://app.posthog.com/project/2/insights/new) — Create a Trends insight for `user_logged_in` with Unique users math to track DAU

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
