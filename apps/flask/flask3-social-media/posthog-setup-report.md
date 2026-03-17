<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask microblog social media application. The Python PostHog SDK (`posthog`) has been installed and initialized using the instance-based `Posthog()` constructor in the application factory (`app/__init__.py`). PostHog is configured via environment variables stored in `.env`. Events are captured across authentication, social interactions, content creation, and API endpoints. User identity is established at login and registration using `posthog_client.set()` to persist person properties.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user completes registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully authenticates with username and password | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user explicitly logs out | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user submits a password reset request email | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password via token link | `app/auth/routes.py` |
| `post_created` | Fired when a user submits a new post on the home feed | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user | `app/main/routes.py` |
| `profile_edited` | Fired when a user saves changes to their profile | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a direct message to another user | `app/main/routes.py` |
| `posts_export_started` | Fired when a user initiates the background post export task | `app/main/routes.py` |
| `api_user_created` | Fired when a new user is created via the REST API | `app/api/users.py` |

## Next steps

We've set up all the events needed to build powerful insights in PostHog. Create a new **"Analytics basics"** dashboard at [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) and add these recommended insights:

1. **Registration Funnel** — Funnel insight: `user_signed_up` → `user_logged_in`. Tracks how many new registrations convert to an active login.

2. **New User Signups (Trend)** — Trends insight with `user_signed_up` and `api_user_created` events. Shows user acquisition over time across both web and API sign-up paths.

3. **Content & Engagement (Trend)** — Trends insight with `post_created`, `message_sent`, and `user_followed`. Tracks active usage and social engagement.

4. **Social Engagement: Follow vs Unfollow (Trend)** — Trends insight comparing `user_followed` vs `user_unfollowed` over time. A rising unfollow rate is a churn signal.

5. **Authentication Activity (Trend)** — Trends insight with `user_logged_in`, `user_logged_out`, and `password_reset_requested`. Monitors healthy session behavior and potential issues.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
