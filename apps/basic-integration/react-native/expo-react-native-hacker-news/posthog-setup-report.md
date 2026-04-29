<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Hacker Native, an Expo React Native app for browsing Hacker News. The integration adds product analytics across all key user interactions: browsing stories, reading posts, opening external links, upvoting, and exploring user profiles.

**Changes made:**

- Created `app.config.js` — converts `app.json` to a JS config with `extra` fields (`posthogProjectToken`, `posthogHost`) read from environment variables, enabling expo-constants access in the app.
- Created `src/config/posthog.ts` — initializes the PostHog client using `expo-constants` to read config, with lifecycle event capture and dev-mode debug logging.
- Updated `app/_layout.tsx` — wraps the app in `PostHogProvider` with autocapture (touches enabled, manual screen tracking), and adds a `ScreenTracker` component that calls `posthog.screen()` on every pathname change via `usePathname`.
- Updated `components/Select.tsx` — tracks `story_type_changed` when the user selects a new story category.
- Updated `components/posts/Post.tsx` — tracks `post_opened` on navigation to post details and `post_link_opened` when an external URL is opened.
- Updated `components/posts/Posts.tsx` — tracks `stories_page_loaded` when the user scrolls to load the next page of stories.
- Updated `app/[itemId].tsx` — tracks `item_upvoted`, `item_link_opened`, `author_profile_tapped`, and `parent_item_navigated`.
- Updated `app/users/[userId].tsx` — tracks `user_profile_viewed` when a user profile loads.
- Created `.env` — sets `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (covered by `.gitignore`).

**Dependencies installed:** `posthog-react-native`, `expo-file-system`, `expo-application`, `expo-device`, `expo-localization`

| Event | Description | File |
|---|---|---|
| `story_type_changed` | User selects a different story category (top, best, ask, show) | `components/Select.tsx` |
| `post_opened` | User taps a post to navigate to its detail screen | `components/posts/Post.tsx` |
| `post_link_opened` | User taps the external URL on a post in the list | `components/posts/Post.tsx` |
| `stories_page_loaded` | User scrolls to load more stories (infinite scroll page) | `components/posts/Posts.tsx` |
| `item_upvoted` | User taps the upvote button on the item details screen | `app/[itemId].tsx` |
| `item_link_opened` | User opens the external URL from the item detail screen | `app/[itemId].tsx` |
| `author_profile_tapped` | User taps an author name to view their profile | `app/[itemId].tsx` |
| `parent_item_navigated` | User navigates to the parent item from a comment detail | `app/[itemId].tsx` |
| `user_profile_viewed` | User views a Hacker News user profile page | `app/users/[userId].tsx` |

## Next steps

To see these events in PostHog, open your PostHog project and create an **"Analytics basics"** dashboard with the following insights:

- **Post Opens Trend** — Trends chart on `post_opened` over time to track content engagement
- **Story Type Popularity** — Breakdown of `story_type_changed` by `story_type` property to see which categories users prefer
- **Content Engagement Funnel** — Funnel: `post_opened` → `item_link_opened` to measure how many readers click through to the source
- **User Profile Exploration** — Trend of `user_profile_viewed` to track social browsing behavior
- **External Link Opens** — Trend comparing `post_link_opened` + `item_link_opened` to see total outbound traffic

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
