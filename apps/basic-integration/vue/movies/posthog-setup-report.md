<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies app. `posthog-js` was installed and initialized in `src/main.js` with environment-variable-backed config and a global Vue error handler. User identification is performed on login via `posthog.identify()`, and `posthog.reset()` is called on logout to unlink future events from the current session. Seven custom events are captured across four key files, covering authentication, media engagement, search, and trailer interactions.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticates and logs into the app. | `src/views/LoginView.vue` |
| `user_logged_out` | User clicks the logout button and ends their session. | `src/components/NavBar.vue` |
| `media_viewed` | User opens a movie or TV show detail page. | `src/views/MediaDetailView.vue` |
| `trailer_played` | User clicks the Watch Trailer button to open the trailer modal. | `src/views/MediaDetailView.vue` |
| `search_performed` | User submits a search query for movies or TV shows. | `src/views/SearchView.vue` |
| `search_result_clicked` | User clicks on a search result card to view its detail. | `src/views/SearchView.vue` |
| `recommendation_clicked` | User clicks on a recommended media card from the detail page. | `src/views/MediaDetailView.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1824659)
- [Logins over time (wizard)](https://us.posthog.com/project/483112/insights/du9YEF7e)
- [Media views by type (wizard)](https://us.posthog.com/project/483112/insights/aEvyRRyN)
- [Search → Media view funnel (wizard)](https://us.posthog.com/project/483112/insights/cHZBXS9r)
- [Trailer play rate (wizard)](https://us.posthog.com/project/483112/insights/Y5etA5kT)
- [Searches performed over time (wizard)](https://us.posthog.com/project/483112/insights/lxEnC8ZQ)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
