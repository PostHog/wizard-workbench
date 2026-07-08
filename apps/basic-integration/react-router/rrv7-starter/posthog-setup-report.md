# PostHog post-wizard report

The wizard has completed a PostHog integration for CloutHub, a React Router v7 (Framework mode) app. The integration adds client-side product analytics via `posthog-js` and `@posthog/react`, initialised in a new `app/entry.client.tsx` entry point. Seven business-critical events are now tracked across the follower purchase funnel, feed engagement, and profile interactions. Error boundaries are instrumented with `captureException` for automatic error tracking.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `buy_followers_page_viewed` | User viewed the Buy Followers page, the top of the follower purchase funnel. | `app/routes/buy-followers.tsx` |
| `follower_package_selected` | User selected a follower package on the Buy Followers page. | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completed a fake follower purchase with a chosen package. | `app/routes/buy-followers.tsx` |
| `post_liked` | User liked a post in the feed. | `app/components/PostCard.tsx` |
| `post_unliked` | User unliked a post in the feed. | `app/components/PostCard.tsx` |
| `follower_followed_back` | User followed back a bot follower on the profile page. | `app/routes/profile.tsx` |
| `analytics_page_viewed` | User viewed the Analytics dashboard page. | `app/routes/analytics.tsx` |

## Files created or modified

- **`app/entry.client.tsx`** *(created)* — initialises PostHog with `posthog.init()` and wraps `HydratedRouter` in `PostHogProvider`.
- **`app/root.tsx`** — added `usePostHog()` + `captureException(error)` in `ErrorBoundary`.
- **`app/routes/buy-followers.tsx`** — added `buy_followers_page_viewed`, `follower_package_selected`, and `followers_purchased` capture calls.
- **`app/components/PostCard.tsx`** — added `post_liked` / `post_unliked` capture in `handleLike`.
- **`app/routes/profile.tsx`** — added `follower_followed_back` capture in `FollowButton`.
- **`app/routes/analytics.tsx`** — added `analytics_page_viewed` capture on mount.
- **`vite.config.ts`** — added `posthog-js` and `@posthog/react` to `ssr.noExternal` for dev mode.
- **`.env`** *(created)* — `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1818307)
- [Follower Purchase Funnel (wizard)](https://us.posthog.com/project/483112/insights/vZScbRrS)
- [Followers Purchased Over Time (wizard)](https://us.posthog.com/project/483112/insights/FZPexIDC)
- [Post Engagement (wizard)](https://us.posthog.com/project/483112/insights/QhsHJBuG)
- [Package Selection Breakdown (wizard)](https://us.posthog.com/project/483112/insights/uk3lhYmQ)
- [Follow-backs on Profile (wizard)](https://us.posthog.com/project/483112/insights/CPLgSkj5)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
