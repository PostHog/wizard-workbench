<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Vue 3 movies application. PostHog is initialized in `src/main.js` with the project token and host pulled from environment variables, and a global Vue error handler forwards uncaught exceptions to PostHog error tracking. Users are identified by username on login and the PostHog session is reset on logout. Five key user actions are instrumented across four files: login, logout, media detail views, trailer plays, and search queries.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in, along with a `posthog.identify()` call. | `src/views/LoginView.vue` |
| `user_logged_out` | Fired when a user clicks the logout button, followed by `posthog.reset()`. | `src/components/NavBar.vue` |
| `media_viewed` | Fired when a user views a movie or TV show detail page, capturing the media id, title, and type. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user clicks the 'Watch Trailer' button on a media detail page. | `src/views/MediaDetailView.vue` |
| `media_searched` | Fired when a user submits a search query, capturing the search term and result count. | `src/views/SearchView.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1761406)
  - Total logins over time
  - Login → media view conversion funnel
  - Search volume over time
  - Trailer engagement over time
  - Media views broken down by media type

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
