<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies app. The `@posthog/nuxt` module has been installed and configured, providing automatic client-side and server-side error tracking, session replay, and product analytics. A shared PostHog Node client singleton (`server/utils/posthog.ts`) handles server-side event capture, and tracing headers (`X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID`) correlate client and server events. Users are identified on login using `posthog.identify()`, and `posthog.reset()` is called on logout.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired on the client when a user successfully logs in. Also calls `posthog.identify()` to associate the session with the username. | `pages/login.vue` |
| `user_logged_out` | Fired when a user clicks the logout button. Also calls `posthog.reset()` to clear the session. | `components/NavBar.vue` |
| `search_performed` | Fired when a debounced search query is executed, with the query text as a property. | `pages/search.vue` |
| `media_viewed` | Fired when a user opens a movie or TV show detail page, capturing `media_id`, `media_type`, and `title`. Represents the top of the content engagement funnel. | `pages/[type]/[id].vue` |
| `video_played` | Fired when a user clicks play on a video/trailer card, with `video_key`, `video_name`, and `video_type`. | `components/video/Card.vue` |
| `person_viewed` | Fired when a user views a person (actor/director) profile page, with `person_id` and `person_name`. | `pages/person/[id].vue` |
| `language_changed` | Fired when a user switches the UI language, with the new `locale`. | `components/LanguageSwitcher.vue` |
| `server_login` | Server-side login event capturing `username` and session context from `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers. | `server/api/auth/login.post.ts` |

## Next steps

We've set up the following suggested insights and a dashboard for you to keep an eye on user behavior. Visit these links in PostHog to build them:

- **[Analytics basics dashboard](https://us.posthog.com/project/2/dashboard)** — create a new dashboard named "Analytics basics" and add the insights below.
- **[Login trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"user_logged_in","type":"events","name":"user_logged_in"}])** — daily `user_logged_in` count over time.
- **[Login → Media viewed → Video played funnel](https://us.posthog.com/project/2/insights/new#insight=FUNNELS&events=[{"id":"user_logged_in","type":"events"},{"id":"media_viewed","type":"events"},{"id":"video_played","type":"events"}])** — conversion funnel from login through content engagement.
- **[Search volume](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"search_performed","type":"events","name":"search_performed"}])** — track how frequently users search.
- **[User churn (logout trend)](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"user_logged_out","type":"events","name":"user_logged_out"}])** — monitor logout events as a churn signal.
- **[Language distribution](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"language_changed","type":"events","name":"language_changed","properties":[]}]&breakdown=locale&breakdown_type=event)** — breakdown of language preferences by locale.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
