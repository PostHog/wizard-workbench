<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. The integration covers the full user lifecycle — from signup and login through content generation, API key management, settings changes, and dashboard engagement. PostHog is initialized via the FastAPI lifespan context manager using environment variables, and a custom ASGI middleware automatically wraps every request in a PostHog context, identifying authenticated users for seamless event correlation.

## Changes made

| File | Change |
|------|--------|
| `requirements.txt` | Added `posthog>=3.0.0` dependency |
| `app/config.py` | Added `posthog_api_key`, `posthog_host`, `posthog_disabled` Pydantic Settings fields |
| `app/middleware.py` | Created `PostHogMiddleware` — pure ASGI middleware that wraps requests in `new_context()` and calls `identify_context()` + `tag()` for authenticated users |
| `app/main.py` | Added PostHog initialization in lifespan startup (`posthog.api_key`, `posthog.host`, `posthog.debug`), `posthog.flush()` on shutdown, and `app.add_middleware(PostHogMiddleware)` |
| `app/routers/auth.py` | Added `user_signed_up` (with identify + email tag), `user_logged_in` (with identify), and `user_logged_out` events |
| `app/routers/generate.py` | Added `content_generated` (core conversion event with type, credits used/remaining) and `credits_insufficient` (churn-risk event with credits needed vs available) |
| `app/routers/api_keys.py` | Added `api_key_created` (power-user signal with key name and count) and `api_key_revoked` events |
| `app/routers/settings.py` | Added `settings_updated` (email change) and `password_changed` events |
| `app/routers/pages.py` | Added `dashboard_viewed` event with total generations, credits remaining, and API key count properties |
| `.env` | Added `POSTHOG_API_KEY`, `POSTHOG_HOST`, `POSTHOG_DISABLED` environment variables |

## Events instrumented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | Fired when a new user completes the signup form and an account is created. | `app/routers/auth.py` |
| `user_logged_in` | Fired when a user successfully authenticates via the login form. | `app/routers/auth.py` |
| `user_logged_out` | Fired when a user logs out of the application. | `app/routers/auth.py` |
| `content_generated` | Fired when a user successfully generates AI content (blog, email, social). Core conversion event. | `app/routers/generate.py` |
| `credits_insufficient` | Fired when a generation attempt fails due to insufficient credits. Key churn-risk signal. | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key, indicating power-user intent. | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user revokes/deactivates an API key. | `app/routers/api_keys.py` |
| `settings_updated` | Fired when a user updates their account settings (email change). | `app/routers/settings.py` |
| `password_changed` | Fired when a user successfully changes their password. | `app/routers/settings.py` |
| `dashboard_viewed` | Fired when an authenticated user views the main dashboard. Top-of-funnel for feature engagement. | `app/routers/pages.py` |

## Next steps

We've defined insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Create these in PostHog at [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards):

### Suggested Dashboard: "Analytics basics"

**1. Signup → First Generation Conversion Funnel**
- Funnel: `user_signed_up` → `content_generated`
- Shows what % of new signups generate their first piece of content

**2. Content Generation Trend by Type**
- Trend: `content_generated` broken down by `generation_type` property
- Shows adoption of blog, email, and social generation over time

**3. Credits Insufficient Rate (Churn Risk)**
- Trend: `credits_insufficient` vs `content_generated`
- High ratio indicates users hitting credit limits — upgrade/churn risk

**4. API Key Adoption (Power Users)**
- Trend: `api_key_created` unique users over time
- Tracks growth of programmatic/power users

**5. User Retention (Login Activity)**
- Retention: users who perform `user_logged_in` returning week-over-week
- Core engagement and retention metric

### PostHog Links
- [PostHog Dashboards](https://us.posthog.com/project/2/dashboards)
- [Create new insight](https://us.posthog.com/project/2/insights/new)
- [View events](https://us.posthog.com/project/2/events)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
