# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for **CloutHub**, a React Router v7 Framework mode application. PostHog is now initialized in `app/entry.client.tsx` with the `PostHogProvider` wrapping the app, enabling autocapture, session replay, and manual event capture across the app. A reverse proxy for `/ingest` was added to `vite.config.ts` to route analytics through your own domain (avoiding ad blockers). Error tracking was added to the root `ErrorBoundary`. Seven meaningful user-action events are instrumented across the main conversion path and engagement flows.

| Event name | Description | File |
|---|---|---|
| `buy_followers_page_viewed` | User views the Buy Fake Followers page, marking the top of the purchase conversion funnel. | `app/routes/buy-followers.tsx` |
| `follower_package_selected` | User selects a follower package on the buy followers page. | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower package purchase. | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed. | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a previously liked post in the feed. | `app/components/PostCard.tsx` |
| `user_followed_back` | User clicks the Follow Back button on a bot follower in their profile. | `app/routes/profile.tsx` |
| `home_cta_clicked` | User clicks a call-to-action button on the homepage (View Feed or Buy Fake Followers). | `app/routes/home.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1901901)
- [Follower purchase funnel (wizard)](https://us.posthog.com/project/483112/insights/cARRU6kU)
- [Followers purchased over time (wizard)](https://us.posthog.com/project/483112/insights/fkvy7R0R)
- [Post engagement (wizard)](https://us.posthog.com/project/483112/insights/3jQrOSVh)
- [Home CTA clicks by type (wizard)](https://us.posthog.com/project/483112/insights/KWrxuOFT)
- [Follow-backs over time (wizard)](https://us.posthog.com/project/483112/insights/HlccM2jE)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
