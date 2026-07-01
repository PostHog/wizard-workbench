<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Vue 3 movies application. PostHog is initialized in `src/main.js` with the project token and host sourced from environment variables, and a global Vue error handler sends uncaught exceptions to PostHog via `captureException`. User identification is handled in `src/composables/useAuth.ts`: on login, `posthog.identify()` links the session to the username and a `user_logged_in` event is captured; on logout, `posthog.capture('user_logged_out')` fires before `posthog.reset()` clears the session. Custom events are captured across four additional files to cover key user journeys: viewing media detail pages, playing trailers, performing searches (with result counts), and clicking media cards.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | A user successfully authenticated and was redirected to the home page. | `src/composables/useAuth.ts` |
| `user_logged_out` | A user clicked the logout button in the navigation bar. | `src/composables/useAuth.ts` |
| `media_detail_viewed` | A user opened the detail page for a movie or TV show. | `src/views/MediaDetailView.vue` |
| `trailer_played` | A user clicked the Watch Trailer button on a media detail page. | `src/views/MediaDetailView.vue` |
| `search_performed` | A user submitted a search query for movies or TV shows. | `src/views/SearchView.vue` |
| `media_card_clicked` | A user clicked on a media card to navigate to its detail page. | `src/components/media/MediaCard.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1787551)
- [Daily logins](https://us.posthog.com/project/483112/insights/1F8FFNqO)
- [Searches performed](https://us.posthog.com/project/483112/insights/jVLyopg2)
- [Media detail views](https://us.posthog.com/project/483112/insights/3O7wdnPh)
- [Trailers played](https://us.posthog.com/project/483112/insights/iYvUze9g)
- [Search to detail funnel](https://us.posthog.com/project/483112/insights/ACkiFnGY)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
