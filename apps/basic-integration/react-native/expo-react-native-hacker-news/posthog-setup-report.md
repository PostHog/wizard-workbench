<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. The integration adds the `posthog-react-native` SDK with automatic app lifecycle tracking, manual screen tracking via Expo Router, autocapture for touch events, and targeted event instrumentation across the core user flows (browsing story feeds, reading items, opening links, and viewing user profiles). Configuration is loaded via `expo-constants` from `app.config.js` extras, keeping the PostHog token out of source code.

| Event Name | Description | File |
|---|---|---|
| `story_type_changed` | User switches between story feed types (Top, Best, Ask, Show) | `components/Select.tsx` |
| `post_opened` | User taps a post title or comments button to open the item detail screen | `components/posts/Post.tsx` |
| `external_link_opened` | User opens an external URL from a post or item detail page | `components/posts/Post.tsx` |
| `post_upvoted` | User taps the upvote button on a post in the feed | `components/posts/Post.tsx` |
| `item_upvoted` | User taps the upvote button on the item detail page | `app/[itemId].tsx` |
| `item_link_opened` | User opens the external link from an item detail page | `app/[itemId].tsx` |
| `user_profile_viewed` | User taps on a username to view the author's profile | `app/[itemId].tsx` |
| `comments_page_loaded` | User loads the next page of comments while scrolling the item detail | `components/comments/comments.tsx` |

## Next steps

To monitor engagement, create a dashboard in PostHog with these recommended insights:

1. **Story feed preference** — Breakdown of `story_type_changed` by `story_type` property (pie or bar chart) — shows which feed type is most popular.
2. **Post engagement funnel** — Funnel from `post_opened` → `external_link_opened` or `item_link_opened` — measures how many readers follow through to the source article.
3. **Post opens over time** — Trend of `post_opened` events — tracks daily active reading sessions.
4. **Upvote activity** — Combined trend of `post_upvoted` + `item_upvoted` events — measures content appreciation.
5. **Comment depth engagement** — Trend of `comments_page_loaded` — shows how deeply users read comment threads.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
