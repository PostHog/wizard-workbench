<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native (Expo) app. The SDK is initialized via a `src/config/posthog.ts` config file using `expo-constants` to load credentials from `app.config.js` extras, which are populated from environment variables at build time. The root `app/_layout.tsx` was updated to wrap the app in `PostHogProvider` (with autocapture for touches enabled) and includes manual screen tracking using `usePathname`/`useGlobalSearchParams` from Expo Router. Seven custom events were instrumented across four screens/components to capture key user engagement actions.

| Event | Description | File |
|---|---|---|
| `story_feed_filtered` | User changes the story feed type (top, best, ask, show) | `components/Select.tsx` |
| `post_tapped` | User taps a post title to navigate to item details | `components/posts/Post.tsx` |
| `post_external_link_opened` | User opens the external URL linked from a post | `components/posts/Post.tsx` |
| `comment_count_tapped` | User taps the comment count button to view comments | `components/posts/Post.tsx` |
| `item_upvoted` | User taps the upvote button on an item detail page | `app/[itemId].tsx` |
| `item_external_link_opened` | User opens the external URL from item details | `app/[itemId].tsx` |
| `user_profile_viewed` | User navigates to a HackerNews user profile page | `app/users/[userId].tsx` |

## Next steps

To build your "Analytics basics" dashboard, visit your PostHog project and create insights for:

1. **Content discovery funnel** — `post_tapped` → `item_external_link_opened` (measures how many users who tap a post go on to open the external link)
2. **Top story types** — Breakdown of `story_feed_filtered` by `story_type` property (shows which feed categories users prefer)
3. **Engagement rate** — Total count of `item_upvoted` events over time (trend insight)
4. **External link clicks** — `post_external_link_opened` + `item_external_link_opened` combined (total outbound engagement)
5. **User profile curiosity** — `user_profile_viewed` unique users over time (how many users explore author profiles)

Visit your project: [https://us.posthog.com/project/2](https://us.posthog.com/project/2)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
