<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloutHub, a React Router v7 (Framework mode) fake influencer social network. The integration adds client-side event tracking, error boundary capture, and a PostHog dashboard with five key insights.

**Changes made:**

- **`app/entry.client.tsx`** (new): Initializes `posthog-js` with the project token and host from environment variables, wraps the app in `PostHogProvider` for React hook access, and enables tracing headers for session correlation.
- **`app/root.tsx`**: Adds `usePostHog` to the `ErrorBoundary` to capture unhandled exceptions via `posthog.captureException()`.
- **`vite.config.ts`**: Adds `posthog-js` and `@posthog/react` to the SSR `noExternal` list to prevent SSR bundling errors in dev mode.
- **`app/routes/buy-followers.tsx`**: Tracks `follower_package_selected` when a user clicks a package, and `follower_purchase_completed` when the fake purchase flow completes.
- **`app/components/PostCard.tsx`**: Tracks `post_liked` and `post_unliked` when a user toggles likes on feed posts.
- **`app/routes/profile.tsx`**: Tracks `follower_followed_back` when a user follows back one of their bot followers.
- **`app/routes/home.tsx`**: Tracks `view_feed_cta_clicked` and `buy_followers_cta_clicked` on the hero section CTAs.
- **`.env`** (new): Stores `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

| Event Name | Description | File |
|---|---|---|
| `follower_package_selected` | User selects a follower package on the buy followers page. | `app/routes/buy-followers.tsx` |
| `follower_purchase_completed` | User completes a fake follower purchase after clicking the buy button. | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed. | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a previously liked post in the feed. | `app/components/PostCard.tsx` |
| `follower_followed_back` | User follows back a bot follower on their profile page. | `app/routes/profile.tsx` |
| `buy_followers_cta_clicked` | User clicks the Buy Fake Followers call-to-action on the home page hero. | `app/routes/home.tsx` |
| `view_feed_cta_clicked` | User clicks the View Feed call-to-action on the home page hero. | `app/routes/home.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.i.posthog.com/project/483112/dashboard/1761269)
- [Follower Purchase Funnel](https://us.i.posthog.com/project/483112/insights/3qt4A6jS)
- [Follower Purchases Over Time](https://us.i.posthog.com/project/483112/insights/ty0Ax5fY)
- [Post Likes & Unlikes Over Time](https://us.i.posthog.com/project/483112/insights/egA6kDIJ)
- [Followers Followed Back Over Time](https://us.i.posthog.com/project/483112/insights/YJt3pXeN)
- [Top Follower Packages Selected](https://us.i.posthog.com/project/483112/insights/kIerBOPp)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
