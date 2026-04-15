<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies app. The integration adds client-side analytics via `posthog-js` and server-side tracking via `posthog-node`, covering key user actions across authentication, content discovery, search, and media playback.

**Key changes made:**

- **`plugins/posthog.client.ts`** *(new)* — Client-side PostHog plugin that initializes `posthog-js`, hooks into Vue's `vue:error` for automatic exception capture, and provides `$posthog` to the entire app.
- **`types/nuxt-app.d.ts`** *(new)* — TypeScript declarations so `$posthog` is typed across all components.
- **`nuxt.config.ts`** — Added `runtimeConfig.public.posthog` block exposing `publicKey`, `host`, and `posthogDefaults` from environment variables.
- **`.env`** — Created with `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`.
- **`composables/useAuth.ts`** — Calls `posthog.identify()` and captures `user_logged_in` on successful login; captures `user_logged_out` and calls `posthog.reset()` on logout.
- **`pages/login.vue`** — Captures `login_failed` with the error message when a login attempt fails.
- **`pages/search.vue`** — Captures `search_performed` with the query string on each new search.
- **`pages/[type]/[id].vue`** — Captures `media_viewed` with media ID, type, and title on mount.
- **`components/video/Card.vue`** — Captures `video_played` with video name, type, and key when a trailer is played.
- **`pages/person/[id].vue`** — Captures `person_viewed` with person ID and name on mount.
- **`pages/genre/[no]/movie.vue`** — Captures `genre_browsed` with genre ID, name, and media type on mount.
- **`components/media/Card.vue`** — Captures `media_card_clicked` with media ID, type, and title on card click.
- **`error.vue`** — Captures `error_page_viewed` with status code and message; calls `posthog.captureException()` for non-404 errors.
- **`server/api/auth/login.post.ts`** — Server-side `posthog-node` tracking of `server_login`, using `x-posthog-session-id` and `x-posthog-distinct-id` headers to correlate with the client session.

## Events

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `composables/useAuth.ts` |
| `user_logged_out` | User logs out | `composables/useAuth.ts` |
| `login_failed` | A login attempt fails | `pages/login.vue` |
| `search_performed` | User performs a search query | `pages/search.vue` |
| `media_viewed` | User views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `video_played` | User plays a trailer or video | `components/video/Card.vue` |
| `person_viewed` | User views a person (actor/director) detail page | `pages/person/[id].vue` |
| `genre_browsed` | User browses by genre | `pages/genre/[no]/movie.vue` |
| `media_card_clicked` | User clicks on a media card | `components/media/Card.vue` |
| `error_page_viewed` | User lands on the error page | `error.vue` |
| `server_login` | Server-side login event (correlated with client) | `server/api/auth/login.post.ts` |

## Next steps

To set up your "Analytics basics" dashboard, visit PostHog and create a new dashboard with these recommended insights:

1. **Login funnel** — Funnel from `login_failed` → `user_logged_in` to measure login conversion
2. **Search → Media views** — Funnel from `search_performed` → `media_card_clicked` → `media_viewed` to track discovery conversion
3. **Top searched queries** — Breakdown of `search_performed` by `query` property
4. **Most viewed media** — Breakdown of `media_viewed` by `media_title` property
5. **Video engagement** — Total count of `video_played` broken down by `video_type`

Visit your PostHog project at **https://us.posthog.com/project/2** to create the dashboard and add these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-3-6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
