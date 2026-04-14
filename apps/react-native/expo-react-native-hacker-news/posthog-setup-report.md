<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. The following changes were made:

- **`app.config.js`** (new): Replaced `app.json` as the Expo config entry point, adding `extra.posthogProjectToken` and `extra.posthogHost` fields that read from environment variables at build time.
- **`src/config/posthog.ts`** (new): PostHog client singleton configured with `expo-constants`, reading token and host from `Constants.expoConfig.extra`. The client is automatically disabled if the token is missing.
- **`.env`** (updated): `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` added and covered by `.gitignore`.
- **`app/_layout.tsx`** (updated): Added `PostHogProvider` wrapping the app, and manual screen tracking via `posthog.screen()` in a `useEffect` tied to `usePathname` (required for Expo Router).
- **`components/posts/Post.tsx`** (updated): Added `post_clicked`, `external_link_opened`, and `comments_opened` events.
- **`components/Select.tsx`** (updated): Added `story_type_changed` event when the user switches feed types.
- **`app/[itemId].tsx`** (updated): Added `item_viewed` (fires when item data loads), `external_link_opened_from_detail`, `parent_item_navigated`, and `user_author_tapped` events.
- **`app/users/[userId].tsx`** (updated): Added `user_profile_viewed` event when a user profile loads.

| Event name | Description | File |
|---|---|---|
| `post_clicked` | User taps on a post title to open it in-app | `components/posts/Post.tsx` |
| `external_link_opened` | User opens an external link from a post | `components/posts/Post.tsx` |
| `comments_opened` | User taps the comments button on a post | `components/posts/Post.tsx` |
| `story_type_changed` | User switches the feed type (top/best/ask/show) | `components/Select.tsx` |
| `item_viewed` | User opens the detail view for a story or comment | `app/[itemId].tsx` |
| `external_link_opened_from_detail` | User opens an external URL from the detail view | `app/[itemId].tsx` |
| `parent_item_navigated` | User navigates to a parent comment thread | `app/[itemId].tsx` |
| `user_author_tapped` | User taps an author name to view their profile | `app/[itemId].tsx` |
| `user_profile_viewed` | User views a Hacker News user profile | `app/users/[userId].tsx` |

## Next steps

We've prepared the following insights for your "Analytics basics" dashboard. You can create them in PostHog at:

- **Dashboard**: https://us.posthog.com/project/2/dashboard/new

Suggested insights to add:

1. **Post engagement trend** — Trends of `post_clicked`, `external_link_opened`, and `comments_opened` over time (daily)
2. **Content discovery funnel** — Funnel: `story_type_changed` → `post_clicked` → `item_viewed` (measures how story filtering drives deeper engagement)
3. **External link click-through rate** — `external_link_opened` and `external_link_opened_from_detail` as a share of `post_clicked` + `item_viewed`
4. **Feed type breakdown** — Bar chart of `story_type_changed` broken down by `story_type` property (which feeds are most popular)
5. **User profile engagement** — Trend of `user_author_tapped` and `user_profile_viewed` over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
