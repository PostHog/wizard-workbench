<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. The following changes were made:

- **`app/config.py`**: Added three PostHog settings fields (`posthog_project_token`, `posthog_host`, `posthog_disabled`) loaded from environment variables.
- **`app/main.py`**: Initialized PostHog (`posthog.api_key`, `posthog.host`, `posthog.debug`) in the lifespan startup handler, flushed events on shutdown, and registered the `PostHogMiddleware`.
- **`app/middleware.py`**: Added `PostHogMiddleware` — a pure ASGI middleware that wraps each HTTP request in a `new_context()` and, for authenticated users, calls `identify_context(user_id)` so all route-level `capture()` calls are automatically attributed to the correct user.
- **`app/routers/auth.py`**: Captures `user signed up` on successful registration and `user logged in` on successful authentication.
- **`app/routers/generate.py`**: Captures `content generated` after successful AI content generation (with generation type, credits used/remaining, and prompt length), and `generation failed` when a user lacks sufficient credits.
- **`app/routers/api_keys.py`**: Captures `api key created` and `api key revoked` events.
- **`app/routers/settings.py`**: Captures `settings updated` when a user changes their email, and `password changed` when a user changes their password.
- **`.env`**: Set `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` environment variables.
- **`requirements.txt`**: Added `posthog>=3.0.0`.

| Event | Description | File |
|---|---|---|
| `user signed up` | Fired when a new user completes registration via the signup form | `app/routers/auth.py` |
| `user logged in` | Fired when an existing user successfully logs in | `app/routers/auth.py` |
| `content generated` | Fired when a user successfully generates AI content (blog, email, or social) | `app/routers/generate.py` |
| `generation failed` | Fired when a content generation attempt fails due to insufficient credits | `app/routers/generate.py` |
| `api key created` | Fired when a user creates a new API key | `app/routers/api_keys.py` |
| `api key revoked` | Fired when a user deactivates/revokes an API key | `app/routers/api_keys.py` |
| `settings updated` | Fired when a user successfully updates their account settings | `app/routers/settings.py` |
| `password changed` | Fired when a user successfully changes their password | `app/routers/settings.py` |

## Next steps

To visualize the events we just instrumented, create an **"Analytics basics"** dashboard at:

- **PostHog Dashboards**: https://us.posthog.com/project/2/dashboards

Suggested insights to add to your dashboard:

1. **Signup → Login conversion funnel** — Funnel from `user signed up` → `user logged in` to track how many new users return and log in again.
2. **Content generation volume** — Trend of `content generated` over time, broken down by `generation_type` (blog / email / social) to see which content types are most popular.
3. **Generation failure rate** — Compare counts of `content generated` vs `generation failed` to track credit exhaustion and potential churn risk.
4. **API key adoption** — Count of `api key created` events over time, indicating developer/API adoption.
5. **Account settings engagement** — Combined count of `settings updated` and `password changed` events, showing active account management.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
