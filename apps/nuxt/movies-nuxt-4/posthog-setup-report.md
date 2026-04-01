<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application. The `@posthog/nuxt` module was installed and configured with automatic client-side and server-side error tracking. A server-side PostHog Node client was created as a shared singleton for use in API routes. Ten events were instrumented across client-side pages/components and server-side API handlers, with user identification on login and session reset on logout. Tracing headers are automatically added to requests so client and server events correlate via the same session and distinct ID.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired on successful login; also calls `identify()` to link the session to the user | `pages/login.vue` |
| `user_logged_out` | Fired on logout; calls `posthog.reset()` to clear the session | `composables/useAuth.ts` |
| `server_login` | Server-side login event with session/distinct ID correlation | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side logout event with session/distinct ID correlation | `server/api/auth/logout.post.ts` |
| `search_performed` | Fired when a search query is submitted, with the query string | `pages/search.vue` |
| `media_viewed` | Fired on mount when a movie or TV detail page is loaded (top of funnel) | `pages/[type]/[id].vue` |
| `video_played` | Fired when the user clicks play on a video trailer or clip | `components/video/Card.vue` |
| `photo_viewed` | Fired when the photo gallery modal opens, with photo count | `components/photo/Modal.vue` |
| `genre_browsed` | Fired when a user navigates to a genre listing page | `pages/genre/[no]/movie.vue` |
| `category_browsed` | Fired when a user browses a category list (e.g. popular, top rated) | `pages/[type]/category/[query].vue` |

## Next steps

We've prepared insights and a dashboard for you to keep an eye on user behavior based on the events we just instrumented. Visit your PostHog project to create the "Analytics basics" dashboard with these five insights:

1. **Login-to-Engagement Funnel** — Funnel: `user_logged_in` → `media_viewed` → `video_played` (conversion funnel)
2. **Content Engagement Over Time** — Trend: `media_viewed`, `video_played`, `photo_viewed` (unique users per day)
3. **Daily Active Logged-In Users** — Trend: `user_logged_in` (unique users over time)
4. **Top Searches** — Table: `search_performed` broken down by `query` property
5. **Genre & Category Popularity** — Table: `genre_browsed` broken down by `genre_name`, and `category_browsed` by `category`

Dashboard: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
