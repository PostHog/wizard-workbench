<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Vue 3 + Vite movies application. PostHog is now initialized in `src/main.js` with your project token and host pulled from environment variables. A global Vue error handler forwards all uncaught errors to PostHog's exception tracking. Users are identified by username on login and the PostHog session is reset on logout. Five custom events are instrumented across the app covering authentication, content discovery, and engagement.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired after a successful login. Also calls `posthog.identify()` to associate the session with the username. | `src/composables/useAuth.ts` |
| `user_logged_out` | Fired before logout. Also calls `posthog.reset()` to clear the PostHog session. | `src/composables/useAuth.ts` |
| `search_performed` | Fired when a search query completes. Includes `query` and `result_count` properties. | `src/views/SearchView.vue` |
| `media_detail_viewed` | Fired when a movie or TV show detail page loads successfully. Includes `media_id`, `media_type`, and `media_title`. Top of the engagement funnel. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when the user opens the trailer modal. Includes `media_id`, `media_type`, and `media_title`. Key engagement signal. | `src/views/MediaDetailView.vue` |

## Files changed

- `src/main.js` — PostHog init, `api_host`, `defaults`, and global `errorHandler`
- `src/composables/useAuth.ts` — `identify` + `user_logged_in` on login; `user_logged_out` + `reset` on logout
- `src/views/SearchView.vue` — `search_performed` after results load
- `src/views/MediaDetailView.vue` — `media_detail_viewed` on media load; `trailer_played` on trailer open
- `.env` — `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` added

## Next steps

To visualise user behaviour based on the events now instrumented, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Login trend** — Trends chart for `user_logged_in` over time (daily/weekly active users)
2. **Logout / churn** — Trends chart for `user_logged_out` over time
3. **Search activity** — Trends chart for `search_performed`, broken down by result count
4. **Engagement funnel** — Funnel: `media_detail_viewed` → `trailer_played` (measures how many users who view a detail page go on to watch the trailer)
5. **Most-viewed content** — Trends chart for `media_detail_viewed` broken down by `media_title`

You can create all of these at: https://us.i.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
