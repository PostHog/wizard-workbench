<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloutHub, a React Router v7 (Framework mode, SSR) satirical influencer app. PostHog is initialised in a new `app/entry.client.tsx` client entry point, wrapped with `PostHogProvider` so every component can access the client via `usePostHog()`. The reverse-proxy routes `/ingest/*` were added to `vite.config.ts` so ad-blockers can't silently swallow events, and `posthog-js` / `@posthog/react` were added to the SSR `noExternal` list so they bundle correctly under Vite. Error tracking was wired into the root `ErrorBoundary` via `posthog.captureException()`. Six client-side events now cover the two most important user flows: the fake-follower purchase funnel and feed engagement.

| Event | Description | File |
|---|---|---|
| `buy_followers_viewed` | User lands on the Buy Fake Followers page — start of purchase funnel | `app/routes/buy-followers.tsx` |
| `followers_package_selected` | User clicks a follower package card (properties: amount, bonus, total, price) | `app/routes/buy-followers.tsx` |
| `followers_purchased` | Purchase completes (properties: amount, bonus, total, price) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed (properties: post_id, post_author) | `app/components/PostCard.tsx` |
| `post_unliked` | User removes a like from a post (properties: post_id, post_author) | `app/components/PostCard.tsx` |
| `follower_followed_back` | User clicks "Follow back" on a bot follower (properties: follower_username) | `app/routes/profile.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behaviour, based on the events we just instrumented:

- **Dashboard — Analytics basics (wizard):** https://us.posthog.com/project/483112/dashboard/1829321
- **Follower purchase funnel (wizard):** https://us.posthog.com/project/483112/insights/B8KUFY33
- **Followers purchased over time (wizard):** https://us.posthog.com/project/483112/insights/jrQD5iak
- **Post engagement: likes and unlikes (wizard):** https://us.posthog.com/project/483112/insights/8TPWHbbH
- **Package selection by tier (wizard):** https://us.posthog.com/project/483112/insights/CG15kWz0
- **Follow back activity (wizard):** https://us.posthog.com/project/483112/insights/Um3giEV9

Dashboard subscription and alerts were skipped — the interactive confirmation prompt was unavailable in this environment. You can set these up manually in PostHog: go to the dashboard and click **Subscribe** for a recurring email digest, or open any insight and click **Alerts** to get notified when the purchase funnel conversion drops.

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to any monorepo/CI bootstrap scripts and confirm `.env.example` is committed — collaborators need to know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify correctly in PostHog error tracking.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
