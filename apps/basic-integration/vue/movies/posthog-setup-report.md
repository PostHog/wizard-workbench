<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies app. PostHog is now initialized in `src/main.js` using environment variables, with a global Vue error handler that forwards uncaught exceptions to PostHog. Users are identified by username on login and the PostHog session is reset on logout. Five custom events are captured across four files, covering the core engagement and content-discovery funnel.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in; includes username for identification | `src/views/LoginView.vue` |
| `user_logged_out` | User clicks the logout button; PostHog session is reset | `src/components/NavBar.vue` |
| `media_viewed` | User opens a movie or TV show detail page (top of content funnel) | `src/views/MediaDetailView.vue` |
| `trailer_played` | User clicks Watch Trailer on a media detail page | `src/views/MediaDetailView.vue` |
| `search_performed` | User submits a search query; includes query text and result count | `src/views/SearchView.vue` |

## Next steps

To monitor user behavior, head to your [PostHog project](https://us.posthog.com/project/2) and create an **"Analytics basics"** dashboard with these suggested insights:

- **Logins over time** — Trends chart for `user_logged_in`
- **Search activity** — Trends chart for `search_performed` broken down by result count
- **Most viewed media** — Trends chart for `media_viewed` broken down by `media_title`
- **Trailer engagement** — Trends chart for `trailer_played` broken down by `media_type`
- **Login → Media view funnel** — Funnel from `user_logged_in` → `media_viewed` → `trailer_played`

You can create these directly at [/insights/new](https://us.posthog.com/project/2/insights/new).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
