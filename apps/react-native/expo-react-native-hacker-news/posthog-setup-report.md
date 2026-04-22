<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. Here's a summary of all changes made:

## What was set up

- **`posthog-react-native`** installed alongside required Expo peer dependencies (`expo-file-system`, `expo-application`, `expo-device`, `expo-localization`)
- **`src/config/posthog.ts`** — PostHog client configured via `expo-constants`, reading token and host from `app.config.js` extras (loaded from `.env`)
- **`app.config.js`** — Created to replace static `app.json`, exposing `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` as Expo extras
- **`app/_layout.tsx`** — `PostHogProvider` wraps the app with autocapture enabled; a `ScreenTracker` component tracks screen views automatically via Expo Router's `usePathname`
- **Event tracking** added across 6 files (see table below)

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `post_tapped` | User tapped a post title (external or internal) | `components/posts/Post.tsx` |
| `external_link_opened` | User opened an external URL from a post in the feed | `components/posts/Post.tsx` |
| `comments_button_tapped` | User tapped the comments button on a feed post | `components/posts/Post.tsx` |
| `story_type_changed` | User switched feed category (top/best/ask/show) | `app/index.tsx` |
| `item_details_viewed` | User opened an item details screen (top of content funnel) | `app/[itemId].tsx` |
| `item_upvote_tapped` | User tapped the upvote button on an item detail page | `app/[itemId].tsx` |
| `item_external_link_opened` | User opened external URL from item detail page | `app/[itemId].tsx` |
| `parent_item_tapped` | User navigated to the parent of a comment | `app/[itemId].tsx` |
| `user_profile_viewed` | User viewed another user's profile | `app/users/[userId].tsx` |
| `stories_filter_opened` | User opened the story type filter dropdown | `components/Select.tsx` |
| `story_feed_paginated` | User scrolled to load more stories in the feed | `components/posts/Posts.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. To set these up in PostHog, visit your project and create an **"Analytics basics"** dashboard with these recommended insights:

1. **Content engagement funnel** — Funnel: `post_tapped` → `item_details_viewed` → `item_external_link_opened` — tracks how users move from browsing to reading to clicking through
2. **Story feed engagement over time** — Trend: `post_tapped` broken down by `is_external` — shows what kind of content users prefer
3. **Story category popularity** — Trend: `story_type_changed` broken down by `to_type` — reveals which feed categories users gravitate toward
4. **User profile discovery** — Trend: `user_profile_viewed` over time — shows how often users explore community members
5. **Feed depth (pagination)** — Trend: `story_feed_paginated` over time — indicates how far users scroll into feeds

Dashboard link: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
