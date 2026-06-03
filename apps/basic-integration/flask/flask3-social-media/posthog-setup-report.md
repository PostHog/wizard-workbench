<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Flask social media (microblog) application. The `posthog` Python SDK was installed and configured via environment variables. PostHog is initialized in `create_app()` using the module-level API (`posthog.api_key` / `posthog.host`), guarded by a `POSTHOG_DISABLED` flag for easy opt-out. Thirteen events are now captured across four files covering the full user lifecycle — registration, login/logout, content creation, social interactions, messaging, and API-based account creation. Users are identified on login, registration, and API signup using `identify_context(user.username)` with email and username set as person properties via `tag()`.

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | A new user completes registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | A user successfully logs in with username and password | `app/auth/routes.py` |
| `user_logged_out` | A user logs out of the application | `app/auth/routes.py` |
| `password_reset_requested` | A user submits a password reset request | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully resets their password | `app/auth/routes.py` |
| `post_created` | A user submits a new post to their feed | `app/main/routes.py` |
| `explore_viewed` | A user views the explore page (top of discovery funnel) | `app/main/routes.py` |
| `user_followed` | A user follows another user | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user | `app/main/routes.py` |
| `message_sent` | A user sends a private message to another user | `app/main/routes.py` |
| `profile_updated` | A user saves changes to their profile | `app/main/routes.py` |
| `post_export_started` | A user requests an export of their posts | `app/main/routes.py` |
| `api_user_created` | A new user account is created via the REST API | `app/api/users.py` |

## Next steps

We've designed the following insights for an **"Analytics basics"** dashboard to track user behavior. Create these in [PostHog Insights](/insights):

1. **User Registrations over time** — Trends chart for `user_registered` to monitor growth.
2. **Daily Active Posting** — Trends chart for `post_created` to track content engagement.
3. **User Activation Funnel** — Funnel from `user_registered` → `user_logged_in` → `post_created` to measure how many new users become active contributors.
4. **Social Engagement** — Trends chart comparing `user_followed` and `message_sent` side by side to track network growth.
5. **Explore-to-Follow Conversion Funnel** — Funnel from `explore_viewed` → `user_followed` to measure content discovery effectiveness.

[Go to PostHog Dashboards](/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
