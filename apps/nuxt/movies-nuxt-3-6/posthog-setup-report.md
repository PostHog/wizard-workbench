<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Nuxt Movies 3.6 application. This used `posthog-js` and `posthog-node` directly (the correct approach for Nuxt 3.0–3.6, which predates the `@posthog/nuxt` module).

**New files created:**
- `plugins/posthog.client.ts` — Initializes PostHog on the client side, wires up pageview capture on route changes, and provides `$posthog` via the Nuxt plugin system.
- `server/utils/posthog.ts` — Singleton server-side PostHog Node client, reused across all Nitro server requests.

**Existing files modified:**
- `nuxt.config.ts` — Added `posthogPublicKey` and `posthogHost` to `runtimeConfig.public`.
- `composables/useAuth.ts` — Identifies users on login (`posthog.identify`), captures `user_logged_in` and `user_logged_out`, and resets the PostHog session on logout.
- `pages/login.vue` — Captures `login_failed` with the error message when login throws.
- `pages/search.vue` — Captures `media_searched` with the search query each time a new search is triggered.
- `pages/[type]/[id].vue` — Captures `media_viewed` with media ID, type, and title on page load (client-side only).
- `components/video/Card.vue` — Captures `video_played` with video name, type, and YouTube key when a trailer is opened.
- `components/media/Card.vue` — Captures `media_card_clicked` with media ID, type, and title when a card link is clicked.
- `server/api/auth/login.post.ts` — Server-side `server_login` event using `posthog-node`, correlated with the client session via `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logs in | `composables/useAuth.ts` |
| `user_logged_out` | User logs out | `composables/useAuth.ts` |
| `login_failed` | Login attempt failed | `pages/login.vue` |
| `media_searched` | User searches for movies/TV | `pages/search.vue` |
| `media_viewed` | User views a detail page | `pages/[type]/[id].vue` |
| `video_played` | User plays a video/trailer | `components/video/Card.vue` |
| `media_card_clicked` | User clicks a media card | `components/media/Card.vue` |
| `server_login` | Server-side login event | `server/api/auth/login.post.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these insights:

1. **Login trend** — Trends chart for `user_logged_in` over time. Measures user acquisition and engagement.
2. **Content discovery funnel** — Funnel from `media_searched` → `media_card_clicked` → `media_viewed`. Measures how many searchers convert to viewing content.
3. **Video engagement trend** — Trends chart for `video_played` over time. Shows how often users watch trailers.
4. **Search volume** — Trends chart for `media_searched` broken down by query (property: `query`). Shows top search terms.
5. **Churn signal** — Trends chart for `user_logged_out` vs `user_logged_in` over time. High logout-to-login ratio may indicate churn.

Visit [https://us.posthog.com/project/238460](https://us.posthog.com/project/238460) to create these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
