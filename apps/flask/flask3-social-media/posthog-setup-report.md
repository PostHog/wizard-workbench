<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Microblog Flask social media application. PostHog's Python SDK has been installed and initialized globally in `create_app()`, with 14 events instrumented across 5 files covering the full user lifecycle — from registration and login through to social interactions, content creation, and API usage. All events use `new_context()` / `identify_context()` / `capture()` to properly link server-side events to user identities. PII is passed via `tag()` (person properties), never in `capture()` event properties.

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user successfully completes registration | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully logs in | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user requests a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password | `app/auth/routes.py` |
| `post_created` | Fired when a user submits a new post | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a private message | `app/main/routes.py` |
| `profile_updated` | Fired when a user saves changes to their profile | `app/main/routes.py` |
| `post_export_started` | Fired when a user initiates a post data export | `app/main/routes.py` |
| `search_performed` | Fired when a user executes a search query | `app/main/routes.py` |
| `api_user_created` | Fired when a new user is created via the REST API | `app/api/users.py` |
| `api_token_revoked` | Fired when an API token is revoked | `app/api/tokens.py` |

## Next steps

We've configured the PostHog SDK and are ready to track events. To visualize your analytics, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **New User Registrations** — Trend chart of `user_registered` events (tracks user acquisition)
2. **Registration → First Post Funnel** — Funnel: `user_registered` → `post_created` (tracks activation)
3. **Daily Active Users** — Trend chart of `user_logged_in` events (tracks retention)
4. **Social Engagement** — Trend chart of `user_followed` + `message_sent` events (tracks engagement)
5. **Churn Signal** — Trend chart of `user_logged_out` events not followed by future `user_logged_in` (tracks churn)

Visit your PostHog project to create this dashboard: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
