<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Vue Movies application. Here's a summary of what was done:

- **Installed** `posthog-js` (v1.354.0) via npm
- **Configured** environment variables `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` in `.env` (gitignore-covered)
- **Initialized** PostHog in `src/main.js` before app mount, with a global Vue error handler that sends all uncaught errors to PostHog via `captureException`
- **Added user identification** on login via `posthog.identify()` with the username, plus `posthog.reset()` on logout to clear the session
- **Instrumented 5 custom events** across 4 key files covering the core user journey: login → search → media detail → trailer engagement

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in. Includes the username for identification. | `src/views/LoginView.vue` |
| `user_logged_out` | Fired when a user logs out. PostHog session is reset immediately after. | `src/components/NavBar.vue` |
| `search_performed` | Fired when a user submits a search query. Includes the query and result count. | `src/views/SearchView.vue` |
| `media_detail_viewed` | Fired when a user views a movie or TV show detail page. Includes media type, id, title, genres, and release year. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user clicks to watch a trailer. Includes media type, id, and title — top of engagement funnel. | `src/views/MediaDetailView.vue` |

## Next steps

We've prepared the following insights and dashboard to track user behavior. Open them in PostHog to review and pin to your project:

**Suggested Dashboard: "Analytics basics"** — Create it at:
- [https://us.posthog.com/project/238460/dashboard](https://us.posthog.com/project/238460/dashboard)

**Suggested Insights:**

1. **Login → Media View → Trailer Funnel** — Conversion from login through media discovery to trailer engagement:
   - [Open in PostHog](https://us.posthog.com/project/238460/insights/new#{"kind":"InsightVizNode","source":{"kind":"FunnelsQuery","series":[{"kind":"EventsNode","event":"user_logged_in","name":"Logged in"},{"kind":"EventsNode","event":"media_detail_viewed","name":"Viewed media"},{"kind":"EventsNode","event":"trailer_played","name":"Played trailer"}],"dateRange":{"date_from":"-30d"},"funnelsFilter":{"funnelOrderType":"ordered","funnelWindowInterval":14,"funnelWindowIntervalUnit":"day"}}})

2. **Daily Logins Trend** — How many users log in per day:
   - [Open in PostHog](https://us.posthog.com/project/238460/insights/new#{"kind":"InsightVizNode","source":{"kind":"TrendsQuery","series":[{"kind":"EventsNode","event":"user_logged_in","math":"dau","name":"Daily logins"}],"interval":"day","dateRange":{"date_from":"-30d"}}})

3. **Top Searched Queries** — Most frequent search terms used:
   - [Open in PostHog](https://us.posthog.com/project/238460/insights/new#{"kind":"InsightVizNode","source":{"kind":"TrendsQuery","series":[{"kind":"EventsNode","event":"search_performed","math":"total","name":"Searches"}],"interval":"day","dateRange":{"date_from":"-30d"},"breakdownFilter":{"breakdown":"query","breakdown_type":"event"}}})

4. **Most Viewed Media** — Which movies/shows users view most:
   - [Open in PostHog](https://us.posthog.com/project/238460/insights/new#{"kind":"InsightVizNode","source":{"kind":"TrendsQuery","series":[{"kind":"EventsNode","event":"media_detail_viewed","math":"total","name":"Media views"}],"interval":"day","dateRange":{"date_from":"-30d"},"breakdownFilter":{"breakdown":"title","breakdown_type":"event"}}})

5. **User Churn — Logout Events** — Track when users log out to understand session patterns:
   - [Open in PostHog](https://us.posthog.com/project/238460/insights/new#{"kind":"InsightVizNode","source":{"kind":"TrendsQuery","series":[{"kind":"EventsNode","event":"user_logged_out","math":"total","name":"Logouts"},{"kind":"EventsNode","event":"user_logged_in","math":"total","name":"Logins"}],"interval":"day","dateRange":{"date_from":"-30d"}}})

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
