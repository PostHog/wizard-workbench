# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into CloutHub, a React Router v7 (Framework mode) application. A new `app/entry.client.tsx` was created to initialize PostHog and wrap the app with `PostHogProvider`. A reverse proxy was wired through `/ingest` in `vite.config.ts` for ad-blocker resilience. Eight client-side events were instrumented across the key user flows — follower package selection and purchase, post likes/unlikes, following back, analytics page views, and home-page CTA clicks. Error tracking was added to the global `ErrorBoundary` in `root.tsx`. Environment variables were written to `.env` and typed in `env.d.ts`.

| Event | Description | File |
|---|---|---|
| `follower_package_selected` | User selects a follower package on the buy followers page | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower purchase with package details | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a post in the feed | `app/components/PostCard.tsx` |
| `user_followed_back` | User follows back a follower from the profile page | `app/routes/profile.tsx` |
| `analytics_viewed` | User views the analytics dashboard (top of conversion funnel) | `app/routes/analytics.tsx` |
| `buy_followers_cta_clicked` | User clicks the Buy Fake Followers CTA on the home page | `app/routes/home.tsx` |
| `feed_cta_clicked` | User clicks the View Feed CTA on the home page | `app/routes/home.tsx` |

## Next steps

The PostHog API key used during setup was missing `dashboard:write` and `query:read` scopes, so the dashboard could not be created automatically. Create it manually as **"Analytics basics (wizard)"** using the links below:

- [Create new dashboard](https://us.posthog.com/project/2/dashboard)
- [Create new insight](https://us.posthog.com/project/2/insights/new)

Suggested insights for the dashboard:

1. **Follower purchase funnel** — Funnel: `buy_followers_cta_clicked` → `follower_package_selected` → `followers_purchased`
2. **Followers purchased over time** — Trend of `followers_purchased` events, broken down by `package_price`
3. **Feed engagement** — Trend of `post_liked` and `post_unliked` events over time
4. **Home page CTA clicks** — Trend comparing `feed_cta_clicked` vs `buy_followers_cta_clicked`
5. **Analytics page views** — Trend of `analytics_viewed` to track interest in the analytics section

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
