# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Hacker Native Expo app. The integration includes:

- **PostHog React Native SDK** (`posthog-react-native`) installed with required Expo peer dependencies
- **PostHogProvider** configured in the root layout with manual screen tracking for expo-router
- **Environment variables** set up via `app.config.js` extras pattern with `EXPO_PUBLIC_POSTHOG_API_KEY` and `EXPO_PUBLIC_POSTHOG_HOST`
- **12 custom events** tracking user engagement across posts, comments, story browsing, and navigation
- **Automatic screen tracking** using expo-router pathname changes
- **Touch autocapture** enabled for automatic interaction tracking

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `story_type_changed` | User changed the story feed type (top, best, ask, show) | `components/Select.tsx` |
| `post_clicked` | User clicked on a post to view details or open external link | `components/posts/Post.tsx` |
| `post_upvoted` | User tapped the upvote button on a post | `components/posts/Post.tsx` |
| `external_link_opened` | User opened an external URL from a post | `components/posts/Post.tsx` |
| `comment_upvoted` | User tapped the upvote button on a comment | `components/comments/comment.tsx` |
| `comment_thread_viewed` | User navigated to view a comment thread | `components/comments/comment.tsx` |
| `user_profile_viewed` | User navigated to view another user's profile | `components/comments/comment.tsx` |
| `item_upvoted` | User tapped the upvote button on item details page | `app/[itemId].tsx` |
| `item_external_link_opened` | User opened external URL from item details page | `app/[itemId].tsx` |
| `item_author_profile_clicked` | User clicked to view the author's profile from item details | `app/[itemId].tsx` |
| `parent_item_navigated` | User navigated to view parent item from a comment | `app/[itemId].tsx` |
| `posts_loaded_more` | User scrolled to load more posts in the feed | `components/posts/Posts.tsx` |

## Configuration Files

- `app.config.js` - Expo configuration with PostHog environment variables
- `src/config/posthog.ts` - PostHog client configuration
- `app/_layout.tsx` - PostHogProvider and screen tracking setup
- `.env` - Environment variables (API key and host)

## Next steps

We recommend creating the following insights in your PostHog dashboard to monitor user behavior:

1. **Content Engagement Funnel** - Track: `post_clicked` -> `item_upvoted` or `external_link_opened`
2. **Story Type Popularity** - Breakdown of `story_type_changed` by `new_type` property
3. **User Engagement Depth** - Track `posts_loaded_more` events to measure scroll depth
4. **Profile Exploration** - Count of `user_profile_viewed` and `item_author_profile_clicked` events
5. **External Link CTR** - Ratio of `external_link_opened` to `post_clicked` events

Visit your PostHog dashboard at: https://us.i.posthog.com

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Setup

Make sure your `.env` file contains:

```env
EXPO_PUBLIC_POSTHOG_API_KEY=your_posthog_api_key
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Run the app with:

```bash
npx expo start
```
