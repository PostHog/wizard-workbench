<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application (Nuxt 3.6). The integration covers client-side event tracking via `posthog-js`, server-side tracking via `posthog-node`, user identification on login, session/distinct ID correlation between client and server, and graceful PostHog resets on logout.

**Changes summary:**
- Installed `posthog-js` and `posthog-node` packages
- Added PostHog public token and host to `nuxt.config.ts` `runtimeConfig`
- Created `plugins/posthog.client.ts` — initializes PostHog on the client side and provides `$posthog` throughout the app
- Updated `composables/useAuth.ts` — identifies the user on login, captures `user_logged_in` / `user_logged_out`, resets PostHog on logout, and forwards client distinct/session IDs to the server
- Updated `pages/login.vue` — captures `login_failed` with an error message when login throws
- Updated `pages/search.vue` — captures `search_performed` with the search query
- Updated `pages/[type]/[id].vue` — captures `media_detail_viewed` on mount with media ID, type, title, and rating
- Updated `components/video/Card.vue` — captures `video_played` with video key, name, and type
- Updated `server/api/auth/login.post.ts` — captures `server_user_logged_in` and `server_login_failed` via posthog-node, correlated with the client's distinct ID and session ID

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logged in (client-side, includes identify call) | `composables/useAuth.ts` |
| `user_logged_out` | User logged out | `composables/useAuth.ts` |
| `login_failed` | Login attempt failed with an error message | `pages/login.vue` |
| `search_performed` | User performed a search query | `pages/search.vue` |
| `media_detail_viewed` | User viewed a movie or TV show detail page | `pages/[type]/[id].vue` |
| `video_played` | User clicked play on a video (trailer/clip) | `components/video/Card.vue` |
| `server_user_logged_in` | Server-side: login endpoint successfully processed a login | `server/api/auth/login.post.ts` |
| `server_login_failed` | Server-side: login endpoint returned a validation or server error | `server/api/auth/login.post.ts` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog at:
👉 https://us.posthog.com/project/238460/dashboard

Suggested insights to add:

1. **Login funnel** — Funnel from `login_failed` → `user_logged_in` to measure login success rate
2. **Search volume** — Trend of `search_performed` events over time
3. **Popular content** — Breakdown of `media_detail_viewed` by `media_title` property
4. **Video engagement** — Trend of `video_played` events (trailers clicked)
5. **Server auth health** — `server_login_failed` count over time to detect auth errors

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-3.6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
