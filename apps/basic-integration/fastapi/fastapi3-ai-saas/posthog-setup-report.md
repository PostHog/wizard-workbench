<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. PostHog is now initialized in the app lifespan, a middleware wraps every HTTP request in a PostHog context that automatically identifies authenticated users, and 10 business-critical events are captured across authentication, AI content generation, API key management, user settings, and the main dashboard.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | A new user completes registration | `app/routers/auth.py` |
| `user_logged_in` | An existing user successfully logs in | `app/routers/auth.py` |
| `user_logged_out` | A user logs out of their session | `app/routers/auth.py` |
| `content_generated` | A user successfully generates AI content (blog, email, or social) | `app/routers/generate.py` |
| `insufficient_credits` | A generation attempt is blocked due to insufficient credits — a churn signal | `app/routers/generate.py` |
| `api_key_created` | A user creates a new API key for programmatic access | `app/routers/api_keys.py` |
| `api_key_revoked` | A user revokes an existing API key | `app/routers/api_keys.py` |
| `settings_updated` | A user successfully updates their account settings (e.g., email) | `app/routers/settings.py` |
| `password_changed` | A user successfully changes their password | `app/routers/settings.py` |
| `dashboard_viewed` | A user views the main dashboard — top of the retention funnel | `app/routers/pages.py` |

## Next steps

We've set up the event tracking. To create the "Analytics basics (wizard)" dashboard with insights for these events, visit PostHog and build the following recommended insights:

1. **Signup → Login → Content Generated funnel** — tracks conversion from registration to first AI generation
2. **`content_generated` trend by `generation_type`** — shows which content type (blog/email/social) is most popular over time
3. **`insufficient_credits` trend** — an early churn signal: users blocked from generating
4. **`user_signed_up` trend** — new user acquisition over time
5. **`api_key_created` trend** — indicates power-user adoption (programmatic API usage)

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
