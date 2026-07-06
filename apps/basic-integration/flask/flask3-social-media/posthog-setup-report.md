# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask 3 social media (Microblog) application. The PostHog Python SDK (`posthog>=7.22.0`) was installed and initialized as a `Posthog()` instance in `create_app()`, with automatic exception capture enabled and a clean `atexit` shutdown handler. Environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) were added to `.env` and wired through `config.py`. Fourteen events now cover all major user actions across the authentication flow, content creation, social interactions, messaging, search, and the REST API. Users are identified on login and registration via `posthog_client.set()` to keep person properties current.

| Event Name | Description | File |
|---|---|---|
| `user_registered` | A new user successfully completes the registration form and creates an account. | `app/auth/routes.py` |
| `user_logged_in` | A user successfully authenticates and logs in to the application. | `app/auth/routes.py` |
| `user_logged_out` | A user logs out of the application. | `app/auth/routes.py` |
| `password_reset_requested` | A user requests a password reset email. | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully resets their password using a reset token. | `app/auth/routes.py` |
| `post_created` | A user submits a new post to the feed. | `app/main/routes.py` |
| `user_followed` | A user follows another user on the platform. | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user on the platform. | `app/main/routes.py` |
| `profile_updated` | A user saves changes to their profile (username or about me). | `app/main/routes.py` |
| `message_sent` | A user sends a direct message to another user. | `app/main/routes.py` |
| `post_search_performed` | A user performs a search query across posts. | `app/main/routes.py` |
| `posts_export_started` | A user initiates an async export of their posts. | `app/main/routes.py` |
| `api_token_created` | A user creates an API authentication token via the REST API. | `app/api/tokens.py` |
| `api_user_created` | A new user is created via the REST API endpoint. | `app/api/users.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1807610)
- [New User Registrations (wizard)](https://us.posthog.com/project/483112/insights/yX7CqHBy)
- [Daily Active Users - Logins (wizard)](https://us.posthog.com/project/483112/insights/7OiU2IUe)
- [Content Creation Activity (wizard)](https://us.posthog.com/project/483112/insights/0zrR4SQN)
- [User Activation Funnel (wizard)](https://us.posthog.com/project/483112/insights/YYDP5eml)
- [Social Engagement - Follows & Unfollows (wizard)](https://us.posthog.com/project/483112/insights/dGlF4CVH)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `set()` on subsequent logins — the current implementation sets person properties on every login, which is correct, but verify this holds if you add social auth (OAuth) login paths in the future.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
