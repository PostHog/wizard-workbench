<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies application. PostHog is initialised once in `src/main.js` using environment variables for the project token and host. A global Vue `errorHandler` is wired up to forward uncaught errors to PostHog via `captureException`. User identification is performed on login in `src/views/LoginView.vue` using `posthog.identify()`, and the PostHog session is reset on logout in `src/components/NavBar.vue` using `posthog.reset()`. Custom events are captured across key user flows: login success and failure, logout, search queries and empty-result searches, media detail page views, trailer opens and closes, and media load errors.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in with a username and password. | `src/views/LoginView.vue` |
| `user_logged_out` | User clicks the logout button in the navigation bar. | `src/components/NavBar.vue` |
| `search_performed` | User submits a search query for movies or TV shows. | `src/views/SearchView.vue` |
| `search_no_results` | A search query returns no matching results. | `src/views/SearchView.vue` |
| `media_viewed` | User views the detail page of a movie or TV show. | `src/views/MediaDetailView.vue` |
| `trailer_played` | User clicks the Watch Trailer button to open the trailer modal. | `src/views/MediaDetailView.vue` |
| `trailer_closed` | User closes the trailer modal. | `src/views/MediaDetailView.vue` |
| `media_load_error` | An error occurs while loading movie or TV show details. | `src/views/MediaDetailView.vue` |
| `hero_trailer_played` | User clicks the Watch Trailer button on the hero banner. | `src/components/media/MediaHero.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.i.posthog.com/project/483112/dashboard/1775207)
  - Login funnel (`user_logged_in` → `media_viewed`)
  - Search performance (`search_performed` vs `search_no_results`)
  - Trailer engagement (`trailer_played` + `hero_trailer_played`)
  - Media views by type (`media_viewed` by `media_type` property)
  - User churn signal (`user_logged_out` over time)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
