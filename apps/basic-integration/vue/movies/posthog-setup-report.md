# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Vue Movies app. PostHog is initialized in `src/main.js` using environment variables, with a global Vue error handler wired to `posthog.captureException`. Users are identified by username on login and the PostHog session is reset on logout. Five custom events are captured across the key user journeys: authentication, content discovery, and trailer engagement.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in. | `src/views/LoginView.vue` |
| `user_logged_out` | Fired when a user clicks the logout button. | `src/components/NavBar.vue` |
| `media_searched` | Fired when a user submits a search query for movies or TV shows. | `src/views/SearchView.vue` |
| `media_detail_viewed` | Fired when a user views a media detail page, marking the top of the content engagement funnel. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user clicks the Watch Trailer button on a media detail page. | `src/views/MediaDetailView.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1901920)
- [Logins over time (wizard)](https://us.posthog.com/project/483112/insights/2asMAoay)
- [Searches performed (wizard)](https://us.posthog.com/project/483112/insights/WDxFYOPK)
- [Media detail views (wizard)](https://us.posthog.com/project/483112/insights/ZimFcmTN)
- [Trailer plays (wizard)](https://us.posthog.com/project/483112/insights/a968fEjR)
- [Content engagement funnel (wizard)](https://us.posthog.com/project/483112/insights/pLNiFFnn)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
