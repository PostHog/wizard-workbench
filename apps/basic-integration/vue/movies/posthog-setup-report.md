# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies app. Here is a summary of every change made:

- **`src/main.js`** — Imported `posthog-js` and called `posthog.init()` with `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` before `app.mount()`. A dev-mode warning is emitted when the token is missing. A global `app.config.errorHandler` was added to forward uncaught Vue errors to `posthog.captureException()`.
- **`src/views/LoginView.vue`** — On successful login, `posthog.identify()` is called with the username and `user_logged_in` is captured. On failure, `login_failed` is captured with the error reason.
- **`src/components/NavBar.vue`** — On logout, `user_logged_out` is captured and `posthog.reset()` is called before clearing local auth state.
- **`src/views/SearchView.vue`** — After every successful search, `media_searched` is captured with the result count. If the result set is empty, `search_no_results` is also captured.
- **`src/views/MediaDetailView.vue`** — After the real media data loads from the API, `media_detail_viewed` is captured with `media_id`, `media_type`, and `media_title`. When the user clicks "Watch Trailer", `trailer_played` is captured with the same properties.
- **`.env`** — `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` were written and covered by `.gitignore`.

## Events

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully signs into the app. | `src/views/LoginView.vue` |
| `login_failed` | User login attempt fails due to missing credentials. | `src/views/LoginView.vue` |
| `user_logged_out` | User signs out of the app via the navbar. | `src/components/NavBar.vue` |
| `media_searched` | User submits a search query for movies or TV shows. | `src/views/SearchView.vue` |
| `search_no_results` | A search query returns no results. | `src/views/SearchView.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page — top of the engagement funnel. | `src/views/MediaDetailView.vue` |
| `trailer_played` | User clicks to watch the trailer for a movie or TV show. | `src/views/MediaDetailView.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1902721)
- [Engagement funnel (wizard)](https://us.posthog.com/project/483112/insights/Zcs0hn71)
- [Logins over time (wizard)](https://us.posthog.com/project/483112/insights/2cqWCFSe)
- [Searches over time (wizard)](https://us.posthog.com/project/483112/insights/CoLIyRVg)
- [Media views by type (wizard)](https://us.posthog.com/project/483112/insights/e0u0l7C8)
- [Trailer plays over time (wizard)](https://us.posthog.com/project/483112/insights/6o5rs9FU)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
