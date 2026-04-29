<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. Here is a summary of all changes made:

- **Installed** `posthog-react-native` package
- **Created** `app.config.js` to expose `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables via `expo-constants`
- **Created** `src/config/posthog.ts` — the PostHog client singleton, configured with lifecycle event capture, batching, and feature flag support
- **Updated** `app/_layout.tsx` — added `PostHogProvider` wrapping the `Stack`, plus manual screen tracking via `useEffect` with `usePathname` and `useGlobalSearchParams` from Expo Router
- **Updated** `components/posts/Post.tsx` — added `post_opened` and `external_link_opened` capture on title press
- **Updated** `app/index.tsx` — added `story_type_changed` capture with `from_type` and `to_type` properties when users switch feeds
- **Updated** `app/[itemId].tsx` — added `item_upvoted`, `item_link_opened`, `user_profile_viewed`, and `parent_story_navigated` events on the relevant user interactions
- **Created** `.env` — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` set and `.gitignore`-covered

| Event | Description | File |
|---|---|---|
| `post_opened` | User taps a story title to view its details (non-external posts) | `components/posts/Post.tsx` |
| `external_link_opened` | User opens an external URL directly from the post list | `components/posts/Post.tsx` |
| `story_type_changed` | User switches the story feed type (top, best, ask, show) | `app/index.tsx` |
| `item_upvoted` | User taps the upvote button on an item's detail page | `app/[itemId].tsx` |
| `item_link_opened` | User opens the external URL from an item's detail page | `app/[itemId].tsx` |
| `user_profile_viewed` | User taps on a username to view their HN profile | `app/[itemId].tsx` |
| `parent_story_navigated` | User taps the "Commented on" banner to navigate to the parent story | `app/[itemId].tsx` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these five insights to monitor user behavior:

1. **Content engagement trend** — Trend of `post_opened` + `external_link_opened` over time to track overall reading activity
2. **Story feed popularity** — Breakdown of `story_type_changed` by `to_type` property to see which feeds (top, best, ask, show) users prefer
3. **Post engagement funnel** — Funnel: `post_opened` → `item_upvoted` to measure how often readers engage with content
4. **Link click rate** — Trend of `item_link_opened` over time to track how often users visit external sites
5. **User profile exploration** — Trend of `user_profile_viewed` over time to see community exploration behavior

Create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
