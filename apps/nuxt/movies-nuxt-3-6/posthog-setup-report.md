<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Nuxt 3.x Movies application. Since Nuxt ^3.5.3 falls in the 3.0–3.6 range, the integration uses `posthog-js` and `posthog-node` directly (not the `@posthog/nuxt` module, which requires 3.7+).

**Files created:**
- `plugins/posthog.client.ts` — Initialises PostHog on the client side using the Nuxt plugin system. Provides `$posthog` to all components via `useNuxtApp()`. Also registers a router hook for automatic pageview tracking.
- `server/utils/posthog.ts` — Singleton PostHog Node client for server-side event capture, reading config from `runtimeConfig.public.posthog`.

**Files modified:**
- `nuxt.config.ts` — Added `runtimeConfig.public.posthog` with `projectToken` and `apiHost`, both sourced from environment variables.
- `composables/useAuth.ts` — Passes `x-posthog-distinct-id` and `x-posthog-session-id` headers to login and logout API calls so server-side events are correlated with the client session.
- `pages/login.vue` — Identifies the user with PostHog on login and captures `user_logged_in`.
- `components/NavBar.vue` — Captures `user_logged_out` and resets the PostHog identity on logout.
- `pages/search.vue` — Captures `search_performed` with the search query on each debounced search.
- `pages/[type]/[id].vue` — Captures `media_viewed` with media ID, type, title, and rating on mount.
- `pages/person/[id].vue` — Captures `person_viewed` with person ID and name on mount.
- `pages/genre/[no]/movie.vue` — Captures `genre_browsed` with genre ID, name, and media type on mount.
- `pages/[type]/category/[query].vue` — Captures `category_browsed` with category and media type on mount.
- `server/api/auth/login.post.ts` — Captures `server_login` server-side, correlating via PostHog session/distinct-ID headers.
- `server/api/auth/logout.post.ts` — Captures `server_logout` server-side with session correlation.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `pages/login.vue` |
| `user_logged_out` | User clicks logout in nav bar | `components/NavBar.vue` |
| `search_performed` | Debounced search query executed | `pages/search.vue` |
| `media_viewed` | Movie or TV show detail page opened | `pages/[type]/[id].vue` |
| `person_viewed` | Person/actor detail page opened | `pages/person/[id].vue` |
| `genre_browsed` | Movie genre listing browsed | `pages/genre/[no]/movie.vue` |
| `category_browsed` | Media category listing browsed | `pages/[type]/category/[query].vue` |
| `server_login` | Login request processed (server-side) | `server/api/auth/login.post.ts` |
| `server_logout` | Logout request processed (server-side) | `server/api/auth/logout.post.ts` |

## Next steps

To monitor user behaviour, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Login funnel** — Trend of `user_logged_in` over time to track active users
2. **Search engagement** — Trend of `search_performed` with breakdown by query
3. **Most-viewed content** — `media_viewed` breakdown by `media_type` (movie vs TV)
4. **Login → Browse funnel** — Conversion funnel: `user_logged_in` → `media_viewed`
5. **Churn signal** — `user_logged_out` rate vs `user_logged_in` rate over time

Create the dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
