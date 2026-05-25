<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this FastAPI AI SaaS application. The integration uses the instance-based `Posthog()` constructor (not module-level config), a pure ASGI middleware that wraps each request in a PostHog context and auto-identifies authenticated users, and targeted `capture()` calls across all key user flows. Every event is correlated to a user identity via `identify_context()`, enabling full cross-session analytics. Exception autocapture is enabled globally so any unhandled errors are automatically tracked in PostHog Error Tracking.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user successfully created an account via the signup form | `app/routers/auth.py` |
| `user_logged_in` | User successfully authenticated and started a session | `app/routers/auth.py` |
| `login_failed` | Login attempt failed due to invalid credentials | `app/routers/auth.py` |
| `user_logged_out` | User ended their session by logging out | `app/routers/auth.py` |
| `dashboard_viewed` | User viewed their dashboard — top of the engagement funnel | `app/routers/pages.py` |
| `content_generated` | User successfully generated AI content (blog, email, or social), consuming credits | `app/routers/generate.py` |
| `generation_failed` | Content generation failed because the user had insufficient credits | `app/routers/generate.py` |
| `api_key_created` | User created a new API key for programmatic access | `app/routers/api_keys.py` |
| `api_key_revoked` | User deactivated one of their API keys | `app/routers/api_keys.py` |
| `settings_updated` | User successfully updated their account settings (email address) | `app/routers/settings.py` |
| `password_changed` | User successfully changed their account password | `app/routers/settings.py` |

## Next steps

Build an **Analytics basics** dashboard in PostHog with these five insights to track the most business-critical metrics:

1. **[Signups over time](/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22user_signed_up%22%7D%5D)** — trend of `user_signed_up` to monitor growth.
2. **[Login health](/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22user_logged_in%22%7D%2C%7B%22id%22%3A%22login_failed%22%7D%5D)** — `user_logged_in` vs `login_failed` side-by-side to detect auth issues.
3. **[Content generation by type](/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22content_generated%22%7D%5D&breakdown=%24properties%5Bgeneration_type%5D)** — `content_generated` broken down by `generation_type` (blog / email / social) to see product usage mix.
4. **[Signup to generation funnel](/insights/new?insight=FUNNELS&events=%5B%7B%22id%22%3A%22user_signed_up%22%7D%2C%7B%22id%22%3A%22dashboard_viewed%22%7D%2C%7B%22id%22%3A%22content_generated%22%7D%5D)** — funnel from `user_signed_up` → `dashboard_viewed` → `content_generated` to measure activation.
5. **[Credit exhaustion](/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22generation_failed%22%7D%5D&breakdown=%24properties%5Bfailure_reason%5D)** — `generation_failed` trend to track how often users hit the credit wall (a leading churn signal).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
