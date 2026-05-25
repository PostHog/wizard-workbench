<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies app. The `@posthog/nuxt` module was installed and configured, enabling automatic client-side and server-side tracking, session replay, and error capture. PostHog is initialized via the Nuxt module in `nuxt.config.ts` using environment variables, and a server-side singleton utility was created for backend event tracking. User identification is performed on successful login, and logout properly resets the PostHog identity. Ten events are tracked across nine files covering the full user journey from login to content discovery.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully authenticates | `pages/login.vue` |
| `login_failed` | Login attempt fails | `pages/login.vue` |
| `user_logged_out` | User logs out (also calls `posthog.reset()`) | `components/NavBar.vue` |
| `media_searched` | User submits a search query | `pages/search.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `trailer_played` | User plays the trailer from the hero section | `components/media/Hero.vue` |
| `video_played` | User plays a video from the videos tab | `components/video/Card.vue` |
| `media_tab_changed` | User switches between Overview, Videos, and Photos tabs | `components/media/Details.vue` |
| `language_changed` | User changes the interface language | `components/LanguageSwitcher.vue` |
| `server_login` | Server-side login with session correlation headers | `server/api/auth/login.post.ts` |

## Next steps

We've set up all the instrumentation. Head to PostHog to explore your data and build dashboards:

- [📊 Create a new "Analytics basics" dashboard](/dashboard) — add insights for the events above
- [🔍 Explore events in the Activity view](/events) — see `user_logged_in`, `media_searched`, `trailer_played`, and more as they come in
- [📈 Suggested insight: Login funnel](/insights/new) — funnel from `user_logged_in` → `media_detail_viewed` → `trailer_played`
- [📈 Suggested insight: Search engagement trend](/insights/new) — trend of `media_searched` over time
- [📈 Suggested insight: Content engagement breakdown](/insights/new) — `media_tab_changed` broken down by `tab` property
- [📈 Suggested insight: Login error rate](/insights/new) — compare `user_logged_in` vs `login_failed` over time
- [📈 Suggested insight: Language distribution](/insights/new) — `language_changed` broken down by `locale` property

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
