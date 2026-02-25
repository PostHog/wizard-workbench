<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **Hacker Native** Expo application. The integration includes:

- **PostHog SDK installed** — `posthog-react-native` and all required Expo peer dependencies (`expo-file-system`, `expo-application`, `expo-device`, `expo-localization`)
- **PostHog client configured** — `src/config/posthog.ts` initialises the SDK using `expo-constants` to safely read API credentials from `app.config.js` extras (environment variables are embedded at build time, never hardcoded)
- **Dynamic app config** — `app.config.js` extends `app.json` to inject `POSTHOG_API_KEY` and `POSTHOG_HOST` into `Constants.expoConfig.extra` at build time
- **PostHogProvider added** — `app/_layout.tsx` wraps the entire app in `<PostHogProvider>` with autocapture enabled for touch events
- **Manual screen tracking** — `app/_layout.tsx` uses `usePathname` + `useGlobalSearchParams` to call `posthog.screen()` on every Expo Router navigation (required for `@react-navigation/native` v7)
- **10 custom events instrumented** across 5 files covering the complete user journey from feed browsing to comment engagement

| Event | Description | File |
|---|---|---|
| `story_filter_changed` | User changes the story type feed (Top, Best, Ask, or Show stories) | `app/index.tsx` |
| `post_opened` | User opens a post's discussion/detail page from the story feed | `components/posts/Post.tsx` |
| `post_external_link_opened` | User opens a post's external URL from the story feed list | `components/posts/Post.tsx` |
| `item_external_link_opened` | User opens the story's external URL from the item detail view | `app/[itemId].tsx` |
| `item_upvote_tapped` | User taps the upvote button on an item detail page | `app/[itemId].tsx` |
| `parent_story_navigated` | User navigates to the parent story from a comment detail page | `app/[itemId].tsx` |
| `user_profile_viewed` | User taps on a commenter's username to view their profile | `components/comments/comment.tsx` |
| `comment_subthread_opened` | User taps the comments count on a comment to open that comment's subthread | `components/comments/comment.tsx` |
| `comment_upvote_tapped` | User taps the upvote button on a comment | `components/comments/comment.tsx` |
| `more_stories_loaded` | User scrolls to end of story feed, triggering the next page to load | `components/posts/Posts.tsx` |

## Next steps

We've prepared five insights for you to add to an **"Analytics basics"** dashboard in your PostHog project. Navigate to your project and create each one:

- **[PostHog Project Dashboard](https://us.posthog.com/project/238460/dashboards)** — Create a new "Analytics basics" dashboard here, then add the insights below.

### Recommended insights

1. **[Content engagement funnel](https://us.posthog.com/project/238460/insights/new#{"insight":"FUNNELS","events":[{"id":"post_opened","name":"post_opened","type":"events","order":0},{"id":"item_external_link_opened","name":"item_external_link_opened","type":"events","order":1}]})** — Funnel: `post_opened` → `item_external_link_opened`. Shows what percentage of users who open a story click through to the external content.

2. **[Story feed preferences](https://us.posthog.com/project/238460/insights/new)** — Trend of `story_filter_changed` broken down by `story_type` property. Reveals which feed (Top, Best, Ask, Show) is most popular among your users.

3. **[External link click rate](https://us.posthog.com/project/238460/insights/new)** — Trend combining `post_external_link_opened` + `item_external_link_opened`. Tracks how often users click through to external content overall.

4. **[Comment engagement](https://us.posthog.com/project/238460/insights/new)** — Trend of `comment_upvote_tapped` + `comment_subthread_opened`. Shows how actively users engage with the comment threads.

5. **[User profile discovery](https://us.posthog.com/project/238460/insights/new)** — Trend of `user_profile_viewed`. Measures how frequently users explore commenter profiles, a proxy for community interest.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
