<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Flask microblog application. The `posthog` Python SDK was installed and the `Posthog` client is initialized in `create_app()` using environment variables for the project token and host. Fourteen events covering authentication, social activity, content creation, search, and API usage are now captured. User identification is established at login and registration using `str(user.id)` as the stable distinct ID and `username` as a person property. Exception autocapture is enabled, and 500-level errors are manually captured via the error handler. The client is registered with `atexit` to ensure all queued events are flushed on shutdown.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully completes registration. | `app/auth/routes.py` |
| `user_logged_in` | A user successfully authenticates and logs in. | `app/auth/routes.py` |
| `user_logged_out` | A user logs out of their session. | `app/auth/routes.py` |
| `password_reset_requested` | A user requests a password reset email. | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully resets their password via the reset link. | `app/auth/routes.py` |
| `post_created` | A user submits a new post to the feed. | `app/main/routes.py` |
| `user_followed` | A user follows another user on the platform. | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user on the platform. | `app/main/routes.py` |
| `message_sent` | A user sends a private message to another user. | `app/main/routes.py` |
| `post_search_performed` | A user performs a search query for posts. | `app/main/routes.py` |
| `profile_edited` | A user saves changes to their profile. | `app/main/routes.py` |
| `posts_export_started` | A user starts an export of all their posts. | `app/main/routes.py` |
| `api_user_created` | A new user account is created via the REST API. | `app/api/users.py` |
| `api_token_revoked` | A user revokes their API authentication token. | `app/api/tokens.py` |

## Next steps

Create a dashboard in PostHog to monitor key user behaviour. Suggested insights to add:

- **Signups over time** — trend of `user_signed_up`
- **Daily active logins** — unique users triggering `user_logged_in`
- **Content creation funnel** — `user_signed_up` → `post_created` → `user_followed`
- **Social engagement** — trend of `user_followed` and `message_sent`
- **Password reset conversion** — `password_reset_requested` → `password_reset_completed` funnel

Visit [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) to create a new dashboard and add these insights.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current integration identifies on fresh login and signup, but a returning user who arrives mid-session via a bookmark will be on an anonymous distinct ID until their next login.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
