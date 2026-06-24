<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Vue 3 movies application. PostHog is initialized in `src/main.js` with a global Vue error handler to capture unhandled exceptions. Users are identified by username on login and their session is reset on logout. Ten custom events are captured across the app, covering authentication, content discovery, search, and trailer engagement.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully logs in to the app. | `src/views/LoginView.vue` |
| `user_signed_out` | User logs out and their session is cleared. | `src/components/NavBar.vue` |
| `media_detail_viewed` | User opens the detail page for a movie or TV show. | `src/views/MediaDetailView.vue` |
| `trailer_played` | User clicks to play the trailer on a media detail page. | `src/views/MediaDetailView.vue` |
| `hero_trailer_played` | User clicks to play the trailer from the hero banner component. | `src/components/media/MediaHero.vue` |
| `media_card_clicked` | User clicks a media card to navigate to a movie or TV show. | `src/components/media/MediaCard.vue` |
| `search_performed` | User submits a search query for movies or TV shows. | `src/views/SearchView.vue` |
| `search_result_clicked` | User clicks on a search result to view its detail page. | `src/views/SearchView.vue` |
| `home_hero_clicked` | User clicks the featured hero item on the home page. | `src/views/HomeView.vue` |
| `media_list_hero_clicked` | User clicks the featured hero item on the movie or TV show list page. | `src/views/MediaListView.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Dashboard: Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1751155)
- [Search to Trailer Conversion Funnel (wizard)](https://us.posthog.com/project/483112/insights/CDzzVu5V)
- [User Sign-ins Over Time (wizard)](https://us.posthog.com/project/483112/insights/X1Idd7GR)
- [Trailer Engagement Over Time (wizard)](https://us.posthog.com/project/483112/insights/x7Oy6D99)
- [Media Card Clicks Over Time (wizard)](https://us.posthog.com/project/483112/insights/OSysf6g1)
- [Search Usage Over Time (wizard)](https://us.posthog.com/project/483112/insights/HqMCwxMm)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
