# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies app. PostHog is now initialised at app startup (`src/main.js`) with your project API key and host read from environment variables. A global Vue error handler forwards all uncaught exceptions to PostHog's error tracking. Users are identified by username immediately after login, and the session is reset on logout. Seven custom events have been instrumented across five files to track the most valuable user actions: authentication, content discovery, and engagement.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired on successful login; also calls `posthog.identify()` | `src/composables/useAuth.ts` |
| `user_logged_out` | Fired on logout; also calls `posthog.reset()` | `src/composables/useAuth.ts` |
| `login_failed` | Fired when login throws an error, with the error message | `src/views/LoginView.vue` |
| `search_performed` | Fired after a search completes, with query and result count | `src/views/SearchView.vue` |
| `media_detail_viewed` | Fired when a movie/TV detail page loads successfully, with id, type, title, genres | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user opens the trailer modal, with media id, type, and title | `src/views/MediaDetailView.vue` |
| `media_card_clicked` | Fired when a user clicks a media card, with media id, type, and title | `src/components/media/MediaCard.vue` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with the following insights to monitor user behaviour:

- [Login trend](https://us.i.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_logged_in"}]}) — track `user_logged_in` over time
- [Search activity](https://us.i.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"search_performed"}]}) — track `search_performed` over time
- [Content discovery funnel](https://us.i.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"search_performed","order":0},{"id":"media_card_clicked","order":1},{"id":"media_detail_viewed","order":2}]}) — funnel: `search_performed` → `media_card_clicked` → `media_detail_viewed`
- [Trailer engagement](https://us.i.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"trailer_played"}]}) — track `trailer_played` over time
- [Login failures](https://us.i.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"login_failed"}]}) — monitor `login_failed` to catch auth issues early

Visit your [PostHog project dashboard](https://us.i.posthog.com/project/2/dashboard) to get started.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
