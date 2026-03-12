<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker News reader app. The integration adds event tracking for key user interactions including story browsing, content engagement, and user profile viewing. PostHog is configured via `expo-constants` using `app.config.js` extras, with environment variables stored in `.env`. The `PostHogProvider` wraps the app in `app/_layout.tsx` with manual screen tracking for Expo Router, and `usePostHog()` is used throughout components to capture events.

## Files created or modified

| File | Change |
|------|--------|
| `app.config.js` | Created — exposes `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` via `expo-constants` extras |
| `src/config/posthog.ts` | Created — PostHog client instance with all config |
| `app/_layout.tsx` | Modified — added `PostHogProvider` and manual screen tracking with `usePathname` |
| `components/Select.tsx` | Modified — tracks `story_type_changed` event |
| `components/posts/Post.tsx` | Modified — tracks `story_opened`, `comments_opened`, `external_link_opened` events |
| `app/[itemId].tsx` | Modified — tracks `item_details_viewed` and `item_link_opened` events |
| `app/users/[userId].tsx` | Modified — tracks `user_profile_viewed` event |

## Events

| Event | Description | File |
|-------|-------------|------|
| `story_type_changed` | User changes the story feed type (top, best, ask, show) | `components/Select.tsx` |
| `story_opened` | User taps a story title to read it | `components/posts/Post.tsx` |
| `external_link_opened` | User opens an external URL from a story post | `components/posts/Post.tsx` |
| `comments_opened` | User taps the comments button on a story | `components/posts/Post.tsx` |
| `item_details_viewed` | User views the details page for a HN item | `app/[itemId].tsx` |
| `item_link_opened` | User opens an external URL from the item details page | `app/[itemId].tsx` |
| `user_profile_viewed` | User views a HN user profile page | `app/users/[userId].tsx` |

## Next steps

Build the following insights in PostHog for your "Analytics basics" dashboard:

1. **Stories Opened Over Time** — Trend of `story_opened`, broken down by day
2. **Story Type Popularity** — `story_type_changed` broken down by `story_type` property
3. **Content Engagement Funnel** — Funnel: `story_opened` → `item_details_viewed` → `comments_opened`
4. **External Link Clicks** — Trend of `external_link_opened` over time
5. **User Profile Views** — Trend of `user_profile_viewed` over time

Visit your PostHog project at: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
