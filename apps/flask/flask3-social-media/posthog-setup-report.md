<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask microblog application. PostHog is now initialized as an instance-based client in the app factory (`create_app()`), with the API key and host read from environment variables. Events are captured across authentication, social features, messaging, and API endpoints, giving full visibility into the user lifecycle and key engagement actions.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in (includes `login_method`, `remember_me`) | `app/auth/routes.py` |
| `user_registered` | New user registers via the web form (includes `signup_method`) | `app/auth/routes.py` |
| `user_logged_out` | User logs out of their session | `app/auth/routes.py` |
| `password_reset_requested` | User requests a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | User successfully resets their password via token | `app/auth/routes.py` |
| `post_created` | User publishes a new post (includes `post_language`, `post_length`) | `app/main/routes.py` |
| `user_followed` | User follows another user (includes `followed_username`) | `app/main/routes.py` |
| `user_unfollowed` | User unfollows another user (includes `unfollowed_username`) | `app/main/routes.py` |
| `message_sent` | User sends a private message (includes `message_length`) | `app/main/routes.py` |
| `posts_export_started` | User initiates a background export of their posts | `app/main/routes.py` |
| `api_user_created` | New user created via REST API (includes `signup_method: api`) | `app/api/users.py` |
| `api_token_created` | User obtains an API authentication token | `app/api/tokens.py` |
| `api_token_revoked` | User revokes their API authentication token | `app/api/tokens.py` |

## Files modified

- `config.py` — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` config vars
- `requirements.txt` — Added `posthog` dependency
- `.env` — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables
- `app/__init__.py` — Initialized `posthog_client` (instance-based `Posthog()`) in `create_app()`, registered `atexit` shutdown
- `app/auth/routes.py` — Added login, register, logout, password reset events + person property setting on login/register
- `app/main/routes.py` — Added post, follow, unfollow, message, export events
- `app/api/tokens.py` — Added API token created/revoked events
- `app/api/users.py` — Added API user created event + person property setting

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **User registrations over time** — Trend of `user_registered` events
2. **Daily active users** — Unique users with any `user_logged_in` event per day
3. **Registration → first post funnel** — Funnel: `user_registered` → `post_created`
4. **Social engagement** — Trend of `user_followed` + `message_sent` events
5. **API adoption** — Trend of `api_user_created` + `api_token_created`

Create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
