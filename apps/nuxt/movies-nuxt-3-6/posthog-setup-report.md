<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies 3.6 application. The integration covers client-side analytics via `posthog-js`, server-side tracking via `posthog-node`, user identification on login, Vue error capture, and event tracking across the core user flows.

## Changes made

### New files
- **`plugins/posthog.client.ts`** — Initializes PostHog on the client side, provides `$posthog` via the Nuxt plugin system, and hooks into `vue:error` for automatic error capture.
- **`types/nuxt-app.d.ts`** — TypeScript declarations so `$posthog` is correctly typed throughout the project.

### Modified files
- **`nuxt.config.ts`** — Added `posthog` block to `runtimeConfig.public` reading from environment variables.
- **`composables/useAuth.ts`** — `login()` now identifies the user and captures `user_logged_in`; `logout()` captures `user_logged_out` and calls `posthog.reset()`; failed logins capture `login_failed`.
- **`server/api/auth/login.post.ts`** — Added server-side PostHog Node client that captures `server_login`, correlated to the client session via `x-posthog-session-id` / `x-posthog-distinct-id` headers.
- **`pages/search.vue`** — Captures `media_searched` with the search query each time a new search is performed.
- **`components/media/Card.vue`** — Captures `media_card_clicked` with media id, type, title, and rating on card click.
- **`components/video/Card.vue`** — Captures `video_played` with video name, type, and key when a trailer is launched.
- **`components/media/Details.vue`** — Captures `media_detail_tab_changed` with the new tab and media context when the user switches between Overview, Videos, and Photos.
- **`pages/[type]/[id].vue`** — Captures `media_detail_viewed` on page mount as the top of the content engagement funnel.

### Environment variables
The following variables were written to `.env`:
- `NUXT_PUBLIC_POSTHOG_KEY` — PostHog public token
- `NUXT_PUBLIC_POSTHOG_HOST` — PostHog host URL

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logs in | `composables/useAuth.ts` |
| `user_logged_out` | User logs out | `composables/useAuth.ts` |
| `login_failed` | Login attempt fails | `composables/useAuth.ts` |
| `server_login` | Server-side login confirmation (correlated with client session) | `server/api/auth/login.post.ts` |
| `media_searched` | User performs a search query | `pages/search.vue` |
| `media_card_clicked` | User clicks a movie or TV show card | `components/media/Card.vue` |
| `video_played` | User plays a video trailer | `components/video/Card.vue` |
| `media_detail_tab_changed` | User switches between Overview/Videos/Photos tabs | `components/media/Details.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page | `pages/[type]/[id].vue` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Login funnel** — Funnel: `media_detail_viewed` → `media_card_clicked` → `media_detail_viewed` (conversion from browse to detail view)
2. **Daily active users** — Unique users performing `user_logged_in` over time
3. **Login success vs. failure rate** — Trends: `user_logged_in` vs. `login_failed` side by side
4. **Top searched queries** — Breakdown of `media_searched` by `query` property
5. **Content engagement** — Trends: `media_detail_viewed`, `media_card_clicked`, `video_played` combined

Visit [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) to create these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-3.6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
