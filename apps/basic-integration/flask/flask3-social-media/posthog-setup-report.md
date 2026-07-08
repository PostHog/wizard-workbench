# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Microblog Flask social media application. The `posthog` Python SDK (v7.22.0) was installed and a `Posthog()` client instance is initialized in `create_app()` using environment variables, then stored on `app.posthog_client` for access across all blueprints. An `atexit` hook flushes pending events on shutdown. Fourteen server-side events are captured across authentication, social interactions, content creation, messaging, and API endpoints. User identification is performed at every capture point using the user's integer database ID as `distinct_id`, with the username set as a person property via `tag()`. Exception tracking is wired into the 500 error handler via `capture_exception()`.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully registers an account. | `app/auth/routes.py` |
| `user_logged_in` | A user successfully logs into their account. | `app/auth/routes.py` |
| `user_logged_out` | A user logs out of their account. | `app/auth/routes.py` |
| `password_reset_requested` | A user requests a password reset email. | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully resets their password via the reset link. | `app/auth/routes.py` |
| `post_created` | A user publishes a new post to their feed. | `app/main/routes.py` |
| `user_followed` | A user follows another user on the platform. | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user on the platform. | `app/main/routes.py` |
| `profile_updated` | A user saves changes to their profile. | `app/main/routes.py` |
| `message_sent` | A user sends a private message to another user. | `app/main/routes.py` |
| `posts_export_started` | A user initiates a background export of all their posts. | `app/main/routes.py` |
| `post_search_performed` | A user performs a full-text search for posts. | `app/main/routes.py` |
| `api_user_created` | A new user account is created via the REST API. | `app/api/users.py` |
| `api_token_revoked` | A user revokes their API authentication token. | `app/api/tokens.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1816769)
- [User signups over time (wizard)](https://us.posthog.com/project/483112/insights/4tXRlY1H)
- [Registration to first post funnel (wizard)](https://us.posthog.com/project/483112/insights/kgBVxP3z)
- [Social engagement: follows & unfollows (wizard)](https://us.posthog.com/project/483112/insights/qnaL7s3U)
- [Content creation: posts & messages (wizard)](https://us.posthog.com/project/483112/insights/4ISXPzgA)
- [User churn signals: logouts & password resets (wizard)](https://us.posthog.com/project/483112/insights/V1ddWqF3)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
