<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. The following changes were made:

- **`requirements.txt`** — Added `posthog>=3.0.0` dependency.
- **`app/config.py`** — Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` settings backed by environment variables.
- **`app/posthog.py`** *(new)* — Initializes a `Posthog()` client instance with `enable_exception_autocapture=True` and registers `shutdown` via `atexit` to flush events on process exit.
- **`app/middleware.py`** — Added `PostHogMiddleware` (pure ASGI) that wraps each HTTP request in a PostHog context, automatically identifying authenticated users by their database ID so all route-level captures are attributed correctly.
- **`app/main.py`** — Registered `PostHogMiddleware` and calls `posthog_client.flush()` in the app lifespan shutdown to drain any queued events.
- **`app/routers/auth.py`** — Captures `user_signed_up` (with `signup_method`, `initial_credits`), `user_logged_in` (with `login_method`), and `user_logged_out` events.
- **`app/routers/generate.py`** — Captures `content_generated` (with `generation_type`, `credits_used`, `credits_remaining`, `prompt_length`) and `insufficient_credits` (with `generation_type`, `credits_needed`, `credits_available`) — the core business and churn signals.
- **`app/routers/api_keys.py`** — Captures `api_key_created` (with `active_key_count`) and `api_key_revoked`.
- **`app/routers/settings.py`** — Captures `settings_updated` (with `field_changed`) and `password_changed`.
- **`app/routers/pages.py`** — Captures `dashboard_viewed` (with `total_generations`, `credits_remaining`).

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user creates an account via the signup form | `app/routers/auth.py` |
| `user_logged_in` | User authenticates via the login form | `app/routers/auth.py` |
| `user_logged_out` | User ends their session | `app/routers/auth.py` |
| `content_generated` | User successfully generates AI content (blog/email/social) | `app/routers/generate.py` |
| `insufficient_credits` | Generation attempt fails due to insufficient credits — churn signal | `app/routers/generate.py` |
| `api_key_created` | User creates a new API key — indicates developer/integration intent | `app/routers/api_keys.py` |
| `api_key_revoked` | User deactivates an API key | `app/routers/api_keys.py` |
| `settings_updated` | User successfully updates their account email | `app/routers/settings.py` |
| `password_changed` | User successfully changes their password | `app/routers/settings.py` |
| `dashboard_viewed` | Logged-in user views the dashboard — top of generation funnel | `app/routers/pages.py` |

## Next steps

To get the most out of these events, create an **"Analytics basics"** dashboard in PostHog with these five key insights:

1. **Signup → First generation funnel** — Funnel: `user_signed_up` → `dashboard_viewed` → `content_generated`. Shows your top-of-funnel conversion rate.
2. **Content generation trend** — Trends: `content_generated` broken down by `generation_type` (blog, email, social). See which content type is most popular.
3. **Insufficient credits (churn signal)** — Trends: `insufficient_credits` over time. Spikes indicate users hitting credit walls — a prompt to upsell or increase credits.
4. **API key adoption** — Trends: `api_key_created` over time. Tracks how many users are integrating programmatically.
5. **Daily active users** — Trends: `dashboard_viewed` with unique users. Tracks engaged daily active users.

Create this dashboard at: [/dashboard](/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
