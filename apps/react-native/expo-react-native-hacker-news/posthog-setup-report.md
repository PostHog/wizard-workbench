<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker News React Native Expo app. The integration includes the PostHog SDK setup with `PostHogProvider`, manual screen tracking via `usePathname`, and 10 targeted capture events covering all major user interactions: story feed navigation, post engagement, external link clicks, author profile visits, comment threading, and parent item navigation.

## Changes summary

| File | Change |
|------|--------|
| `app.config.js` | Created: Expo config with `extra.posthogApiKey` and `extra.posthogHost` read from env vars |
| `src/config/posthog.ts` | Created: PostHog client singleton configured via `expo-constants` |
| `app/_layout.tsx` | Updated: Added `PostHogProvider`, `ScreenTracker` component for manual screen tracking |
| `.env` | Updated: Added `POSTHOG_API_KEY` and `POSTHOG_HOST` |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `story_type_changed` | User switches between feed categories (top, best, ask, show) | `components/Select.tsx` |
| `post_tapped` | User taps a post title to view its detail page | `components/posts/Post.tsx` |
| `external_link_opened` | User opens an external URL from a post in the feed | `components/posts/Post.tsx` |
| `comments_viewed` | User taps the comment count to view comments for a post | `components/posts/Post.tsx` |
| `item_detail_external_link_opened` | User opens the external URL from an item detail page | `app/[itemId].tsx` |
| `author_profile_viewed` | User taps an author name on an item detail page | `app/[itemId].tsx` |
| `parent_item_navigated` | User taps the parent item link shown on a comment detail page | `app/[itemId].tsx` |
| `user_profile_viewed` | User views a user profile page | `app/users/[userId].tsx` |
| `comment_author_profile_viewed` | User taps an author name on a comment | `components/comments/comment.tsx` |
| `comment_thread_opened` | User taps the comment count on a comment to drill into its thread | `components/comments/comment.tsx` |

## Next steps

We've defined the following insights and a dashboard for you to create in PostHog to keep an eye on user behavior. Visit your [PostHog project](https://us.posthog.com/project/2) to set them up:

**Suggested "Analytics basics" dashboard with 5 insights:**

1. **Story Feed Engagement Funnel** — Funnel from `post_tapped` → `comments_viewed` to measure conversion from browsing to reading comments
2. **Story Type Popularity** — Trend of `story_type_changed` broken down by `story_type` property, showing which feed category users prefer
3. **External Link Click Rate** — Trend of `external_link_opened` vs `post_tapped` to understand content consumption preferences
4. **User Profile Discovery** — Combined trend of `author_profile_viewed` + `user_profile_viewed` + `comment_author_profile_viewed` to track social exploration
5. **Comment Thread Engagement** — Trend of `comment_thread_opened` to measure deep comment reading behavior

To create the dashboard:
1. Go to [PostHog Dashboards](https://us.posthog.com/project/2/dashboard)
2. Click "New dashboard" → name it "Analytics basics"
3. Add each insight using the event names above

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
