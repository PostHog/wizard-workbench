<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the Vue 3 Movies app with PostHog analytics. PostHog (`posthog-js`) is initialized in `src/main.js` before the app mounts, with a global `app.config.errorHandler` that forwards uncaught Vue errors to PostHog. Users are identified on login in `src/views/LoginView.vue` and re-identified on page load in `src/App.vue` (for returning visitors already in `localStorage`). PostHog state is reset on logout in `src/components/NavBar.vue`. Five custom events are captured across the app to track key user actions.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully authenticates and begins a session. | src/views/LoginView.vue |
| `user_logged_out` | Fired when a user ends their session by clicking the logout button. | src/components/NavBar.vue |
| `media_detail_viewed` | Fired when a user opens the detail page for a movie or TV show. | src/views/MediaDetailView.vue |
| `trailer_played` | Fired when a user clicks the Watch Trailer button to play a trailer. | src/views/MediaDetailView.vue |
| `search_performed` | Fired when a user submits a search query for movies or TV shows. | src/views/SearchView.vue |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1897672)
- [User logins over time](https://us.i.posthog.com/project/483112/insights/6RgEPyBl)
- [Login to media detail funnel](https://us.i.posthog.com/project/483112/insights/IV0ecELS)
- [Media views by type](https://us.i.posthog.com/project/483112/insights/F2oXSiJV)
- [Searches over time](https://us.i.posthog.com/project/483112/insights/4MH6Kk0s)
- [Trailer plays over time](https://us.i.posthog.com/project/483112/insights/AGdfJ2wK)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
