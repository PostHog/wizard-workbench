<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies app. PostHog is initialised via a client-side plugin (`plugins/posthog.client.ts`) that provides the `$posthog` instance throughout the app. Configuration is driven by environment variables referenced through Nuxt's `runtimeConfig`. Nine custom events are captured across login, search, media browsing, video playback, and content discovery flows. Users are identified on login and reset on logout. Vue component errors are captured automatically via the `vue:error` hook in the plugin, with an additional `onErrorCaptured` boundary in `app.vue`. Server-side login tracking is wired into the login API route using `posthog-node`, with session and user context forwarded from the client via automatic `x-posthog-session-id` / `x-posthog-distinct-id` headers.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `pages/login.vue`, `server/api/auth/login.post.ts` |
| `user_login_failed` | Fired when a login attempt fails | `pages/login.vue` |
| `user_logged_out` | Fired when a user logs out | `components/NavBar.vue` |
| `media_viewed` | Fired when a user opens a movie or TV show detail page | `pages/[type]/[id].vue` |
| `media_searched` | Fired when a user submits a search query | `pages/search.vue` |
| `video_played` | Fired when a user plays a video/trailer | `components/video/Card.vue` |
| `category_browsed` | Fired when a user browses a media category listing | `pages/[type]/category/[query].vue` |
| `genre_browsed` | Fired when a user browses a genre listing | `pages/genre/[no]/movie.vue`, `pages/genre/[no]/tv.vue` |
| `person_viewed` | Fired when a user views a person/actor profile page | `pages/person/[id].vue` |

## Next steps

The PostHog MCP API key used during setup is missing `dashboard:write`, `insight:write`, and `query:read` scopes, so the "Analytics basics" dashboard could not be created automatically. Once those scopes are added to the API key, you can create a dashboard containing these recommended insights:

1. **Login funnel** (`query-funnel`) — steps: `user_logged_in` → `media_viewed` → `video_played`. Measures how many users go from logging in to actually watching a trailer.
2. **Search-to-view conversion** (`query-funnel`) — steps: `media_searched` → `media_viewed`. Measures search effectiveness.
3. **Content engagement over time** (`query-trends`) — trends for `media_viewed`, `video_played`, `person_viewed`. Shows daily active content consumption.
4. **Search volume** (`query-trends`) — trend for `media_searched` broken down by query. Shows what users search for most.
5. **Login success vs failure** (`query-trends`) — trends for `user_logged_in` and `user_login_failed` side-by-side. Monitors auth health.

To create the dashboard, add these scopes to your PostHog personal API key: `dashboard:write`, `insight:write`, `query:read`.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-3-6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
