<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask microblog application. PostHog is initialized as an instance-based `Posthog()` client in `create_app()` using environment variables, with `enable_exception_autocapture=True` and `atexit`-registered shutdown for reliable event flushing. Twelve custom events are captured across authentication, social, and content flows. Users are identified at login, registration, and API user creation using `posthog_client.set()` to set person properties.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully registers an account. | `app/auth/routes.py` |
| `user_logged_in` | A user successfully logs in with their credentials. | `app/auth/routes.py` |
| `user_logged_out` | A user logs out of their session. | `app/auth/routes.py` |
| `password_reset_requested` | A user submits a password reset request. | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully resets their password. | `app/auth/routes.py` |
| `post_created` | A user creates and publishes a new post. | `app/main/routes.py` |
| `user_followed` | A user follows another user. | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user. | `app/main/routes.py` |
| `message_sent` | A user sends a private message to another user. | `app/main/routes.py` |
| `profile_edited` | A user saves changes to their profile. | `app/main/routes.py` |
| `posts_export_started` | A user initiates a background task to export their posts. | `app/main/routes.py` |
| `api_user_created` | A new user account is created via the REST API. | `app/api/users.py` |

## Next steps

To build insights and a dashboard in PostHog, navigate to your PostHog project and create a dashboard named **"Analytics basics (wizard)"** with the following suggested insights:

- **Signup funnel** — Funnel: `user_signed_up` → `user_logged_in` → `post_created`
- **Retention / churn signal** — Trend: `user_followed` vs `user_unfollowed` over time
- **Content engagement** — Trend: `post_created` and `message_sent` counts per day
- **Password reset conversion** — Funnel: `password_reset_requested` → `password_reset_completed`
- **User growth** — Trend: unique users for `user_signed_up` over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` (or your team's bootstrap script) so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
