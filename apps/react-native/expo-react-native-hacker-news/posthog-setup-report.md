# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Hacker Native, a React Native Expo app for browsing Hacker News. The integration covers app lifecycle tracking, manual screen tracking via Expo Router, and custom event capture across all key user interactions including story browsing, post engagement, external link clicks, comment pagination, and user profile navigation.

## Changes Summary

- **`app.config.js`** (new): Converts the project from `app.json` to a JS config to inject PostHog credentials via `process.env` into `Constants.expoConfig.extra`.
- **`src/config/posthog.ts`** (new): Initializes the PostHog singleton client with app lifecycle capture, disabled gracefully when no API key is configured.
- **`app/_layout.tsx`** (modified): Wraps the app with `PostHogProvider`, and adds `LayoutWithPostHog` inner component for manual screen tracking using `usePathname` + `useGlobalSearchParams`.
- **`components/Select.tsx`** (modified): Tracks story type selection changes.
- **`components/posts/Post.tsx`** (modified): Tracks post opens, external link clicks, and comments button taps.
- **`app/[itemId].tsx`** (modified): Tracks user profile views, external URL clicks, and parent item navigation.
- **`components/posts/Posts.tsx`** (modified): Tracks pagination ("load more") events for post lists.
- **`components/comments/comments.tsx`** (modified): Tracks pagination ("load more") events for comment threads.

## Tracked Events

| Event Name | Description | File |
|---|---|---|
| `story_type_changed` | User switches between story categories (Top, Best, Ask, Show) | `components/Select.tsx` |
| `post_opened` | User taps on an internal post (no external URL) to view its detail page | `components/posts/Post.tsx` |
| `post_link_opened` | User opens an external URL from a post title or link button | `components/posts/Post.tsx` |
| `post_comments_opened` | User taps the comments button to view comments for a post | `components/posts/Post.tsx` |
| `item_link_opened` | User opens an external URL from the item detail screen | `app/[itemId].tsx` |
| `user_profile_viewed` | User taps on an author's name to view their profile | `app/[itemId].tsx` |
| `parent_item_navigated` | User navigates from a comment to its parent item | `app/[itemId].tsx` |
| `more_posts_loaded` | User scrolls to the bottom triggering pagination in the post list | `components/posts/Posts.tsx` |
| `more_comments_loaded` | User scrolls to the bottom triggering pagination in the comments list | `components/comments/comments.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior. To create the **"Analytics basics"** dashboard in PostHog, visit your project and add the following insights:

**Dashboard:** [Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboards)

Once you've created a new dashboard, add these insights:

1. **Post Engagement Trends** — Trend of `post_opened` and `post_link_opened` events over time. Shows whether users prefer internal posts vs. external link posts.

2. **Story Type Popularity** — Breakdown of `story_type_changed` events by `story_type` property (topstories, beststories, askstories, showstories). Reveals which categories drive the most engagement.

3. **External Link Engagement** — Trend combining `post_link_opened` and `item_link_opened` events. Measures how often users leave the app to read full articles.

4. **Content Exploration Depth** — Funnel from `post_opened` → `post_comments_opened` → `more_comments_loaded`. Shows how deep users go into content (post → comments → more comments).

5. **User Profile Engagement** — Trend of `user_profile_viewed` events over time. Indicates community engagement and interest in authors.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
