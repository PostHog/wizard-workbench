<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies 3.6 application. The integration uses `posthog-js` for client-side tracking and `posthog-node` for server-side tracking (the correct approach for Nuxt 3.0–3.6, which does not support the `@posthog/nuxt` module).

New files created:
- **`plugins/posthog.client.ts`** — Initializes PostHog on the client side, sets up automatic pageview capture on route changes
- **`composables/usePostHog.ts`** — Composable for accessing the PostHog client in Vue components
- **`server/utils/posthog.ts`** — Singleton PostHog Node client for server-side event capture
- **`.env`** — Added `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`

Existing files modified:
- **`nuxt.config.ts`** — Added `posthogPublicKey` and `posthogHost` to `runtimeConfig.public`
- **`pages/login.vue`** — Added user identify, `user_logged_in`, and `login_failed` events
- **`composables/useAuth.ts`** — Added `user_logged_out` event and `posthog.reset()` on logout
- **`pages/[type]/[id].vue`** — Added `media_viewed` event with media metadata
- **`pages/search.vue`** — Added `search_performed` event with search query
- **`pages/person/[id].vue`** — Added `person_viewed` event with person metadata
- **`server/api/auth/login.post.ts`** — Added server-side `server_login` event with session correlation headers

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in via the login form | `pages/login.vue` |
| `login_failed` | Fired when a login attempt fails | `pages/login.vue` |
| `user_logged_out` | Fired when a user logs out via the navbar | `composables/useAuth.ts` |
| `media_viewed` | Fired when a user views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `search_performed` | Fired when a user executes a search query | `pages/search.vue` |
| `person_viewed` | Fired when a user views a person (actor/director) profile page | `pages/person/[id].vue` |
| `server_login` | Server-side event fired when a login is processed by the API | `server/api/auth/login.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/9000003)
- [Daily Active Users](https://us.posthog.com/project/2/insights/lXJSPFxS)
- [Login Success vs Failure](https://us.posthog.com/project/2/insights/kSrVhGP1)
- [Most Viewed Media Types](https://us.posthog.com/project/2/insights/BS1GTpN3)
- [Search Activity](https://us.posthog.com/project/2/insights/uO5iqKqy)
- [Login to Media Funnel](https://us.posthog.com/project/2/insights/Q6ReJFGl)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
