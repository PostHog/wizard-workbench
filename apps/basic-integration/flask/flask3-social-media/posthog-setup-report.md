# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media application (Microblog). The `posthog` Python SDK is initialized via the `Posthog()` class constructor inside `create_app()` with `enable_exception_autocapture=True`, stored on the Flask `app` object, and accessed throughout blueprints via Flask's `current_app`. A graceful shutdown is registered with `atexit`. Fourteen events covering the full user lifecycle — authentication, content creation, social interactions, and API usage — are captured with non-PII properties. The 500 error handler now forwards unhandled exceptions to PostHog for error tracking.

| Event | Description | File |
|---|---|---|
| `user_registered` | A new user completes the registration form and creates an account. | `app/auth/routes.py` |
| `user_logged_in` | An existing user successfully authenticates with their username and password. | `app/auth/routes.py` |
| `user_logged_out` | An authenticated user logs out of their session. | `app/auth/routes.py` |
| `password_reset_requested` | A user submits a request to reset their password via email. | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully resets their password using a valid reset token. | `app/auth/routes.py` |
| `post_created` | A user publishes a new post on the home feed. | `app/main/routes.py` |
| `user_followed` | A user follows another user to subscribe to their posts. | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user, removing them from their feed. | `app/main/routes.py` |
| `message_sent` | A user sends a private direct message to another user. | `app/main/routes.py` |
| `profile_updated` | A user saves changes to their username or bio on their profile. | `app/main/routes.py` |
| `posts_exported` | A user triggers a background job to export all of their posts. | `app/main/routes.py` |
| `api_user_created` | A new user account is created via the REST API. | `app/api/users.py` |
| `api_token_generated` | An authenticated user requests an API bearer token via the REST API. | `app/api/tokens.py` |
| `api_token_revoked` | An authenticated user revokes their current API bearer token. | `app/api/tokens.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1829212)
- [New user registrations](https://us.posthog.com/project/483112/insights/9rVAhDEC) — Daily bar chart of `user_registered` events.
- [Signup to first post funnel](https://us.posthog.com/project/483112/insights/H38RyMMo) — Conversion funnel from `user_registered` → `post_created` within 14 days.
- [Content and social engagement](https://us.posthog.com/project/483112/insights/JA25Js9t) — Multi-series line chart of `post_created`, `message_sent`, and `user_followed`.
- [Daily active users](https://us.posthog.com/project/483112/insights/Vy7oCqZK) — Unique users per day based on `user_logged_in` events.
- [Post language breakdown](https://us.posthog.com/project/483112/insights/PAeLzali) — `post_created` broken down by detected language.

Dashboard subscription and alerts were skipped — the interactive consent prompt could not be shown in this run. You can set these up manually from the dashboard in PostHog.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` (or any bootstrap scripts) so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `set()` to keep person properties up to date — the current implementation identifies on login and registration but not on subsequent sessions where the user is remembered by Flask-Login.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
