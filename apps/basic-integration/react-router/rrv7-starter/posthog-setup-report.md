# PostHog post-wizard report

The wizard has completed a PostHog analytics integration for CloutHub — a React Router v7 (framework mode, SSR) fake influencer social network. The integration adds client-side analytics initialisation, error tracking in the global error boundary, and event capture across the key user journeys: the follower-purchase funnel, feed engagement, profile follow-backs, and home-page CTA clicks.

## Files changed

| File | Change |
|------|--------|
| `app/entry.client.tsx` | Created — initialises `posthog-js` with `PostHogProvider` wrapping `HydratedRouter` |
| `app/root.tsx` | Added `usePostHog` import; added `posthog?.captureException(error)` in `ErrorBoundary` |
| `app/routes/buy-followers.tsx` | Added `usePostHog`; captures `buy_followers_page_viewed`, `buy_followers_package_selected`, `buy_followers_completed` |
| `app/components/PostCard.tsx` | Added `usePostHog`; captures `post_liked` and `post_unliked` in the like handler |
| `app/routes/profile.tsx` | Added `usePostHog` in `FollowButton`; captures `follower_followed_back` on click |
| `app/routes/home.tsx` | Added `usePostHog`; captures `buy_followers_cta_clicked` and `feed_cta_clicked` on the hero CTA links |
| `vite.config.ts` | Added `posthog-js` and `@posthog/react` to `ssr.noExternal` for dev mode SSR compatibility |
| `.env` | Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` |

## Events instrumented

| Event name | Description | File |
|------------|-------------|------|
| `buy_followers_page_viewed` | User navigates to the Buy Followers page, marking the start of the purchase conversion funnel. | `app/routes/buy-followers.tsx` |
| `buy_followers_package_selected` | User selects a follower package on the Buy Followers page. | `app/routes/buy-followers.tsx` |
| `buy_followers_completed` | User completes a fake follower package purchase. | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed. | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a post in the feed. | `app/components/PostCard.tsx` |
| `follower_followed_back` | User follows back one of their bot followers on the profile page. | `app/routes/profile.tsx` |
| `buy_followers_cta_clicked` | User clicks the Buy Fake Followers call-to-action button on the home page. | `app/routes/home.tsx` |
| `feed_cta_clicked` | User clicks the View Feed call-to-action button on the home page. | `app/routes/home.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1897576)
- **Follower purchase funnel**: [https://us.posthog.com/project/483112/insights/cFaChWuB](https://us.posthog.com/project/483112/insights/cFaChWuB)
- **Post likes and unlikes**: [https://us.posthog.com/project/483112/insights/JsTolB1c](https://us.posthog.com/project/483112/insights/JsTolB1c)
- **Home page CTA clicks**: [https://us.posthog.com/project/483112/insights/HL5MVIFn](https://us.posthog.com/project/483112/insights/HL5MVIFn)
- **Follower follow-backs**: [https://us.posthog.com/project/483112/insights/iQAd9UBb](https://us.posthog.com/project/483112/insights/iQAd9UBb)
- **Purchases by package size**: [https://us.posthog.com/project/483112/insights/ex8Z4Y4x](https://us.posthog.com/project/483112/insights/ex8Z4Y4x)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
