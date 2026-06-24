<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media application. PostHog is initialized via the `Posthog()` class constructor in `create_app()` and stored on the app object, so every blueprint can access it via `current_app.posthog_client`. Fifteen server-side events are captured across authentication, content creation, social engagement, messaging, and the REST API. Users are identified on login and signup using their database ID as the stable `distinct_id`, with person properties set via `tag()`. The 500 error handler automatically captures exceptions with `capture_exception()`. The PostHog client is registered with `atexit` to flush all queued events on shutdown.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user completes registration and creates an account. | `app/auth/routes.py` |
| `user_logged_in` | A user successfully logs in with their credentials. | `app/auth/routes.py` |
| `user_logged_out` | A user logs out of their session. | `app/auth/routes.py` |
| `password_reset_requested` | A user requests a password reset email. | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully resets their password via the reset token. | `app/auth/routes.py` |
| `post_created` | A user publishes a new post to their feed. | `app/main/routes.py` |
| `user_followed` | A user follows another user on the platform. | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user on the platform. | `app/main/routes.py` |
| `message_sent` | A user sends a private message to another user. | `app/main/routes.py` |
| `profile_updated` | A user saves changes to their profile information. | `app/main/routes.py` |
| `posts_export_started` | A user initiates a background export of their posts. | `app/main/routes.py` |
| `post_translated` | A user requests translation of a post to another language. | `app/main/routes.py` |
| `api_user_created` | A new user account is created via the REST API. | `app/api/users.py` |
| `api_token_generated` | A user generates a new API authentication token. | `app/api/tokens.py` |
| `api_token_revoked` | A user revokes their API authentication token. | `app/api/tokens.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- [New User Signups](https://us.posthog.com/project/483112/insights/g0D03yqU)
- [Login to Post Conversion](https://us.posthog.com/project/483112/insights/dCx84DRN)
- [Social Engagement](https://us.posthog.com/project/483112/insights/griBbfiD)
- [Daily Active Posts](https://us.posthog.com/project/483112/insights/lMJQYRa9)
- [User Retention Signal](https://us.posthog.com/project/483112/insights/Y0a6QX7f)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login and signup; returning sessions that skip the login form will be captured under anonymous distinct IDs until they log in again.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
