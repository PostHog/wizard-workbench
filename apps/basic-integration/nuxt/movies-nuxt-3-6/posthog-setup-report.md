<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies app. PostHog is now initialized client-side via a Nuxt plugin, with session replay and error tracking enabled. User identification is performed on login, and user context is reset on logout. Server-side tracking correlates with client sessions via request headers. Eight distinct events covering user authentication, content discovery, and engagement are now captured across the app.

**Changes made:**

- **`nuxt.config.ts`** — Added `posthog` block to `runtimeConfig.public` with `publicKey`, `host`, and `posthogDefaults`.
- **`plugins/posthog.client.ts`** *(new)* — Initializes PostHog client with session replay defaults and a `vue:error` hook for automatic error capture. Provides `$posthog` throughout the app.
- **`types/nuxt-app.d.ts`** *(new)* — TypeScript declaration for the `$posthog` NuxtApp property.
- **`composables/useAuth.ts`** — Added `posthog.identify()` and `user_logged_in` capture on successful login; `user_logged_out` capture and `posthog.reset()` on logout.
- **`pages/search.vue`** — Captures `media_searched` with the search query when a debounced search fires.
- **`pages/[type]/[id].vue`** — Captures `media_viewed` on mount with media ID, type, and title.
- **`components/video/Card.vue`** — Captures `video_played` with video key, name, and type when a user clicks a video.
- **`components/media/Details.vue`** — Captures `media_tab_changed` with the new tab name and media context when the user switches between Overview, Videos, and Photos.
- **`pages/person/[id].vue`** — Captures `person_viewed` on mount with person ID and name.
- **`error.vue`** — Captures `error_occurred` on mount; calls `captureException` for non-404 errors.
- **`server/api/auth/login.post.ts`** — Creates a PostHog Node client per request, reads `x-posthog-session-id` and `x-posthog-distinct-id` headers, and captures a `server_login` event correlated with the client session.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `composables/useAuth.ts` |
| `user_logged_out` | Fired when a user logs out | `composables/useAuth.ts` |
| `server_login` | Server-side login event correlated with client session | `server/api/auth/login.post.ts` |
| `media_searched` | Fired when a user performs a search query | `pages/search.vue` |
| `media_viewed` | Fired when a user views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `video_played` | Fired when a user clicks to play a video trailer or clip | `components/video/Card.vue` |
| `media_tab_changed` | Fired when a user switches between Overview, Videos, or Media Photos tabs | `components/media/Details.vue` |
| `person_viewed` | Fired when a user views an actor or person profile page | `pages/person/[id].vue` |
| `error_occurred` | Fired when an application error is shown | `error.vue` |

## Next steps

Explore and build insights from your new events in PostHog:

- [Insights](https://us.posthog.com/project/2/insights) — Create trends, funnels, and retention charts for your events
- [Session Replay](https://us.posthog.com/project/2/replay) — Watch real user sessions with full event context
- [Dashboards](https://us.posthog.com/project/2/dashboard) — Build an "Analytics basics" dashboard with suggested insights:
  - **Login → Media Viewed → Video Played** funnel (conversion from login to video engagement)
  - **media_searched** trend over time (search engagement)
  - **media_viewed** breakdown by `media_type` (movie vs TV popularity)
  - **user_logged_out** trend over time (churn signal)
  - **error_occurred** trend (error rate monitoring)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-3-6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
