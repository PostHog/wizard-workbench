# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Vue Movies app — a Vue 3 + Vite SPA that lets users browse and discover movies and TV shows. PostHog is initialised in `src/main.js` with the project token and host pulled from environment variables, and a global Vue `errorHandler` is wired up for automatic exception capture. User identity is established on every login via `posthog.identify()` and cleared on logout via `posthog.reset()`. Eight custom events covering authentication, search, and content engagement are now tracked across four files.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in to the app | `src/composables/useAuth.ts` |
| `user_logged_out` | User clicks logout and session is cleared | `src/composables/useAuth.ts` |
| `login_failed` | A login attempt fails and an error is shown | `src/views/LoginView.vue` |
| `search_performed` | User submits a search query (with `query` and `result_count` properties) | `src/views/SearchView.vue` |
| `search_result_clicked` | User clicks on a media card in search results | `src/views/SearchView.vue` |
| `media_detail_viewed` | User views the detail page for a movie or TV show | `src/views/MediaDetailView.vue` |
| `trailer_played` | User opens the trailer modal for a media item | `src/views/MediaDetailView.vue` |
| `recommendation_clicked` | User clicks a recommended media card on a detail page | `src/views/MediaDetailView.vue` |

## Next steps

We've built a dashboard and five insights to track user behaviour across the events above:

- **Dashboard — Analytics basics (wizard)**: https://us.i.posthog.com/project/483112/dashboard/1853802
  - Login & Logout events (wizard) — trend of authentications over time
  - Login to media view funnel (wizard) — conversion from login → media detail viewed → trailer played
  - Search activity (wizard) — daily search volume
  - Trailer plays by media type (wizard) — trailer plays broken down by movie vs TV
  - Recommendation clicks (wizard) — engagement with recommendation carousels

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`VITE_POSTHOG_PROJECT_TOKEN`, `VITE_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login; a handler that checks `localStorage` on app boot and calls `identify` again for already-authenticated users will keep returning sessions properly linked.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
