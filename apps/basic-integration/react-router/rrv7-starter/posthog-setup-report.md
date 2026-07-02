<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloutHub fake influencer social network app built with React Router v7 (Framework mode). PostHog is initialized client-side in a new `app/entry.client.tsx` file using `posthog-js` wrapped in `PostHogProvider`. The vite dev server is configured with an `/ingest` proxy for PostHog requests, and SSR bundling is updated to include `posthog-js` and `@posthog/react`. Error tracking is wired into the root `ErrorBoundary`. Six business-critical events are captured across four files covering the key conversion funnel (package selection → purchase), post engagement (likes/unlikes), social actions (follow-back), and analytics engagement.

| Event | Description | File |
|-------|-------------|------|
| `follower_package_selected` | User selects a fake follower package on the buy-followers page. | `app/routes/buy-followers.tsx` |
| `follower_package_purchased` | User completes a fake follower purchase, the primary conversion event. | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed. | `app/components/PostCard.tsx` |
| `post_unliked` | User removes a like from a post in the feed. | `app/components/PostCard.tsx` |
| `user_followed_back` | User clicks Follow Back on a follower in their profile page. | `app/routes/profile.tsx` |
| `analytics_dashboard_viewed` | User visits the analytics dashboard, marking the top of a key engagement funnel. | `app/routes/analytics.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1792568)
  - Purchase conversion funnel (analytics_dashboard_viewed → follower_package_selected → follower_package_purchased)
  - Total follower purchases (trend)
  - Post engagement (likes vs unlikes)
  - User follow-back rate
  - Revenue proxy: total followers purchased over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
