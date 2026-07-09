# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloutHub, a satirical fake influencer social network built with React Router v7 (Framework mode). The integration covers client-side event tracking, server-side middleware for request correlation, user identification, error tracking, and a reverse proxy configuration to avoid ad blockers.

## Files created or modified

| File | Change |
|---|---|
| `app/entry.client.tsx` | **Created** — PostHog JS initialized with `PostHogProvider` wrapping `HydratedRouter`; reverse proxy (`/ingest`) configured |
| `app/lib/posthog-middleware.ts` | **Created** — Server-side PostHog Node middleware: creates a PostHog client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers, and sets context for server-side capture |
| `app/root.tsx` | **Modified** — Middleware array exported; `usePostHog` + `identify` called on mount; `captureException` added to `ErrorBoundary` |
| `app/components/header.tsx` | **Modified** — `buy_followers_cta_clicked` captured on Buy Followers button click |
| `app/components/PostCard.tsx` | **Modified** — `post_liked` captured on like/unlike toggle |
| `app/routes/buy-followers.tsx` | **Modified** — `follower_package_selected` on package selection; `followers_purchased` on purchase completion |
| `app/routes/profile.tsx` | **Modified** — `follower_followed_back` captured when a user follows back a bot follower |
| `react-router.config.ts` | **Modified** — `future.v8_middleware: true` enabled |
| `vite.config.ts` | **Modified** — Reverse proxy for `/ingest`, `/ingest/static`, `/ingest/array`; `noExternal` extended for `posthog-js` and `@posthog/react` |
| `.env` | **Created** — `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` set |

## Events tracked

| Event name | Description | File |
|---|---|---|
| `follower_package_selected` | User selects a follower package on the buy followers page. | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower purchase. | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes or unlikes a post in the feed. | `app/components/PostCard.tsx` |
| `follower_followed_back` | User clicks Follow Back on a follower in their profile. | `app/routes/profile.tsx` |
| `buy_followers_cta_clicked` | User clicks the Buy Followers CTA button in the header. | `app/components/header.tsx` |

## Next steps

We've built a dashboard and five insights to keep an eye on user behavior:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824590)
- [Follower purchase funnel (wizard)](https://us.posthog.com/project/483112/insights/gN7cfllJ) — Conversion from package selection to purchase
- [Followers purchased over time (wizard)](https://us.posthog.com/project/483112/insights/u9CKU3ym) — Daily purchase completions
- [Post likes over time (wizard)](https://us.posthog.com/project/483112/insights/AupADiUE) — Feed engagement trend
- [Buy Followers CTA clicks (wizard)](https://us.posthog.com/project/483112/insights/5IzauGdd) — Header CTA click volume
- [Package selection by size (wizard)](https://us.posthog.com/project/483112/insights/kQ65aL1C) — Which package sizes users prefer

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any CI/deployment configuration so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog Error Tracking.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
