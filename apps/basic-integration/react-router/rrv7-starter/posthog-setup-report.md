<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this React Router v7 framework app with PostHog. It installed the PostHog client and server SDKs, initialized the browser SDK in the client entry, added React Router middleware for server-side PostHog context, enabled error capture in the root error boundary, configured a local `/ingest` proxy for browser delivery, and added product analytics events across the home, feed, profile, buy-followers, and analytics flows. Environment variables were written to `.env`, and a starter dashboard plus five insights were created in PostHog. The wizard verified the touched integration by running `pnpm typecheck` and `pnpm build`, fixing one invalid PostHog defaults date along the way.

| Event | Description | File |
| --- | --- | --- |
| `cta_clicked` | Tracks when a visitor clicks a primary call-to-action from the landing page hero. | `app/routes/home.tsx` |
| `home_stats_preview_viewed` | Tracks when the home page stats preview scrolls into view. | `app/routes/home.tsx` |
| `buy_followers_package_selected` | Tracks when a user selects a fake follower package before purchase. | `app/routes/buy-followers.tsx` |
| `buy_followers_checkout_started` | Tracks when a user starts the fake follower checkout flow. | `app/routes/buy-followers.tsx` |
| `buy_followers_completed` | Tracks when a fake follower purchase flow completes successfully. | `app/routes/buy-followers.tsx` |
| `feed_post_liked` | Tracks when a user likes or unlikes a post in the feed. | `app/components/PostCard.tsx` |
| `profile_follow_back_clicked` | Tracks when a user follows back one of the suggested followers. | `app/routes/profile.tsx` |
| `profile_summary_viewed` | Tracks when a user opens the profile summary with current stats. | `app/routes/profile.tsx` |
| `analytics_summary_viewed` | Tracks when a user views the analytics summary with follower metrics. | `app/routes/analytics.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825422
- Insight: Hero CTA clicks (wizard) — https://us.posthog.com/project/483112/insights/Px7JJKpU
- Insight: Follower purchase funnel (wizard) — https://us.posthog.com/project/483112/insights/LaVLbGne
- Insight: Package selection by tier (wizard) — https://us.posthog.com/project/483112/insights/GwAoglYl
- Insight: Feed likes over time (wizard) — https://us.posthog.com/project/483112/insights/ueBFGTRR
- Insight: Profile and analytics views (wizard) — https://us.posthog.com/project/483112/insights/kozyjK9R

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
