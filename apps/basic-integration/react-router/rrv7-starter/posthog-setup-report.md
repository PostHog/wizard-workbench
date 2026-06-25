# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router v7 (Framework mode) project. The following changes were made:

- **`app/entry.client.tsx`** (created): Initializes `posthog-js` with the project token and host, enables cross-domain tracing headers, and wraps the app in `PostHogProvider` so all components can access PostHog via the `usePostHog` hook.
- **`app/lib/posthog-middleware.ts`** (created): Server-side middleware that creates a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers from the client, and uses `withContext()` to correlate server events with the correct user session.
- **`app/root.tsx`**: Registers the PostHog middleware and adds `captureException` to the `ErrorBoundary` for automatic error tracking.
- **`react-router.config.ts`**: Enabled the `v8_middleware` future flag to support middleware.
- **`vite.config.ts`**: Added `posthog-js` and `@posthog/react` to `ssr.noExternal` to prevent SSR bundling issues.
- **`env.d.ts`**: Added TypeScript types for `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` values.
- **`app/routes/buy-followers.tsx`**: Tracks package selection and purchase completion with full package metadata.
- **`app/components/PostCard.tsx`**: Tracks post likes and unlikes with post ID and author.
- **`app/routes/profile.tsx`**: Tracks follow-back actions on bot followers.
- **`app/routes/home.tsx`**: Tracks CTA button clicks with the CTA name.
- **`app/routes/feed.tsx`**: Tracks when users view the feed (top of engagement funnel).
- **`app/routes/analytics.tsx`**: Tracks when users view the analytics dashboard.

## Events

| Event name | Description | File |
|---|---|---|
| `follower_package_selected` | User selects a follower package on the buy followers page. | `app/routes/buy-followers.tsx` |
| `follower_purchase_completed` | User completes a fake follower purchase, including package details and total followers added. | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes or unlikes a post in their feed. | `app/components/PostCard.tsx` |
| `follower_followed_back` | User clicks the follow-back button on a bot follower from their profile page. | `app/routes/profile.tsx` |
| `cta_clicked` | User clicks a primary call-to-action button on the home page. | `app/routes/home.tsx` |
| `analytics_dashboard_viewed` | User views the analytics dashboard page. | `app/routes/analytics.tsx` |
| `feed_viewed` | User views the feed page, marking the top of the content engagement funnel. | `app/routes/feed.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1760766)
- **Follower purchase funnel**: [oK27zPlH](https://us.i.posthog.com/project/483112/insights/oK27zPlH)
- **Post likes over time**: [pFpY5OZF](https://us.i.posthog.com/project/483112/insights/pFpY5OZF)
- **Follow-backs over time**: [GxNqPSp5](https://us.i.posthog.com/project/483112/insights/GxNqPSp5)
- **Feed views over time**: [se6yDD4t](https://us.i.posthog.com/project/483112/insights/se6yDD4t)
- **Purchases by package size**: [VkNn6nOD](https://us.i.posthog.com/project/483112/insights/VkNn6nOD)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any CI/deployment environment configuration so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
