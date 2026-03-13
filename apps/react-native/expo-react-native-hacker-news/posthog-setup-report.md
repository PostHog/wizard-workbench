<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native (Expo React Native) app. The integration includes:

- **PostHog SDK installed** (`posthog-react-native@^4.37.3`) via `npx expo install`
- **Environment variables** configured in `.env` (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`)
- **`app.config.js`** created to expose PostHog config via `expo-constants` extras
- **`src/config/posthog.ts`** created with a fully configured PostHog client (lifecycle events, batching, feature flag preloading)
- **`app/_layout.tsx`** updated to wrap the app in `PostHogProvider` with autocapture (touches) and manual screen tracking via `usePathname`
- **10 custom events** added across 6 files tracking the key user interactions

| Event | Description | File |
|-------|-------------|------|
| `story_type_changed` | User changes the story feed type (top, best, ask, show) | `components/Select.tsx` |
| `post_opened` | User taps a post title to open its detail/comments page | `components/posts/Post.tsx` |
| `external_link_opened` | User opens an external URL from the post list | `components/posts/Post.tsx` |
| `post_upvoted` | User taps the upvote button on a post in the list | `components/posts/Post.tsx` |
| `item_link_opened` | User opens the external URL from the post detail page | `app/[itemId].tsx` |
| `parent_item_navigated` | User navigates to the parent item from a comment detail page | `app/[itemId].tsx` |
| `user_profile_viewed` | User views a Hacker News user profile page | `app/users/[userId].tsx` |
| `comment_thread_opened` | User opens a nested comment thread from a comment | `components/comments/comment.tsx` |
| `comment_upvoted` | User taps the upvote button on a comment | `components/comments/comment.tsx` |
| `more_posts_loaded` | User scrolls to the bottom and loads the next page of posts | `components/posts/Posts.tsx` |

## Next steps

The PostHog API key in use has read-only scopes, so the dashboard and insights could not be created programmatically. To create an **"Analytics basics"** dashboard manually, visit your PostHog project and add the following recommended insights:

1. **Content engagement funnel** — Funnel: `post_opened` → `external_link_opened` or `item_link_opened` (measures click-through on posts)
2. **Story type popularity** — Trends breakdown: `story_type_changed` broken down by `story_type` property (identifies which feed is most popular)
3. **User profile curiosity** — Trends: `user_profile_viewed` over time (measures social feature usage)
4. **Comment engagement** — Trends: `comment_upvoted` and `comment_thread_opened` (measures comment interaction depth)
5. **Infinite scroll depth** — Trends: `more_posts_loaded` over time (measures how deep users scroll — a proxy for session quality)

Visit [https://us.posthog.com/project/2](https://us.posthog.com/project/2) to build these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
