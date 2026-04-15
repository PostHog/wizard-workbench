<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Nuxt Movies application. The `@posthog/nuxt` module is now installed and configured, providing automatic client-side and server-side error tracking, session replay, and product analytics. Ten events are tracked across nine files, covering the full user journey from login through content discovery and engagement.

## Summary of changes

- **`nuxt.config.ts`** — Added `@posthog/nuxt` to modules, configured `posthogConfig` with client-side exception capture and server-side error autocapture, and added PostHog keys to `runtimeConfig.public.posthog`.
- **`server/utils/posthog.ts`** _(new)_ — Singleton PostHog Node client for server-side event capture.
- **`server/api/auth/login.post.ts`** — Added `server_login` event with session/distinct ID headers for client-server correlation.
- **`pages/login.vue`** — Added `identify()` + `user_logged_in` capture on successful login, plus `captureException` on login errors.
- **`components/NavBar.vue`** — Added `user_logged_out` capture and `posthog.reset()` on logout.
- **`pages/search.vue`** — Added `search_performed` capture with query text and result count on first result page.
- **`pages/[type]/[id].vue`** — Added `media_detail_viewed` capture on mount with media ID, type, title, and vote average.
- **`components/video/Card.vue`** — Added `video_played` capture with video name, type, key, and site.
- **`components/LanguageSwitcher.vue`** — Added `language_changed` capture with previous and new locale.
- **`pages/genre/[no]/movie.vue`** — Added `genre_browsed` capture on mount with genre ID, name, and type.
- **`pages/person/[id].vue`** — Added `person_profile_viewed` capture on mount with person ID and name.
- **`pages/[type]/category/[query].vue`** — Added `media_category_browsed` capture on mount with category and media type.

## Events

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in; triggers `identify()` | `pages/login.vue` |
| `user_logged_out` | User logs out via the NavBar; triggers `posthog.reset()` | `components/NavBar.vue` |
| `server_login` | Server-side login event with session/distinct ID correlation | `server/api/auth/login.post.ts` |
| `search_performed` | User performs a search; captures query and result count | `pages/search.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `video_played` | User plays a video trailer or clip | `components/video/Card.vue` |
| `language_changed` | User switches the display language | `components/LanguageSwitcher.vue` |
| `genre_browsed` | User browses a movie or TV genre | `pages/genre/[no]/movie.vue` |
| `person_profile_viewed` | User views a person (actor/director) profile | `pages/person/[id].vue` |
| `media_category_browsed` | User browses a media category list (e.g. popular, trending) | `pages/[type]/category/[query].vue` |

## Next steps

We recommend building an "Analytics basics" dashboard in PostHog with the following insights based on the events we just instrumented:

1. **Login funnel** — Funnel from `user_logged_in` → `media_detail_viewed` → `video_played` (conversion from login to active content engagement)
2. **Search engagement** — Trend of `search_performed` over time, grouped by unique users
3. **Top content viewed** — `media_detail_viewed` breakdown by `media_title` property
4. **Video play rate** — `video_played` trend, grouped by `video_type`
5. **Language distribution** — `language_changed` breakdown by `new_locale` property

Create your dashboard here: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
