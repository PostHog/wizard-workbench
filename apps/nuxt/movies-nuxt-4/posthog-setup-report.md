<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application. The `@posthog/nuxt` module has been installed and configured, providing automatic client-side and server-side analytics, session replay, and error tracking. Eight events have been instrumented across key user flows including authentication, content discovery, search, and media engagement. User identification is set up on login, with session correlation between client and server via `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired on successful login. Identifies the user via `posthog.identify()`. | `pages/login.vue` |
| `user_logged_out` | Fired when a user clicks logout. Resets the PostHog session. | `components/NavBar.vue` |
| `media_searched` | Fired when a user submits a search query. Includes the `query` property. | `pages/search.vue` |
| `media_viewed` | Fired when a user views a movie or TV show detail page. Includes `media_id`, `media_type`, and `media_title`. | `pages/[type]/[id].vue` |
| `video_played` | Fired when a user plays a video/trailer. Includes `video_name`, `video_type`, and `video_key`. | `components/video/Card.vue` |
| `person_viewed` | Fired when a user views a person (actor/director) detail page. Includes `person_id` and `person_name`. | `pages/person/[id].vue` |
| `language_changed` | Fired when a user switches the app language. Includes `from_language` and `to_language`. | `components/LanguageSwitcher.vue` |
| `server_login` | Server-side login event with session correlation. Includes `username`, `$session_id`. | `server/api/auth/login.post.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these five insights to monitor key user behavior:

1. **Login trend** — Trend of `user_logged_in` events over time to track daily active users and login frequency
2. **Content engagement funnel** — Funnel from `media_viewed` → `video_played` to measure how many viewers engage with trailers
3. **Search adoption** — Trend of `media_searched` events with breakdown by `query` to understand what content users look for
4. **Session depth** — Trend of `media_viewed` events per user session to measure content discovery depth
5. **Language distribution** — Breakdown of `language_changed` events by `to_language` to understand your international audience

To create this dashboard, visit your [PostHog project](https://us.posthog.com/project/238460/dashboards) and add the insights above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
