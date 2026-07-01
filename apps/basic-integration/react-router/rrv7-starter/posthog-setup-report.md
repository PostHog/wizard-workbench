# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloutHub React Router v7 (Framework mode) app. Here is a summary of what was changed:

- **`app/entry.client.tsx`** (created): Initializes `posthog-js` with your project token and host, wraps the React app in `PostHogProvider` for hooks access throughout the component tree, and enables `__add_tracing_headers` so client session/distinct IDs flow automatically to server-side requests.
- **`app/lib/posthog-middleware.ts`** (created): A React Router v7 middleware that creates a `posthog-node` client per request, extracts session/distinct ID headers set by the client SDK, and makes the client available on the request context via `context.posthog`.
- **`app/root.tsx`** (updated): Exports the `posthogMiddleware` so it runs for all routes, and calls `posthog.captureException(error)` in the `ErrorBoundary` for automatic error tracking.
- **`react-router.config.ts`** (updated): Added `future: { v8_middleware: true }` to enable the React Router v7 middleware API.
- **`vite.config.ts`** (updated): Added `posthog-js` and `@posthog/react` to `ssr.noExternal` for the dev server so SSR bundling works correctly.
- **`app/routes/buy-followers.tsx`** (updated): Captures `follower_package_selected` when a user clicks a package card, and `followers_purchased` when the fake purchase completes — the core conversion funnel.
- **`app/components/PostCard.tsx`** (updated): Captures `post_liked` and `post_unliked` when users interact with posts in the feed.
- **`app/routes/profile.tsx`** (updated): Captures `follow_back_clicked` when a user follows back a bot follower.

| Event | Description | File |
|---|---|---|
| `follower_package_selected` | User clicks on a follower package card to select it on the buy followers page. | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower purchase after selecting a package. | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed. | `app/components/PostCard.tsx` |
| `post_unliked` | User removes their like from a post in the feed. | `app/components/PostCard.tsx` |
| `follow_back_clicked` | User clicks the Follow back button on a bot follower in their profile. | `app/routes/profile.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1787487)
- [Follower Purchase Conversion Funnel](https://us.posthog.com/project/483112/insights/Vnb3FAyw)
- [Total Followers Purchased](https://us.posthog.com/project/483112/insights/TcomUEa4)
- [Post Engagement (Likes) Trend](https://us.posthog.com/project/483112/insights/l1G1Xx4J)
- [Follow Back Actions](https://us.posthog.com/project/483112/insights/y0iUQPwc)
- [Revenue from Follower Purchases](https://us.posthog.com/project/483112/insights/UoPAqt8xagentId)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
