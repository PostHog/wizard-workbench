# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Vue 3 movies app, instrumenting key user interactions including login, media viewing, trailer playback, and search functionality. PostHog is initialized in `src/main.js` with the `posthog-js` SDK, global error tracking via Vue's `errorHandler`, and user identification on login.

| Event Name | Description | File |
|------------|-------------|------|
| `user_logged_in` | Fired when a user successfully logs in | `src/views/LoginView.vue` |
| `user_logged_out` | Fired when a user logs out via the navigation bar | `src/components/NavBar.vue` |
| `media_viewed` | Fired when a user opens the detail page for a movie or TV show | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user clicks to play the trailer for a media item | `src/views/MediaDetailView.vue` |
| `search_performed` | Fired when a user submits a search query | `src/views/SearchView.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/2/dashboard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
