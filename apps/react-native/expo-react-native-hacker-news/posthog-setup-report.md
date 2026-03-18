<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native app (Expo React Native). The following changes were made:

- **Installed** `posthog-react-native` via npm
- **Created** `app.config.js` to replace `app.json`, adding `extra.posthogProjectToken` and `extra.posthogHost` fields read from environment variables
- **Created** `src/config/posthog.ts` — the PostHog client singleton, configured via `expo-constants`, with lifecycle event capture and disabled state when unconfigured
- **Updated** `app/_layout.tsx` — added `PostHogProvider` wrapping the navigation stack, plus manual screen tracking with `posthog.screen()` using `usePathname` and `useGlobalSearchParams` from Expo Router
- **Updated** `components/posts/Post.tsx` — added `post_tapped`, `post_external_link_opened`, and `post_comments_tapped` events
- **Updated** `components/Select.tsx` — added `story_type_changed` event when user switches feed type
- **Updated** `app/[itemId].tsx` — added `item_author_tapped`, `item_external_link_opened`, and `item_parent_tapped` events
- **Updated** `app/users/[userId].tsx` — added `user_profile_viewed` event via `useEffect` when profile data loads
- **Set** `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in `.env`

| Event | Description | File |
|---|---|---|
| `post_tapped` | User taps a post title to view it in-app | `components/posts/Post.tsx` |
| `post_external_link_opened` | User opens an external link from a post listing | `components/posts/Post.tsx` |
| `post_comments_tapped` | User taps the comments button on a post | `components/posts/Post.tsx` |
| `story_type_changed` | User switches between feed types (top, best, ask, show) | `components/Select.tsx` |
| `item_external_link_opened` | User opens the external link from an item detail screen | `app/[itemId].tsx` |
| `item_author_tapped` | User taps an author's name to view their profile | `app/[itemId].tsx` |
| `item_parent_tapped` | User navigates to a parent item from a comment detail | `app/[itemId].tsx` |
| `user_profile_viewed` | User views a Hacker News user profile page | `app/users/[userId].tsx` |

## Next steps

To build a dashboard in PostHog, visit your project and create an **"Analytics basics"** dashboard with insights like:

- **Story feed engagement** — Trend of `post_tapped` + `post_external_link_opened` to see how users engage with posts
- **External link click-through rate** — `post_external_link_opened` divided by total post impressions
- **Story type funnel** — `story_type_changed` breakdown by `story_type` property to see which feeds are most popular
- **Content-to-comments funnel** — Funnel from `post_tapped` → `post_comments_tapped` to measure comment engagement
- **User profile exploration** — Trend of `item_author_tapped` and `user_profile_viewed` to track community exploration

Visit your PostHog project: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
