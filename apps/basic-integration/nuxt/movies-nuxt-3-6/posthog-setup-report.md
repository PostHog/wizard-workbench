# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application. The integration includes client-side product analytics, session replay, error tracking, user identification, and server-side event tracking on the login endpoint.

**What was set up:**
- `plugins/posthog.client.ts` — Client-side PostHog plugin that initializes `posthog-js`, wires up Vue error tracking via `nuxtApp.hook('vue:error', ...)`, and provides `$posthog` throughout the app.
- `types/nuxt-app.d.ts` — TypeScript declaration to type `$posthog` on the Nuxt app.
- `nuxt.config.ts` — Added `posthog` block to `runtimeConfig.public` so the token and host flow from environment variables.
- `.env` — `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` set for local development.
- `app.vue` — Added `onErrorCaptured` boundary so component errors are forwarded to PostHog.
- `pages/login.vue` — Calls `posthog.identify()` and captures `user_logged_in` after a successful login.
- `components/NavBar.vue` — Captures `user_logged_out` and calls `posthog.reset()` when the user logs out.
- `pages/search.vue` — Captures `search_performed` with the query string each time a search is triggered.
- `components/media/Hero.vue` — Captures `trailer_played` with media ID, title, and type when a trailer is opened.
- `components/video/Card.vue` — Captures `video_played` with key, name, and type when a video is played.
- `components/photo/Modal.vue` — Captures `photo_viewed` with index and total count when the photo modal opens.
- `components/media/Details.vue` — Captures `media_tab_changed` (Overview / Videos / Photos) with media context.
- `components/media/Card.vue` — Captures `media_card_clicked` with media ID, title, and type on every card click.
- `server/api/auth/login.post.ts` — Uses `posthog-node` to fire a server-side `server_login` event, correlated to the client session via `x-posthog-session-id` / `x-posthog-distinct-id` tracing headers.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logged in | `pages/login.vue` |
| `user_logged_out` | User logged out | `components/NavBar.vue` |
| `search_performed` | User performed a search query | `pages/search.vue` |
| `trailer_played` | User clicked to play a movie or TV show trailer | `components/media/Hero.vue` |
| `video_played` | User clicked to play a video from the videos tab | `components/video/Card.vue` |
| `photo_viewed` | User opened a photo in the photo modal | `components/photo/Modal.vue` |
| `media_tab_changed` | User switched between Overview, Videos, and Photos tabs | `components/media/Details.vue` |
| `media_card_clicked` | User clicked on a media card to view its detail page | `components/media/Card.vue` |
| `server_login` | Server-side login event correlated to client session | `server/api/auth/login.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1628581)
- [New user sign-ups over time](https://us.posthog.com/project/2/insights/KKRGAjHS)
- [Daily active users (sign-ins)](https://us.posthog.com/project/2/insights/SMCHYYxk)
- [Account deletions (churn)](https://us.posthog.com/project/2/insights/Are1sh5c)
- [Signup to checkout conversion funnel](https://us.posthog.com/project/2/insights/rKZQNAgw)
- [Team growth — invitations sent](https://us.posthog.com/project/2/insights/hot0qRd2)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
