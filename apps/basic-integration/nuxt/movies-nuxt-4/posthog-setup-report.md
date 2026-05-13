<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application. The `@posthog/nuxt` module was installed and configured with automatic client-side and server-side error tracking. User identification is performed on login. A server-side PostHog utility was created for tracking events in Nitro API routes, with session and distinct ID correlation via `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers. Events were added across key user flows: authentication, content discovery, search, video playback, and language switching.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired on successful login. Identifies the user with PostHog. | `pages/login.vue` |
| `user_logged_out` | Fired when user clicks logout. Resets PostHog identity. | `components/NavBar.vue` |
| `server_login` | Server-side login event with session/distinct ID correlation. | `server/api/auth/login.post.ts` |
| `media_viewed` | Fired when a movie or TV show detail page is viewed. Captures type, id, and title. | `pages/[type]/[id].vue` |
| `search_performed` | Fired when a user submits a search query. Captures the query string. | `pages/search.vue` |
| `video_played` | Fired when a trailer/video is played. Captures name, type, and key. | `components/video/Card.vue` |
| `person_viewed` | Fired when a person detail page is viewed. Captures person id and name. | `pages/person/[id].vue` |
| `language_changed` | Fired when the app language is switched. Captures new and previous locale. | `components/LanguageSwitcher.vue` |
| `media_card_clicked` | Fired when a media card is clicked. Captures type, id, and title. | `components/media/Card.vue` |
| `genre_browsed` | Fired when a genre listing page is visited. Captures genre id, name, and media type. | `pages/genre/[no]/movie.vue`, `pages/genre/[no]/tv.vue` |

## Next steps

We've prepared an **"Analytics basics"** dashboard for you to create in PostHog. Use the links below to build the recommended insights based on the events we just instrumented:

- **[Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboards)** — click "New dashboard" and name it "Analytics basics"

Recommended insights to add:

1. **Login funnel** — Trends: `user_logged_in` over time (tracks daily/weekly active logins)
   → [Create insight](https://us.posthog.com/project/2/insights/new#{"kind":"TrendsQuery","series":[{"kind":"EventsNode","event":"user_logged_in","name":"user_logged_in"}]})

2. **Content discovery funnel** — Funnel: `media_card_clicked` → `media_viewed` → `video_played` (measures conversion from browsing to watching)
   → [Create insight](https://us.posthog.com/project/2/insights/new#{"kind":"FunnelsQuery","series":[{"kind":"EventsNode","event":"media_card_clicked"},{"kind":"EventsNode","event":"media_viewed"},{"kind":"EventsNode","event":"video_played"}]})

3. **Search engagement** — Trends: `search_performed` over time (tracks how often users search)
   → [Create insight](https://us.posthog.com/project/2/insights/new#{"kind":"TrendsQuery","series":[{"kind":"EventsNode","event":"search_performed","name":"search_performed"}]})

4. **User churn** — Trends: `user_logged_out` over time (monitors logout/churn signals)
   → [Create insight](https://us.posthog.com/project/2/insights/new#{"kind":"TrendsQuery","series":[{"kind":"EventsNode","event":"user_logged_out","name":"user_logged_out"}]})

5. **Top genres browsed** — Trends: `genre_browsed` broken down by `genre_name` property (identifies most popular content genres)
   → [Create insight](https://us.posthog.com/project/2/insights/new#{"kind":"TrendsQuery","series":[{"kind":"EventsNode","event":"genre_browsed","name":"genre_browsed"}],"breakdownFilter":{"breakdown":"genre_name","breakdown_type":"event"}})

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
