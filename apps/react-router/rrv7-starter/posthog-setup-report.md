<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloutHub React Router v7 (Framework mode) application. Here is a summary of all changes made:

**New files created:**
- `app/entry.client.tsx` — Client entry point that initialises PostHog (`posthog-js`) and wraps the app in `PostHogProvider`. Includes `__add_tracing_headers` so client session/distinct IDs are automatically forwarded to the server on every request.
- `app/lib/posthog-middleware.ts` — React Router v7 middleware that creates a server-side PostHog Node client per request, extracts the `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers (set automatically by the client SDK), and uses `withContext()` so all server-side events are correlated with the correct client session.

**Modified files:**
- `react-router.config.ts` — Enabled `future.v8_middleware: true` to activate React Router's middleware system.
- `vite.config.ts` — Added `posthog-js` and `@posthog/react` to `ssr.noExternal` in dev mode so they are properly bundled for SSR.
- `env.d.ts` — Added `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` to the `ImportMetaEnv` interface.
- `app/root.tsx` — Registered the `posthogMiddleware` on the root route (so it runs on every request), and added `posthog.captureException(error)` in the `ErrorBoundary` for automatic unhandled error tracking.
- `app/routes/buy-followers.tsx` — Added `follower_package_selected` and `followers_purchased` event capture.
- `app/components/PostCard.tsx` — Added `post_liked` and `post_unliked` event capture.
- `app/routes/profile.tsx` — Added `follower_followed_back` event capture.
- `app/routes/home.tsx` — Added `view_feed_cta_clicked` and `buy_followers_cta_clicked` event capture.

**Environment variables set** (in `.env`):
- `VITE_PUBLIC_POSTHOG_KEY`
- `VITE_PUBLIC_POSTHOG_HOST`

**Packages installed:** `posthog-js`, `@posthog/react`, `posthog-node`

---

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `follower_package_selected` | User selects a follower package on the buy followers page | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower purchase (with package amount, bonus, and price properties) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a previously liked post in the feed | `app/components/PostCard.tsx` |
| `follower_followed_back` | User clicks 'Follow back' on a bot follower on the profile page | `app/routes/profile.tsx` |
| `view_feed_cta_clicked` | User clicks the 'View Feed' CTA on the home page (top of conversion funnel) | `app/routes/home.tsx` |
| `buy_followers_cta_clicked` | User clicks the 'Buy Fake Followers' CTA on the home page | `app/routes/home.tsx` |

---

## Next steps

To monitor user behaviour, head to your PostHog project and create an **"Analytics basics"** dashboard with these recommended insights:

1. **Purchase Conversion Funnel** — Funnel: `buy_followers_cta_clicked` → `follower_package_selected` → `followers_purchased`
2. **Follower Package Selections** — Trends: `follower_package_selected` over time
3. **Followers Purchased** — Trends: `followers_purchased` over time
4. **Feed Post Likes** — Trends: `post_liked` over time
5. **Home Page CTA Clicks** — Trends: `view_feed_cta_clicked` vs `buy_followers_cta_clicked` comparison

Your PostHog project: https://us.posthog.com/project/238460

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
