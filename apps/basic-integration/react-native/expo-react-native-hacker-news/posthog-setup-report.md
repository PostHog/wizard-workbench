<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app — a React Native Hacker News reader built with Expo Router, React Query, and TypeScript.

## What was set up

**PostHog SDK installed** (`posthog-react-native` v4.45.x) along with the required Expo peer dependencies: `expo-file-system`, `expo-application`, `expo-device`, and `expo-localization`.

**Environment configuration**: PostHog credentials are stored in `.env` and injected into the app at build time via `app.config.js` extras, then accessed inside the app through `expo-constants`. No credentials are hardcoded in source files.

**PostHog client** (`src/config/posthog.ts`): A singleton PostHog instance with autocapture for app lifecycle events, request batching, and a graceful disabled-state when the token is not configured.

**Root layout** (`app/_layout.tsx`): `PostHogProvider` wraps the entire application to enable autocapture for touch events. A `ScreenTracker` component uses `usePathname` + `useGlobalSearchParams` to manually track screen views via `posthog.screen()` on every navigation change — required for Expo Router / React Navigation v7 compatibility.

**12 custom events** were added across 6 files to capture the key user interactions in this content-browsing app.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `story_type_changed` | User switches between Top, Best, Ask, or Show stories | `app/index.tsx` |
| `post_tapped` | User taps a post title in the feed to navigate to its detail | `components/posts/Post.tsx` |
| `external_link_opened` | User opens an external URL from a post in the feed | `components/posts/Post.tsx` |
| `post_upvoted` | User taps the upvote button on a post in the feed | `components/posts/Post.tsx` |
| `story_viewed` | User opens a story's detail page — top of the content funnel | `app/[itemId].tsx` |
| `story_upvoted` | User taps the upvote button on a story detail page | `app/[itemId].tsx` |
| `story_external_link_opened` | User opens an external URL from a story detail page | `app/[itemId].tsx` |
| `parent_story_navigated` | User taps "Commented on" to jump to the parent story | `app/[itemId].tsx` |
| `user_profile_viewed` | User opens another user's profile page | `app/users/[userId].tsx` |
| `comment_details_opened` | User taps the reply button to navigate to a comment's detail | `components/comments/comment.tsx` |
| `more_posts_loaded` | User scrolls to the end of the feed, loading the next page | `components/posts/Posts.tsx` |
| `more_user_activities_loaded` | User scrolls to the end of a user's activity feed | `components/posts/user-activities/UserActivities.tsx` |

## Next steps

We've pre-built the key insights to add to a dashboard. Visit PostHog and create an **"Analytics basics"** dashboard, then add these five insights:

1. **Story views over time** — Trends chart for `story_viewed`, showing daily content consumption volume.
2. **Content engagement funnel** — Funnel from `story_viewed` → `story_external_link_opened` to measure how often readers click through to the source.
3. **Story type popularity** — Breakdown of `story_type_changed` by `to_type` property to see which feed category users prefer.
4. **External link click rate** — Trends comparing `story_viewed` vs `story_external_link_opened` using a formula insight (B/A × 100) to track click-through rate.
5. **User engagement depth** — Trends for `more_posts_loaded` as a proxy for session depth and content scrolling behavior.

You can create these at [/insights](/insights) and group them on a new [dashboard](/dashboards).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
