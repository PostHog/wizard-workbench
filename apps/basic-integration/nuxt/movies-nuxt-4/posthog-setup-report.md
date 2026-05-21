<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies application. The `@posthog/nuxt` module was installed and configured with automatic client-side error tracking (`capture_exceptions: true`) and server-side exception autocapture (`enableExceptionAutocapture: true`). Session and distinct ID tracing headers are automatically forwarded to all API requests. A singleton server-side PostHog client was created at `server/utils/posthog.ts` for use in Nitro API routes. Seven events were instrumented across both client and server code, with user identification on login and identity reset on logout.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired on the client when a user successfully logs in. Calls `posthog.identify()` with the username. | `pages/login.vue` |
| `user_logged_out` | Fired on the client when the logout button is clicked. Calls `posthog.reset()` to clear the identity. | `components/NavBar.vue` |
| `search_performed` | Fired when the user executes a debounced search. Includes `query` property. | `pages/search.vue` |
| `media_viewed` | Fired on mount when a user lands on a movie or TV show detail page. Includes `media_id`, `media_type`, `title`, and `rating`. Top of the content conversion funnel. | `pages/[type]/[id].vue` |
| `video_played` | Fired when a user clicks play on a video/trailer card. Includes `video_name` and `video_type`. | `components/video/Card.vue` |
| `language_changed` | Fired when a user switches the app language. Includes `locale` and `previous_locale`. | `components/LanguageSwitcher.vue` |
| `server_login` | Server-side event fired from the login API route. Correlates with client session via `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers. | `server/api/auth/login.post.ts` |

## Next steps

We've prepared suggested insights for a dashboard to keep an eye on user behavior. Visit these links in PostHog to build them:

- [New "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboards/new) — create the dashboard, then add the insights below
- [Login Funnel: user_logged_in → media_viewed → video_played](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjoiRlVOTkVMUyIsImV2ZW50cyI6W3siaWQiOiJ1c2VyX2xvZ2dlZF9pbiIsIm5hbWUiOiJ1c2VyX2xvZ2dlZF9pbiIsInR5cGUiOiJldmVudHMifSx7ImlkIjoibWVkaWFfdmlld2VkIiwibmFtZSI6Im1lZGlhX3ZpZXdlZCIsInR5cGUiOiJldmVudHMifSx7ImlkIjoidmlkZW9fcGxheWVkIiwibmFtZSI6InZpZGVvX3BsYXllZCIsInR5cGUiOiJldmVudHMifV19)
- [Daily Logins trend](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjoiVFJFTkRTIiwiZXZlbnRzIjpbeyJpZCI6InVzZXJfbG9nZ2VkX2luIiwibmFtZSI6InVzZXJfbG9nZ2VkX2luIiwidHlwZSI6ImV2ZW50cyJ9XX0=)
- [Search Activity trend](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjoiVFJFTkRTIiwiZXZlbnRzIjpbeyJpZCI6InNlYXJjaF9wZXJmb3JtZWQiLCJuYW1lIjoic2VhcmNoX3BlcmZvcm1lZCIsInR5cGUiOiJldmVudHMifV19)
- [Media Views trend](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjoiVFJFTkRTIiwiZXZlbnRzIjpbeyJpZCI6Im1lZGlhX3ZpZXdlZCIsIm5hbWUiOiJtZWRpYV92aWV3ZWQiLCJ0eXBlIjoiZXZlbnRzIn1dfQ==)
- [User Logouts (churn signal)](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjoiVFJFTkRTIiwiZXZlbnRzIjpbeyJpZCI6InVzZXJfbG9nZ2VkX291dCIsIm5hbWUiOiJ1c2VyX2xvZ2dlZF9vdXQiLCJ0eXBlIjoiZXZlbnRzIn1dfQ==)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
