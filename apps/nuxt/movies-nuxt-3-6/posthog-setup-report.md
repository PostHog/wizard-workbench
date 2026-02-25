<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies application (Nuxt v3.5.3). The integration covers client-side analytics via `posthog-js`, server-side event tracking via `posthog-node`, user identification, automatic Vue error tracking, and session correlation between client and server.

## Changes made

| File | Change |
|------|--------|
| `package.json` | Added `posthog-js` and `posthog-node` dependencies |
| `nuxt.config.ts` | Added PostHog `publicKey`, `host`, and `posthogDefaults` to `runtimeConfig.public` |
| `plugins/posthog.client.ts` | **New file** — Initialises PostHog on the client, hooks into `vue:error` for automatic error capture, provides `$posthog` to the app |
| `types/nuxt-app.d.ts` | **New file** — TypeScript declaration for the `$posthog: PostHog` plugin injection |
| `.env` | Added `NUXT_PUBLIC_POSTHOG_KEY` and `NUXT_PUBLIC_POSTHOG_HOST` environment variables |
| `pages/login.vue` | Identifies the user on successful login (`posthog.identify()`), captures `user_logged_in` and `login_failed` events |
| `components/NavBar.vue` | Captures `user_logged_out` and calls `posthog.reset()` on logout |
| `pages/search.vue` | Captures `media_searched` with query and result count on first page load of results |
| `pages/[type]/[id].vue` | Captures `media_detail_viewed` with media id, type, and title on mount |
| `pages/[type]/category/[query].vue` | Captures `category_browsed` with category and media type on mount |
| `components/video/Card.vue` | Captures `video_played` with video name, type, and key when a user plays a video |
| `components/media/Card.vue` | Captures `media_card_clicked` with media id, type, and title when a card is clicked |
| `error.vue` | Captures `error_page_viewed` with status code, message, and 404 flag on mount |
| `server/api/auth/login.post.ts` | Server-side `login_attempted` event via `posthog-node`, correlating client session using `x-posthog-session-id` / `x-posthog-distinct-id` headers |

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully logs in. Includes username. Also calls `posthog.identify()`. | `pages/login.vue` |
| `user_logged_out` | Fired when a user logs out. Calls `posthog.reset()` to clear identity. | `components/NavBar.vue` |
| `login_failed` | Fired when a login attempt fails. Includes the error message. | `pages/login.vue` |
| `media_searched` | Fired when a user performs a search. Includes `query` and `result_count`. | `pages/search.vue` |
| `media_detail_viewed` | Fired when a user views a movie or TV show detail page. Includes `media_id`, `media_type`, `media_title`. | `pages/[type]/[id].vue` |
| `video_played` | Fired when a user plays a trailer or clip. Includes `video_name`, `video_type`, `video_key`. | `components/video/Card.vue` |
| `media_card_clicked` | Fired when a user clicks a media card. Includes `media_id`, `media_type`, `media_title`. | `components/media/Card.vue` |
| `category_browsed` | Fired when a user browses a category listing. Includes `category`, `media_type`. | `pages/[type]/category/[query].vue` |
| `error_page_viewed` | Fired when a user hits an error page. Includes `status_code`, `message`, `is_404`. | `error.vue` |
| `login_attempted` | **Server-side** — Fired on every login API request. Includes `username`. Correlated to the client session via PostHog tracing headers. | `server/api/auth/login.post.ts` |

## Next steps

We've instrumented the key user journeys in the app. Here is a suggested **"Analytics basics"** dashboard to build in PostHog:

- **[Create Dashboard →](https://us.posthog.com/project/238460/dashboards)**

Suggested insights to add:

1. **Login Volume** — Trends on `user_logged_in` over time
   [Create insight →](https://us.posthog.com/project/238460/insights/new)

2. **Login Success vs Failure** — Trends comparing `user_logged_in` vs `login_failed`
   [Create insight →](https://us.posthog.com/project/238460/insights/new)

3. **Content Engagement** — Trends on `media_detail_viewed`, broken down by `media_type`
   [Create insight →](https://us.posthog.com/project/238460/insights/new)

4. **Search Activity** — Trends on `media_searched` over time
   [Create insight →](https://us.posthog.com/project/238460/insights/new)

5. **Video Playback** — Trends on `video_played`, broken down by `video_type`
   [Create insight →](https://us.posthog.com/project/238460/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-3.6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
