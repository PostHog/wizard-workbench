# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies app. PostHog is initialized in `src/main.js` with the project token and host loaded from environment variables, and a global Vue error handler forwards uncaught exceptions via `posthog.captureException`. User identification is wired into the login flow, and `posthog.reset()` is called on logout to cleanly unlink future sessions.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in. | `src/views/LoginView.vue` |
| `user_logged_out` | Fired when a user logs out via the navigation bar. | `src/components/NavBar.vue` |
| `media_searched` | Fired when a user submits a search query for movies or TV shows. | `src/views/SearchView.vue` |
| `media_detail_viewed` | Fired when a user views a movie or TV show detail page. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user clicks to play a media trailer. | `src/views/MediaDetailView.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1853146)
- [Login to trailer funnel (wizard)](https://us.i.posthog.com/project/483112/insights/10141067)
- [Daily logins (wizard)](https://us.i.posthog.com/project/483112/insights/10141074)
- [Searches performed (wizard)](https://us.i.posthog.com/project/483112/insights/10141078)
- [Trailers played (wizard)](https://us.i.posthog.com/project/483112/insights/10141080)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`VITE_POSTHOG_PROJECT_TOKEN`, `VITE_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
