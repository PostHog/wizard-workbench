<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Microblog Flask social media application. The PostHog Python SDK is initialized once in `create_app()` using the instance-based `Posthog()` constructor, with `enable_exception_autocapture=True` for automatic error tracking and `atexit.register` to flush all events on shutdown. Environment variables are used for all credentials. Fourteen server-side events are captured across four files, covering the full user lifecycle from sign-up through social engagement and API usage.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully completes registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully authenticates via the login form | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user explicitly logs out | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user submits a password reset request email | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password via the token link | `app/auth/routes.py` |
| `post_created` | Fired when a user successfully publishes a new post | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user | `app/main/routes.py` |
| `message_sent` | Fired when a user successfully sends a direct message to another user | `app/main/routes.py` |
| `profile_edited` | Fired when a user saves changes to their profile | `app/main/routes.py` |
| `search_performed` | Fired when a user performs a post search | `app/main/routes.py` |
| `post_translated` | Fired when a user triggers a post translation | `app/main/routes.py` |
| `posts_export_started` | Fired when a user launches the background task to export their posts | `app/main/routes.py` |
| `api_token_created` | Fired when a user obtains an API token via the REST API | `app/api/tokens.py` |

## Next steps

To create an "Analytics basics" dashboard in PostHog, visit [/dashboards](/dashboards) and add the following recommended insights:

- **Registration funnel** — Funnel from `user_signed_up` → `user_logged_in` → `post_created` to measure new-user activation
- **Daily active posts** — Trends for `post_created` over time to track content engagement
- **Social engagement** — Trends comparing `user_followed` and `message_sent` to monitor community growth
- **Password recovery funnel** — Funnel from `password_reset_requested` → `password_reset_completed` to find friction in account recovery
- **Feature adoption** — Trends for `search_performed`, `post_translated`, and `posts_export_started` to see which features are used

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
