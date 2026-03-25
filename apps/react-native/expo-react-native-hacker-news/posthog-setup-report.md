<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. Here's a summary of all changes made:

**New files created:**
- `app.config.js` — Replaced static `app.json` with a dynamic config that exposes `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables to the app via `expo-constants`.
- `lib/posthog.ts` — Singleton PostHog client initialized from `Constants.expoConfig.extra`, with app lifecycle capture and debug mode in development.
- `.env` — Environment variables for `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (git-ignored).

**Modified files:**
- `app/_layout.tsx` — Added `PostHogProvider` wrapping the `Stack` navigator, plus a `ScreenTracker` component that manually tracks screen views using `usePathname` and `useGlobalSearchParams` (required for expo-router compatibility).
- `components/Select.tsx` — Captures `story_type_changed` when user switches feed filter.
- `components/posts/Post.tsx` — Captures `post_opened` (internal navigation), `external_link_opened` (outbound URL), and `post_upvoted` (haptic upvote tap).
- `app/[itemId].tsx` — Captures `item_upvoted`, `item_link_opened`, `author_profile_viewed`, and `parent_item_navigated`.
- `app/users/[userId].tsx` — Captures `user_profile_viewed` on mount.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `story_type_changed` | User changed the story feed filter (top, best, ask, show) | `components/Select.tsx` |
| `post_opened` | User tapped a post title to view its details screen | `components/posts/Post.tsx` |
| `external_link_opened` | User tapped a post's external URL link | `components/posts/Post.tsx` |
| `post_upvoted` | User tapped the upvote button on a post in the feed | `components/posts/Post.tsx` |
| `item_upvoted` | User tapped the upvote button on an item detail screen | `app/[itemId].tsx` |
| `item_link_opened` | User tapped the external link on an item detail screen | `app/[itemId].tsx` |
| `author_profile_viewed` | User tapped on an author's name to navigate to their profile | `app/[itemId].tsx` |
| `parent_item_navigated` | User tapped the 'commented on' parent item link | `app/[itemId].tsx` |
| `user_profile_viewed` | User viewed a HN user's profile page | `app/users/[userId].tsx` |

## Next steps

We've prepared analytics insights for you to build in PostHog based on the events above. Visit your project dashboards to create an **"Analytics basics"** dashboard with these insights:

- **Post engagement trend** — Trend of `post_opened` + `external_link_opened` over time
- **Content engagement funnel** — Funnel: `post_opened` → `item_upvoted` (measures conversion from browsing to engaging)
- **Story type distribution** — `story_type_changed` broken down by `story_type` property
- **User exploration** — Trend of `author_profile_viewed` + `user_profile_viewed` over time
- **Link engagement** — Trend of `external_link_opened` + `item_link_opened` (measures outbound engagement)

**PostHog project:** https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
