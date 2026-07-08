# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloutHub, a satirical fake influencer social network built with React Router v7 Framework mode. PostHog is initialized client-side in `app/entry.client.tsx` with `PostHogProvider` wrapping the whole app, enabling the `usePostHog()` hook across all routes. Eight events covering the complete purchase funnel, social engagement, and navigation CTAs were instrumented. Error tracking was added to the root `ErrorBoundary`. A reverse proxy was configured in `vite.config.ts` to route PostHog requests through `/ingest`.

| Event name | Description | File |
|---|---|---|
| `buy_followers_cta_clicked` | User clicks the "Buy Fake Followers" CTA on the home page, entering the purchase funnel. | `app/routes/home.tsx` |
| `view_feed_cta_clicked` | User clicks the "View Feed" button on the home page. | `app/routes/home.tsx` |
| `buy_followers_nav_clicked` | User clicks the "Buy Followers" button in the site header navigation. | `app/components/header.tsx` |
| `follower_package_selected` | User selects a follower package on the buy-followers page. | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes the purchase of a fake follower package. | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the social feed. | `app/components/PostCard.tsx` |
| `post_unliked` | User removes their like from a post in the social feed. | `app/components/PostCard.tsx` |
| `user_followed` | User follows back a bot follower on their profile page. | `app/routes/profile.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1816759)
- [Follower purchase funnel](https://us.posthog.com/project/483112/insights/RmCnGcpl) — conversion from home CTA → package selection → purchase
- [Followers purchased trend](https://us.posthog.com/project/483112/insights/3qZaNz06) — daily purchase volume
- [Package selection by type](https://us.posthog.com/project/483112/insights/ephFLSJy) — which packages users select most (broken down by package index)
- [Feed engagement (post likes)](https://us.posthog.com/project/483112/insights/xH5k0Ycq) — post likes and unlikes over time
- [Buy followers entry points](https://us.posthog.com/project/483112/insights/wTMU8XQK) — home CTA vs header nav clicks comparison

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
