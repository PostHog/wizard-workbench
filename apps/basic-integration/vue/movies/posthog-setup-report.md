# PostHog post-wizard report

The wizard has completed a PostHog integration for the Vue Movies app. `posthog-js` was installed and initialized in `src/main.js` with environment-variable-based configuration and a global Vue error handler. User identification happens on login, and session state is cleared on logout. Six custom events were added across four files to track the key user journeys: authentication, content discovery, media engagement, and search.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates and enters the app. | `src/views/LoginView.vue` |
| `user_logged_out` | Fired when a user clicks the logout button in the navigation bar. | `src/components/NavBar.vue` |
| `media_detail_viewed` | Fired when a user opens a movie or TV show detail page. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user clicks Watch Trailer to open the trailer modal. | `src/views/MediaDetailView.vue` |
| `search_performed` | Fired when a user submits a search query. | `src/views/SearchView.vue` |
| `media_card_clicked` | Fired when a user clicks a media card in any carousel or search results. | `src/components/media/MediaCard.vue` |

## Next steps

Dashboard creation requires `dashboard:write` scope on the PostHog API key. To create the "Analytics basics (wizard)" dashboard, add the `dashboard:write` and `insight:write` scopes to the key in PostHog → User Settings → Personal API keys, then re-run the wizard conclude step.

Suggested insights to build manually in PostHog in the meantime:

- **Login trend** — Trends: `user_logged_in` over time
- **Search activity** — Trends: `search_performed` over time, broken down by `result_count`
- **Content engagement** — Trends: `media_detail_viewed` + `trailer_played` on one chart
- **Login → content funnel** — Funnel: `user_logged_in` → `media_detail_viewed` → `trailer_played`
- **Top media viewed** — Trends: `media_detail_viewed` broken down by `media_title`

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
