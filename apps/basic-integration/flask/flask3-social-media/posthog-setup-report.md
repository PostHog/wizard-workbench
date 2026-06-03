<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media application (Microblog). PostHog is initialised once in `app/__init__.py` using the `Posthog()` class constructor with `enable_exception_autocapture=True`, and flushed cleanly on exit via `atexit`. Fourteen events covering the full user lifecycle — registration, login/logout, password resets, post creation, social interactions, direct messaging, profile management, post export, and API-level user/token operations — are captured across five route files. Server-side 500 errors are captured automatically via `capture_exception()` in the error handler.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User completes web registration form | `app/auth/routes.py` |
| `user_logged_in` | User logs in with username and password | `app/auth/routes.py` |
| `user_logged_out` | User logs out | `app/auth/routes.py` |
| `password_reset_requested` | User requests a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | User resets their password via token | `app/auth/routes.py` |
| `post_created` | User publishes a new post (includes `language` property) | `app/main/routes.py` |
| `user_followed` | User follows another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollows another user | `app/main/routes.py` |
| `message_sent` | User sends a direct message | `app/main/routes.py` |
| `profile_updated` | User saves profile changes (`has_about_me` property) | `app/main/routes.py` |
| `posts_exported` | User triggers the background post export task | `app/main/routes.py` |
| `api_token_created` | User obtains an API token via the REST API | `app/api/tokens.py` |
| `api_token_revoked` | User revokes their API token | `app/api/tokens.py` |
| `api_user_created` | New user created via the REST API (`signup_method: api`) | `app/api/users.py` |

## Next steps

The PostHog API key used during setup does not have `dashboard:write` or `query:read` scopes, so the dashboard could not be created automatically. You can create an **"Analytics basics"** dashboard manually in PostHog with the following recommended insights:

1. **Signup → Login conversion funnel** — Funnel insight with steps `user_signed_up` → `user_logged_in`
2. **New posts over time** — Trends insight on `post_created`, broken down by `language`
3. **Social engagement** — Trends insight showing `user_followed`, `user_unfollowed`, and `message_sent` on the same chart
4. **Password reset funnel** — Funnel insight with steps `password_reset_requested` → `password_reset_completed`
5. **API adoption** — Trends insight on `api_user_created` and `api_token_created`

Go to [Dashboards](/dashboard) to create these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
