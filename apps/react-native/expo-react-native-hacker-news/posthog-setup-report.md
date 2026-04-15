<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. The SDK is initialized via `src/config/posthog.ts` using `expo-constants` to read credentials from `app.config.js` extras, which in turn reads from environment variables. A `PostHogProvider` wraps the app in `app/_layout.tsx` with autocapture enabled for touch events and manual screen tracking via `posthog.screen()` on every route change. Eight custom events track the most meaningful user interactions across the feed, post detail, and user profile screens.

| Event | Description | File |
|---|---|---|
| `story_type_changed` | User switches between story feed types (top, best, ask, show) | `components/Select.tsx` |
| `post_opened` | User taps a post title to navigate to its in-app detail view | `components/posts/Post.tsx` |
| `post_link_opened` | User opens an external URL from a post in the feed | `components/posts/Post.tsx` |
| `post_upvoted` | User taps the upvote button on a post in the feed | `components/posts/Post.tsx` |
| `item_upvoted` | User taps the upvote button on the item detail screen | `app/[itemId].tsx` |
| `item_link_opened` | User opens an external URL from the item detail screen | `app/[itemId].tsx` |
| `user_profile_viewed` | User taps a username to view their profile | `app/[itemId].tsx` |
| `parent_item_navigated` | User taps the "Commented on" banner to navigate to the parent item | `app/[itemId].tsx` |

## Next steps

To monitor user behavior in PostHog, create an **"Analytics basics"** dashboard with these recommended insights:

1. **Post engagement funnel** — Funnel: `post_opened` → `item_upvoted` (measures how many users who open posts go on to upvote)
2. **External link click rate** — Trend: `post_link_opened` + `item_link_opened` over time (tracks outbound traffic)
3. **Story type distribution** — Breakdown of `story_type_changed` by `story_type` property (shows which feed types are most used)
4. **User profile discovery** — Trend: `user_profile_viewed` over time (measures social exploration)
5. **Upvote activity** — Trend: `post_upvoted` + `item_upvoted` over time (overall engagement signal)

You can create these in your PostHog project at **https://us.i.posthog.com** under **Insights** and pin them to a new dashboard named "Analytics basics".

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
