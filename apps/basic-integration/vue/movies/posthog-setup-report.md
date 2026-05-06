<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Vue Movies application.

## Summary of changes

- **`src/main.js`** — PostHog is initialized using `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` environment variables. A global Vue `errorHandler` sends all uncaught Vue errors to PostHog via `captureException`.
- **`src/views/LoginView.vue`** — On successful login, `posthog.identify()` ties the username to the PostHog session, and `posthog.capture('user_logged_in')` records the event. Login errors are sent to PostHog via `captureException`.
- **`src/components/NavBar.vue`** — `posthog.reset()` is called on logout to clear the PostHog session and distinct ID, ensuring subsequent sessions start fresh.
- **`src/views/SearchView.vue`** — `posthog.capture('search_submitted', { query })` fires when the user submits a search. Search errors are captured via `captureException`.
- **`src/views/MediaDetailView.vue`** — `posthog.capture('media_viewed', { media_id, media_title, media_type })` fires when a movie or TV show loads successfully. `posthog.capture('trailer_played', { media_id, media_title, media_type })` fires when the user clicks Watch Trailer. Load errors are captured via `captureException`.
- **`.env`** — `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` set with the correct project values.

## Events

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in. Also identifies the user with PostHog. | `src/views/LoginView.vue` |
| `search_submitted` | Fired when a user submits a search query. Includes `query` property. | `src/views/SearchView.vue` |
| `media_viewed` | Fired when a movie or TV show detail page loads successfully. Includes `media_id`, `media_title`, `media_type`. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user clicks Watch Trailer. Includes `media_id`, `media_title`, `media_type`. | `src/views/MediaDetailView.vue` |

## Next steps

Build an "Analytics basics" dashboard in PostHog with the following insights:

- **Login trend** — [Trends: `user_logged_in` over time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_logged_in","name":"user_logged_in","type":"events","order":0}]})
- **Login → Media viewed funnel** — [Funnel: `user_logged_in` → `media_viewed`](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_logged_in","name":"user_logged_in","type":"events","order":0},{"id":"media_viewed","name":"media_viewed","type":"events","order":1}]})
- **Search trend** — [Trends: `search_submitted` over time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"search_submitted","name":"search_submitted","type":"events","order":0}]})
- **Media viewed trend** — [Trends: `media_viewed` over time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"media_viewed","name":"media_viewed","type":"events","order":0}]})
- **Trailer plays trend** — [Trends: `trailer_played` over time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"trailer_played","name":"trailer_played","type":"events","order":0}]})

You can create the dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
