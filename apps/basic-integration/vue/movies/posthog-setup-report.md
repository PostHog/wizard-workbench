<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Vue Movies app. PostHog is initialised in `src/main.js` using environment variables, with a global Vue error handler attached to forward uncaught exceptions. User identity is established on login via `posthog.identify()` and cleared on logout via `posthog.reset()`. Six custom events are now tracked across four components covering the full user journey from authentication through content discovery and engagement.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in to the app. | `src/composables/useAuth.ts` |
| `user_logged_out` | User logs out and their session is cleared. | `src/composables/useAuth.ts` |
| `search_performed` | User submits a search query for movies or TV shows. | `src/views/SearchView.vue` |
| `media_detail_viewed` | User views the detail page for a movie or TV show, the top of the engagement funnel. | `src/views/MediaDetailView.vue` |
| `trailer_played` | User clicks to play the trailer for a movie or TV show. | `src/views/MediaDetailView.vue` |
| `media_card_clicked` | User clicks on a media card in a carousel or search results list. | `src/components/media/MediaCard.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793574)
- [Daily Logins](https://us.posthog.com/project/483112/insights/9yAZWZlU)
- [Searches Performed](https://us.posthog.com/project/483112/insights/NQSSpLbk)
- [Media Detail Views](https://us.posthog.com/project/483112/insights/P8o8xaJP)
- [Media Card Clicks](https://us.posthog.com/project/483112/insights/Zpp3CGNB)
- [Engagement Funnel: Login → Media Viewed → Trailer Played](https://us.posthog.com/project/483112/insights/KbfGyY0a)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
