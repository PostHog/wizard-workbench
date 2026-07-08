# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for the CloutHub React Router v7 (framework mode) app. New files `app/entry.client.tsx` were created to initialize posthog-js and wrap the app in `PostHogProvider`. The `vite.config.ts` SSR config was updated to prevent bundling errors. Error tracking was wired into the existing `ErrorBoundary` in `app/root.tsx`. Six events were instrumented across three files covering the key user journeys: follower purchases (the main conversion funnel), feed post engagement, and profile follow-back interactions.

| Event name | Description | File |
|---|---|---|
| `buy_followers_page_viewed` | User visits the Buy Followers page — top of follower-purchase conversion funnel | `app/routes/buy-followers.tsx` |
| `follower_package_selected` | User selects a follower package, with price and quantity properties | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower purchase, with package price and total followers | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User removes their like from a post in the feed | `app/components/PostCard.tsx` |
| `follower_followed_back` | User clicks Follow Back on a bot follower on the profile page | `app/routes/profile.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1818221)
- [Follower purchase funnel](https://us.posthog.com/project/483112/insights/n3vAnlyt) — 3-step conversion funnel: page view → package selected → purchased
- [Followers purchased over time](https://us.posthog.com/project/483112/insights/fMNMKlp2) — daily bar chart of completed purchases
- [Post engagement (likes vs unlikes)](https://us.posthog.com/project/483112/insights/53UWfrTI) — line chart comparing likes and unlikes over time
- [Package selection breakdown](https://us.posthog.com/project/483112/insights/m4bCHurw) — which package price points users select most
- [Profile follow-back activity](https://us.posthog.com/project/483112/insights/NyUwYBUe) — daily follow-back clicks on the profile page

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
