<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. A shared `posthog_client` (instance-based `Posthog()` constructor with `enable_exception_autocapture=True`) was initialized in a new `app/analytics.py` module and imported across all relevant routers. The `lifespan` context manager in `app/main.py` flushes the client on shutdown. Environment variables `POSTHOG_KEY` and `POSTHOG_HOST` were added to `.env`. The `posthog>=3.0.0` package was added to `requirements.txt`. User identification is captured on login and signup via `new_context()` + `identify_context()` so backend events are linked to the correct user profile.

| Event | Description | File |
|-------|-------------|------|
| `user signed up` | Fired when a new user completes registration via the signup form | `app/routers/auth.py` |
| `user logged in` | Fired when a user successfully authenticates via the login form | `app/routers/auth.py` |
| `user logged out` | Fired when a user logs out of their session | `app/routers/auth.py` |
| `content generated` | Fired when AI content is successfully generated; includes generation type and credits used | `app/routers/generate.py` |
| `generation failed` | Fired when content generation fails due to insufficient credits | `app/routers/generate.py` |
| `api key created` | Fired when a user creates a new API key | `app/routers/api_keys.py` |
| `api key revoked` | Fired when a user revokes (deactivates) an API key | `app/routers/api_keys.py` |
| `settings updated` | Fired when a user updates their account settings (e.g. email) | `app/routers/settings.py` |
| `password changed` | Fired when a user successfully changes their password | `app/routers/settings.py` |

## Next steps

We've set up event tracking across your key user flows. Head to your PostHog project to build insights and dashboards based on these events:

- [PostHog Project Dashboards](https://us.posthog.com/project/238460/dashboard)
- [Create a new Insight](https://us.posthog.com/project/238460/insights/new)

Suggested insights to build:

1. **Signup → Content Generated funnel** — `user signed up` → `content generated` to track activation rate
2. **Daily signups trend** — `user signed up` over time to track acquisition
3. **Generation type breakdown** — `content generated` grouped by `generation_type` property
4. **Credit exhaustion rate** — `generation failed` (reason: insufficient_credits) vs `content generated`
5. **API key adoption** — `api key created` to measure developer engagement

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
