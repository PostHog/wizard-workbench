<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies app (Nuxt 3.6). PostHog analytics are now fully instrumented across both the client and server side. The integration includes the `posthog-js` client plugin with Vue error tracking, user identification on login, session correlation headers passed to the server, and `posthog-node` for server-side event capture on the login API route.

## Changes made

| File | Change |
|------|--------|
| `plugins/posthog.client.ts` | New — initializes PostHog client SDK, hooks into `vue:error` for error tracking, provides `$posthog` to all components |
| `types/nuxt-app.d.ts` | New — TypeScript declaration for `$posthog` on `NuxtApp` |
| `nuxt.config.ts` | Added `posthog` block to `runtimeConfig.public` (reads from env vars) |
| `.env` | Created with `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` |
| `pages/login.vue` | Added `posthog.identify()` + `user_logged_in` capture on successful login |
| `components/NavBar.vue` | Added `user_logged_out` capture + `posthog.reset()` on logout |
| `pages/search.vue` | Added `search_performed` capture with query property when a new search is triggered |
| `pages/[type]/[id].vue` | Added `media_viewed` capture on mount with media ID, type, and title |
| `components/video/Card.vue` | Added `video_played` capture with video key, name, and type on play click |
| `server/api/auth/login.post.ts` | Added `posthog-node` server-side `server_login` event with session/distinct ID correlation via `x-posthog-session-id` / `x-posthog-distinct-id` headers |

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully logs in. Also identifies the user in PostHog. | `pages/login.vue` |
| `user_logged_out` | Fired when a user clicks the logout button. PostHog session is reset. | `components/NavBar.vue` |
| `search_performed` | Fired when a user submits or debounces a search query (includes `query` property). | `pages/search.vue` |
| `media_viewed` | Fired when a user views a movie or TV show detail page (top of engagement funnel). | `pages/[type]/[id].vue` |
| `video_played` | Fired when a user clicks to play a trailer or video. | `components/video/Card.vue` |
| `server_login` | Server-side event on login API route, correlated to client session via headers. | `server/api/auth/login.post.ts` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to set up in PostHog with the following suggested insights, based on the events just instrumented:

1. **Login → Media View → Video Played funnel** — measures engagement depth from login through content discovery to video playback.
   - [Create funnel insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

2. **Daily logins over time** — track login volume trends.
   - [Create trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

3. **Searches performed over time** — understand search usage patterns.
   - [Create trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

4. **Logout / churn events** — monitor when users leave sessions.
   - [Create trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

5. **Media views by type (movie vs tv)** — breakdown of content discovery by `media_type` property.
   - [Create breakdown insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

[Create the "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
