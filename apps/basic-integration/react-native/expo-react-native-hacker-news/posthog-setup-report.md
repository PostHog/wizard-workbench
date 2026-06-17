# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. A new `PostHogProvider` wraps the app in `app/_layout.tsx`, with manual screen tracking via `posthog.screen()` on every route change (required for Expo Router / React Navigation v7 compatibility). A dedicated client module at `src/config/posthog.ts` initialises the SDK from environment variables injected through `app.config.js` extras. Eight custom events were added across four files to capture the most valuable user interactions in this HN reader — story feed changes, post and link taps, upvotes, profile views, and comment-chain navigation.

| Event | Description | File |
|---|---|---|
| `story_type_changed` | User changes the story feed (top, best, ask, show) | `components/Select.tsx` |
| `post_tapped` | User taps a post title or comments button to open item details | `components/posts/Post.tsx` |
| `external_link_opened` | User opens an external URL from the post list | `components/posts/Post.tsx` |
| `item_upvoted` | User taps the upvote button on an item detail screen | `app/[itemId].tsx` |
| `item_link_opened` | User opens the external URL from an item detail screen | `app/[itemId].tsx` |
| `comment_author_tapped` | User taps the author name in item details to view their profile | `app/[itemId].tsx` |
| `parent_item_navigated` | User taps the "Commented on" parent link to navigate up the comment chain | `app/[itemId].tsx` |
| `user_profile_viewed` | User navigates to a HN user's profile page | `app/users/[userId].tsx` |

## Next steps

Create a **"Analytics basics (wizard)"** dashboard in PostHog and add these five insights:

1. **Story feed engagement** — Trends: `story_type_changed` broken down by `story_type`. Shows which feeds (top/best/ask/show) drive the most engagement.
2. **Content engagement funnel** — Funnel: `post_tapped` → `item_upvoted`. Measures how many users who view an item also upvote it.
3. **External link click rate** — Trends: `external_link_opened` vs `post_tapped` as a formula `A/B*100`. Surfaces what fraction of post views result in an outbound click.
4. **User profile discovery** — Trends: `user_profile_viewed` over time. Tracks social exploration behaviour.
5. **Comment-chain depth navigation** — Trends: `parent_item_navigated` over time. Shows how often users follow comment threads up to parent items.

[Create a new dashboard →](https://us.posthog.com/project/2/dashboard)
[Create insights →](https://us.posthog.com/project/2/insights/new)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any CI/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
