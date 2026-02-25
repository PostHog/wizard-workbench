<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application. Here's a summary of all changes made:

## Changes Summary

- **`nuxt.config.ts`** — Added `posthog` configuration block to `runtimeConfig.public` (reads API key and host from environment variables).
- **`plugins/posthog.client.ts`** *(new)* — Client-side PostHog plugin: initialises `posthog-js`, hooks into the Vue error lifecycle for automatic exception capture, and provides `$posthog` to all Vue components.
- **`types/nuxt-app.d.ts`** *(new)* — TypeScript declaration that types `$posthog` on the Nuxt app, enabling autocompletion and type safety.
- **`.env`** — Added `NUXT_PUBLIC_POSTHOG_KEY` and `NUXT_PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).
- **`server/api/auth/login.post.ts`** — Server-side PostHog Node client captures `user_logged_in` on every successful authentication, correlating with the client session via `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers.
- **`pages/login.vue`** — On successful login: identifies the user with PostHog (`posthog.identify(username)`); on failure: captures `login_failed` with the error message.
- **`composables/useAuth.ts`** — Captures `user_logged_out` and calls `posthog.reset()` before clearing the session cookie.
- **`pages/search.vue`** — Captures `search_performed` with the query string every time a new search executes.
- **`pages/[type]/[id].vue`** — Captures `media_viewed` (media ID, type, and title) when a media detail page loads — this is the entry point of the engagement funnel.
- **`components/media/Details.vue`** — Captures `media_tab_changed` (tab name) when the user switches between Overview, Videos, and Photos.
- **`components/video/Card.vue`** — Captures `video_played` (key, name, type) when a user opens a trailer/video.
- **`components/ExternalLinks.vue`** — Captures `external_link_clicked` (platform) for every external link (IMDB, Twitter, Instagram, etc.).
- **`components/media/Card.vue`** — Captures `media_card_clicked` (media ID, type, title) when a user clicks a media card.

## Events Tracked

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired on the server when a user successfully authenticates | `server/api/auth/login.post.ts` |
| `login_failed` | Fired on the client when a login attempt fails | `pages/login.vue` |
| `user_logged_out` | Fired on the client when a user logs out | `composables/useAuth.ts` |
| `search_performed` | Fired when a user submits a search query | `pages/search.vue` |
| `media_viewed` | Fired when a user views a media detail page (top of engagement funnel) | `pages/[type]/[id].vue` |
| `media_tab_changed` | Fired when user switches between Overview, Videos, and Photos tabs | `components/media/Details.vue` |
| `video_played` | Fired when a user plays a video/trailer | `components/video/Card.vue` |
| `external_link_clicked` | Fired when a user clicks an external link (IMDB, Twitter, etc.) | `components/ExternalLinks.vue` |
| `media_card_clicked` | Fired when a user clicks on a media card to view details | `components/media/Card.vue` |

## Next steps

We've designed a **"Analytics basics"** dashboard for you to keep an eye on user behavior. Create it in PostHog with the following five insights:

1. **Daily Active Users** — Trend of `user_logged_in` over the last 30 days — [Create in PostHog](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"user_logged_in","type":"events"}],"date_from":"-30d"})

2. **Media Engagement Funnel** — Funnel from `media_viewed` → `media_tab_changed` → `video_played` — [Create in PostHog](https://us.posthog.com/project/238460/insights/new#{"insight":"FUNNELS","events":[{"id":"media_viewed","type":"events","order":0},{"id":"media_tab_changed","type":"events","order":1},{"id":"video_played","type":"events","order":2}]})

3. **Search Engagement** — Trend of `search_performed` over time — [Create in PostHog](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"search_performed","type":"events"}],"date_from":"-30d"})

4. **External Link Clicks by Platform** — Breakdown of `external_link_clicked` grouped by `platform` property — [Create in PostHog](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"external_link_clicked","type":"events"}],"breakdown":"platform","breakdown_type":"event","date_from":"-30d"})

5. **Login Failures** — Trend of `login_failed` over time (churn risk indicator) — [Create in PostHog](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"login_failed","type":"events"}],"date_from":"-30d"})

Navigate to your PostHog project to manage these: [https://us.posthog.com/project/238460](https://us.posthog.com/project/238460)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-3.6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
