# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Vue 3 Movies app. PostHog is initialized in `src/main.js` before the app mounts, with a global Vue error handler that forwards uncaught exceptions to PostHog. User identification is handled in `src/composables/useAuth.ts` on login and reset on logout, and `src/router/index.ts` re-identifies already-authenticated users on every navigation so returning sessions are never anonymous. Seven custom events are captured across five files to cover the full user journey from login through content discovery and engagement.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fires when a user successfully completes the login flow. | `src/composables/useAuth.ts` |
| `user_logged_out` | Fires when a user logs out and their session is cleared. | `src/composables/useAuth.ts` |
| `login_failed` | Fires when a login attempt fails with an error. | `src/views/LoginView.vue` |
| `media_searched` | Fires when a user submits a search query for movies or TV shows. | `src/views/SearchView.vue` |
| `media_detail_viewed` | Fires when a movie or TV show detail page finishes loading. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fires when a user clicks the Watch Trailer button to open the trailer modal. | `src/views/MediaDetailView.vue` |
| `media_card_clicked` | Fires when a user clicks a media card to navigate to its detail page. | `src/components/media/MediaCard.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818345)
- [User logins over time](https://us.posthog.com/project/483112/insights/PMj6Gciz)
- [Login to content funnel](https://us.posthog.com/project/483112/insights/aAYKu71r)
- [Media searches over time](https://us.posthog.com/project/483112/insights/0BhFCdUW)
- [Media detail views by type](https://us.posthog.com/project/483112/insights/jU8y8z2J)
- [Trailer plays vs detail views](https://us.posthog.com/project/483112/insights/zZMuiCf6)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the router guard identifies on every navigation, but verify this covers your local development and staging environments.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
