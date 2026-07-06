<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Vue Movies project. PostHog was installed with npm, initialized in the app entrypoint with Vite environment variables, and connected to Vue global error handling. Client-side identify and reset flows were added around demo authentication, and custom analytics events were instrumented across login, logout, homepage hero engagement, media list loading, media detail viewing, recommendation clicks, trailer plays, search usage, search-result clicks, and carousel exploration.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures when a user successfully signs in to the app. | `src/views/LoginView.vue` |
| `login_failed` | Captures when a sign-in attempt fails validation or authentication. | `src/views/LoginView.vue` |
| `user_logged_out` | Captures when an authenticated user logs out from the navigation. | `src/components/NavBar.vue` |
| `hero_media_opened` | Captures when the user opens featured media from a hero banner. | `src/views/HomeView.vue` |
| `media_list_loaded` | Captures when a media listing page finishes loading a query set. | `src/views/MediaListView.vue` |
| `media_card_selected` | Captures when a media card is selected from a list or carousel. | `src/components/media/MediaCard.vue` |
| `media_detail_viewed` | Captures when a media detail experience loads for a movie or show. | `src/views/MediaDetailView.vue` |
| `recommendation_selected` | Captures when a recommendation is selected from the detail page. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Captures when the user starts playing a media trailer. | `src/views/MediaDetailView.vue` |
| `search_performed` | Captures when a user searches for movies or TV shows. | `src/views/SearchView.vue` |
| `search_result_selected` | Captures when a search result card is selected. | `src/components/media/MediaCard.vue` |
| `carousel_more_clicked` | Captures when the user chooses to explore more from a carousel. | `src/components/carousel/CarouselAutoQuery.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1807741
- Insight: Logins vs failures — https://us.posthog.com/project/483112/insights/YgYt1kXG
- Insight: Login conversion funnel — https://us.posthog.com/project/483112/insights/ugoeOBRx
- Insight: Content engagement events — https://us.posthog.com/project/483112/insights/qxJW5I7L
- Insight: Search behavior — https://us.posthog.com/project/483112/insights/HXyMEHK9
- Insight: Media detail by type — https://us.posthog.com/project/483112/insights/fEq2fY5S

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
