# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloutHub React Router v7 application. PostHog SDK was installed, environment variables configured, and event tracking instrumented across key user flows including follower purchases, post engagement, and profile actions.

| Event Name | Description | File |
|---|---|---|
| `post_liked` | User likes or unlikes a post in the feed | `app/components/PostCard.tsx` |
| `buy_followers_page_viewed` | User views the Buy Fake Followers page (top of purchase funnel) | `app/routes/buy-followers.tsx` |
| `follower_package_selected` | User selects a follower package on the buy followers page | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower purchase after selecting a package | `app/routes/buy-followers.tsx` |
| `user_followed` | User clicks Follow Back on a follower listed on their profile page | `app/routes/profile.tsx` |
| `analytics_dashboard_viewed` | User views the analytics dashboard (interest in fake metrics) | `app/routes/analytics.tsx` |

## Next steps

Dashboard creation was attempted via the PostHog MCP server (PostHog project 2, host: https://us.i.posthog.com). The MCP server confirmed that `dashboard-create` and `insight-create` are scope-gated and require `dashboard:write` and `insight:write` scopes respectively. The available API key (Wizard CI GitHub) has only read scopes (`dashboard:read`, `project:read`, `user:read`, `event_definition:read`, `llm_gateway:read`) and cannot create resources.

To create the intended dashboard and insights, use a PostHog personal API key with `dashboard:write` and `insight:write` scopes and call:
- `dashboard-create` with name: "Analytics basics (wizard)"
- `insight-create` for each of the following insights, associating them with the created dashboard ID:
  1. **Follower Purchase Funnel** — funnel: `buy_followers_page_viewed` → `follower_package_selected` → `followers_purchased`
  2. **Followers Purchased Over Time** — trends: `followers_purchased` count over time
  3. **Post Likes Over Time** — trends: `post_liked` where `liked = true`, count over time
  4. **Top Actions on Profile** — trends: `user_followed` over time
  5. **Analytics Dashboard Views** — trends: `analytics_dashboard_viewed` over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
