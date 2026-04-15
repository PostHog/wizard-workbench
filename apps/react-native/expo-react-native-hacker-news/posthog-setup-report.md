<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. Here's a summary of what was done:

- **`posthog-react-native` installed** as a dependency via `npx expo install`.
- **`app.config.js` created** (replacing static `app.json` extras) to expose `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment into the app via `expo-constants`.
- **`.env` configured** with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values (covered by `.gitignore`).
- **`src/config/posthog.ts` created** — a shared PostHog client instance using `Constants.expoConfig?.extra` for token/host, with app lifecycle capture, debug mode in dev, and graceful no-op when the token is absent.
- **`app/_layout.tsx` updated** — added `PostHogProvider` wrapping the app, plus manual screen tracking via `posthog.screen()` on pathname changes (required for expo-router).
- **12 events instrumented** across 6 files covering the full content consumption and navigation funnel.

## Events

| Event | Description | File |
|---|---|---|
| `story_feed_viewed` | User views the home screen story feed — top of the content funnel | `app/index.tsx` |
| `story_type_changed` | User switches between story categories (top, best, ask, show) | `components/Select.tsx` |
| `post_opened` | User taps a post title to open its detail view (internal posts) | `components/posts/Post.tsx` |
| `post_external_link_opened` | User taps the external URL link on a post from the feed | `components/posts/Post.tsx` |
| `post_upvoted` | User taps the upvote button on a post in the feed | `components/posts/Post.tsx` |
| `post_comments_opened` | User taps the comments button on a post | `components/posts/Post.tsx` |
| `item_external_link_opened` | User opens the external link from the item detail page | `app/[itemId].tsx` |
| `item_upvoted` | User taps the upvote button on the item detail page | `app/[itemId].tsx` |
| `parent_item_opened` | User taps the "Commented on" section to navigate to parent item | `app/[itemId].tsx` |
| `user_profile_viewed` | User navigates to a HN user's profile page | `app/users/[userId].tsx` |
| `comment_author_tapped` | User taps on a comment author name to view their profile | `components/comments/comment.tsx` |
| `comment_thread_opened` | User taps the reply/thread button on a comment | `components/comments/comment.tsx` |

## Next steps

To visualize these events in PostHog, create an **"Analytics basics"** dashboard with these insights:

1. **Content engagement funnel** — Funnel: `story_feed_viewed` → `post_opened` → `comment_thread_opened`
2. **Story type popularity** — Trends: `story_type_changed` broken down by `story_type` property
3. **External link clicks** — Trends: `post_external_link_opened` + `item_external_link_opened` over time
4. **User profile engagement** — Trends: `user_profile_viewed` + `comment_author_tapped` over time
5. **Comment engagement** — Trends: `post_comments_opened` + `comment_thread_opened` over time

Navigate to your PostHog project → Dashboards → New dashboard to set these up.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
