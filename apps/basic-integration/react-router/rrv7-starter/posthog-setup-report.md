<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for **CloutHub**, a React Router v7 (Framework mode) application. PostHog is initialized client-side in `app/entry.client.tsx` with the `PostHogProvider` wrapping the entire app, enabling the `usePostHog()` hook across all routes. Vite was configured with SSR noExternal rules and a dev proxy for the PostHog ingestion endpoint. Seven business events were instrumented across five files, covering the full follower-purchase conversion funnel, social engagement actions, and an error boundary capture.

| Event | Description | File |
|---|---|---|
| `buy_followers_page_viewed` | User viewed the Buy Fake Followers page — top of the purchase funnel | `app/routes/buy-followers.tsx` |
| `follower_package_selected` | User selected a follower package tier (with price, amount, bonus properties) | `app/routes/buy-followers.tsx` |
| `fake_followers_purchased` | User completed a fake follower purchase — the key conversion event | `app/routes/buy-followers.tsx` |
| `post_liked` | User liked a post in the feed (with post_id, post_username) | `app/components/PostCard.tsx` |
| `post_unliked` | User removed their like from a post in the feed | `app/components/PostCard.tsx` |
| `user_followed_back` | User clicked Follow Back on a fake follower from the profile page | `app/routes/profile.tsx` |
| `buy_followers_cta_clicked` | User clicked the Buy Followers CTA button in the site header | `app/components/header.tsx` |

Error tracking via `posthog.captureException()` was added to the root `ErrorBoundary` in `app/root.tsx`.

## Next steps

We've built some insights and added them to your PostHog dashboard to keep an eye on user behavior:

- [Your starter dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- [Follower purchase funnel](https://us.posthog.com/project/483112/insights/7C3x91Se)
- [CTA to purchase conversion](https://us.posthog.com/project/483112/insights/lOmSbmbR)
- [Post engagement trend](https://us.posthog.com/project/483112/insights/IB048QQp)
- [Social actions trend](https://us.posthog.com/project/483112/insights/GQvU97X8)
- [Fake followers purchased](https://us.posthog.com/project/483112/insights/3Y0eU3Uq)

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
