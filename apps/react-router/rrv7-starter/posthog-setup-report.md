<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloutHub, a React Router v7 Framework mode application. The integration adds client-side event tracking, server-side middleware for session correlation, error boundary tracking, and a PostHog provider wrapping the full app.

**New files created:**
- `app/entry.client.tsx` — Initializes PostHog SDK and wraps the app with `PostHogProvider`
- `app/lib/posthog-middleware.ts` — Server-side PostHog middleware that creates a Node client per request and correlates client sessions via `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers

**Existing files modified:**
- `react-router.config.ts` — Enabled `future.v8_middleware: true` for server-side middleware support
- `vite.config.ts` — Added `posthog-js` and `@posthog/react` to `ssr.noExternal` for dev builds
- `app/root.tsx` — Registered `posthogMiddleware`, added `usePostHog` error boundary with `captureException`
- `app/routes/home.tsx` — Added `buy_followers_cta_clicked` event on hero CTA click
- `app/routes/buy-followers.tsx` — Added `followers_package_selected` and `followers_purchased` events
- `app/components/PostCard.tsx` — Added `post_liked` and `post_unliked` events
- `app/routes/profile.tsx` — Added `follower_followed_back` event in `FollowButton`
- `.env` — Added `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables

**Packages installed:** `posthog-js`, `@posthog/react`, `posthog-node`

| Event Name | Description | File |
|---|---|---|
| `buy_followers_cta_clicked` | User clicks the "Buy Fake Followers" CTA on the home page, entering the purchase funnel | `app/routes/home.tsx` |
| `followers_package_selected` | User selects a follower package on the buy-followers page | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a follower package purchase (primary conversion event) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a previously liked post in the feed | `app/components/PostCard.tsx` |
| `follower_followed_back` | User clicks "Follow back" on a follower in the profile page | `app/routes/profile.tsx` |

## Next steps

We've designed an "Analytics basics" dashboard for you to keep an eye on user behavior. Create it in PostHog with these five insights based on the events just instrumented:

1. **Follower Purchase Funnel** — Funnel insight with steps: `buy_followers_cta_clicked` → `followers_package_selected` → `followers_purchased`. This shows your end-to-end conversion rate.
2. **Followers Purchased Over Time** — Trend insight for `followers_purchased`. Track your primary conversion event day by day.
3. **Post Engagement** — Trend insight comparing `post_liked` vs `post_unliked`. Monitor feed engagement health.
4. **Package Selection Rate** — Trend insight for `followers_package_selected` to track top-of-funnel interest.
5. **Follow-Back Rate** — Trend insight for `follower_followed_back` to measure profile engagement.

You can create these at: [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
