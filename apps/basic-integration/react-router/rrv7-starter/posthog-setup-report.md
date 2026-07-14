# PostHog post-wizard report

The wizard completed a React Router v7 framework-mode PostHog integration with client and server initialization, error capture, event instrumentation for key conversion and engagement flows, environment variable setup, and a saved PostHog dashboard with five insights. The browser SDK now initializes in `app/entry.client.tsx`, the server SDK now initializes through middleware in `app/lib/posthog-middleware.ts`, the root error boundary captures exceptions, and product events were added to the home, feed, purchase, profile, and header flows. The Vite SSR config was also updated so the PostHog React packages are handled correctly in framework mode.

| Event name | Description | File |
| --- | --- | --- |
| `home_cta_clicked` | Captures when a visitor clicks a primary call-to-action from the home page. | `app/routes/home.tsx` |
| `feed_post_liked` | Captures when a visitor likes a post in the feed. | `app/components/PostCard.tsx` |
| `followers_package_selected` | Captures when a visitor selects a fake follower package to purchase. | `app/routes/buy-followers.tsx` |
| `followers_purchase_completed` | Captures when a fake follower purchase flow finishes successfully. | `app/routes/buy-followers.tsx` |
| `bot_follower_followed_back` | Captures when a visitor follows back one of the suggested bot followers. | `app/routes/profile.tsx` |
| `profile_avatar_opened` | Captures when a visitor opens the profile from the header avatar shortcut. | `app/components/header.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events instrumented in this run:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846834)
- [Home CTA clicks (wizard)](https://us.posthog.com/project/483112/insights/XVgAGyhx)
- [Follower package selection by tier (wizard)](https://us.posthog.com/project/483112/insights/C9dv7FpT)
- [Follower purchase completions (wizard)](https://us.posthog.com/project/483112/insights/vcJ9qSF8)
- [CTA to purchase funnel (wizard)](https://us.posthog.com/project/483112/insights/je9pYiQX)
- [Engagement actions (wizard)](https://us.posthog.com/project/483112/insights/hiEkC7ng)

A PostHog notebook copy could not be created because the current MCP credentials are missing the `notebook:write` scope required for `notebooks-create`.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

An agent skill folder was left in the project under `.claude/skills/integration-react-react-router-7-framework`. This can be reused in future agent-driven work to keep PostHog integration changes aligned with the latest recommended approach.
