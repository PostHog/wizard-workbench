<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was installed into this Vue 3 + Vite application, initialized at app startup with Vite environment variables, and connected to Vue global error handling. The integration also adds user identification for authenticated sessions, resets analytics state on logout, and instruments core product interactions across login, navigation, discovery, search, media detail engagement, and carousel interactions.

| Event name | Description | File |
| --- | --- | --- |
| `login_submitted` | Captures a successful login submission from the sign-in form. | `src/views/LoginView.vue` |
| `hero_media_loaded` | Captures when the home hero successfully loads featured media. | `src/views/HomeView.vue` |
| `media_list_loaded` | Captures when a media list page loads results for a selected category. | `src/views/MediaListView.vue` |
| `media_detail_viewed` | Captures when a media detail page successfully loads a title. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Captures when a user opens the trailer player for a title. | `src/views/MediaDetailView.vue` |
| `search_performed` | Captures when a user runs a search for movies or TV shows. | `src/views/SearchView.vue` |
| `search_result_opened` | Captures when a user opens a title from search or carousel results. | `src/components/media/MediaCard.vue` |
| `carousel_more_clicked` | Captures when a user clicks through to explore a carousel category. | `src/components/carousel/CarouselAutoQuery.vue` |
| `carousel_scrolled` | Captures when a user manually scrolls a carousel. | `src/components/carousel/CarouselBase.vue` |
| `nav_item_clicked` | Captures when an authenticated user navigates using the main navigation. | `src/components/NavBar.vue` |
| `logout_clicked` | Captures when a user logs out from the application. | `src/components/NavBar.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1818357
- Insight: Logins over time (wizard) — https://us.posthog.com/project/483112/insights/gmv5TQTd
- Insight: Searches by source (wizard) — https://us.posthog.com/project/483112/insights/X1NHVifF
- Insight: Discovery engagement funnel (wizard) — https://us.posthog.com/project/483112/insights/098P6LIm
- Insight: Navigation clicks by destination (wizard) — https://us.posthog.com/project/483112/insights/4ClAQzYV
- Insight: Featured content engagement mix (wizard) — https://us.posthog.com/project/483112/insights/dncoJxGW

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
