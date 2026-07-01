# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media application (Microblog). PostHog is initialized in `create_app()` using module-level configuration loaded from environment variables, with an `atexit` shutdown hook to ensure all queued events are flushed on process exit. Fourteen events covering the full user journey — from registration through content creation, social interactions, messaging, and API usage — were instrumented across five files. User identity is established at login and signup via `identify_context` with a non-PII distinct ID (`str(user.id)`), and person properties (username) are tagged for profile enrichment. Exception tracking was added to the 500 error handler via `posthog.capture_exception`.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully completes registration. | `app/auth/routes.py` |
| `user_logged_in` | Fired when an existing user successfully logs in. | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out of their session. | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user submits a password reset request. | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password. | `app/auth/routes.py` |
| `post_created` | Fired when a user publishes a new post to their feed. | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user. | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user. | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a private message to another user. | `app/main/routes.py` |
| `profile_edited` | Fired when a user saves changes to their profile. | `app/main/routes.py` |
| `search_performed` | Fired when a user executes a search query. | `app/main/routes.py` |
| `posts_export_started` | Fired when a user initiates a posts data export. | `app/main/routes.py` |
| `api_user_created` | Fired when a new user account is created via the REST API. | `app/api/users.py` |
| `api_token_created` | Fired when a user generates a new API authentication token. | `app/api/tokens.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1787335)
- [Sign-up to Login Funnel](https://us.posthog.com/project/483112/insights/iyXE3PLH)
- [Daily Active Posts](https://us.posthog.com/project/483112/insights/NsoIwDKd)
- [Social Engagement](https://us.posthog.com/project/483112/insights/bagjyZMs)
- [Messaging Activity](https://us.posthog.com/project/483112/insights/92oyogDS)
- [Authentication Events](https://us.posthog.com/project/483112/insights/UOGRo2mX)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
