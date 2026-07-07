<wizard-report>
# PostHog post-wizard report

The wizard has completed a PostHog integration for the Vue Movies app. `posthog-js` is initialized in `src/main.js` with environment-variable-driven config and a global Vue error handler. Five custom events were instrumented across the app's key user flows: login/logout, media detail views, trailer plays, and search.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in to the app. | `src/views/LoginView.vue` |
| `user_logged_out` | Fired when a user clicks the logout button. | `src/components/NavBar.vue` |
| `media_detail_viewed` | Fired when a user views the detail page for a movie or TV show. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user clicks 'Watch Trailer' to open the trailer modal. | `src/views/MediaDetailView.vue` |
| `search_performed` | Fired when a user submits a search query. | `src/views/SearchView.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1813134)
- [Daily logins (wizard)](https://us.posthog.com/project/483112/insights/Ck2OEgBe)
- [Search volume (wizard)](https://us.posthog.com/project/483112/insights/sodKjykK)
- [Media views by type (wizard)](https://us.posthog.com/project/483112/insights/KUUv1g6r)
- [Trailer engagement (wizard)](https://us.posthog.com/project/483112/insights/ETArSBUD)
- [Login to media view funnel (wizard)](https://us.posthog.com/project/483112/insights/6sucN4kJ)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
