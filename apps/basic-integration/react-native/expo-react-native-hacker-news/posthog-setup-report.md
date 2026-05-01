<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Hacker Native Expo app. Here is a summary of all changes made:

**New files created:**
- `app.config.js` — Replaced `app.json` with a JS config that injects `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the `.env` file into `expo-constants` extras at build time.
- `src/config/posthog.ts` — Initialises the PostHog client using `Constants.expoConfig.extra`, with lifecycle event capture and dev-mode debug logging.
- `.env` — Populated with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values (covered by `.gitignore`).

**Files modified:**
- `app/_layout.tsx` — Wrapped the app in `PostHogProvider` with autocapture (touch events enabled, screen tracking disabled in favour of manual tracking). Added a `ScreenTracker` component that calls `posthog.screen()` on every route change via `usePathname` and `useGlobalSearchParams`.
- `components/posts/Post.tsx` — Added `post_opened`, `external_link_opened`, and `post_upvoted` events.
- `app/[itemId].tsx` — Added `item_upvoted`, `item_link_opened`, `author_profile_viewed`, and `parent_item_viewed` events.
- `components/Select.tsx` — Added `story_type_changed` event with `from_type`, `to_type`, and `to_label` properties.

**Package installed:** `posthog-react-native` ^4.44.0

---

## Events instrumented

| Event | Description | File |
|---|---|---|
| `post_opened` | User taps a post title or comments button to open the detail screen | `components/posts/Post.tsx` |
| `external_link_opened` | User taps an external URL link attached to a post | `components/posts/Post.tsx` |
| `post_upvoted` | User taps the upvote button on a post in the list | `components/posts/Post.tsx` |
| `story_type_changed` | User switches the story feed (top/best/ask/show) | `components/Select.tsx` |
| `item_upvoted` | User taps the upvote button on the item detail screen | `app/[itemId].tsx` |
| `item_link_opened` | User taps the external URL link on the item detail screen | `app/[itemId].tsx` |
| `author_profile_viewed` | User taps an author name to view their profile | `app/[itemId].tsx` |
| `parent_item_viewed` | User navigates up to the parent item in a comment thread | `app/[itemId].tsx` |

---

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights. Use the links below to get started:

- **[New dashboard](https://us.posthog.com/project/2/dashboard/new)** — Create a dashboard named "Analytics basics"
- **[Post engagement trend](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"post_opened","name":"post_opened","type":"events","order":0}]})** — Daily count of `post_opened` to see content engagement over time
- **[Content-to-detail funnel](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"post_opened","name":"post_opened","type":"events","order":0},{"id":"item_link_opened","name":"item_link_opened","type":"events","order":1}]})** — Funnel from `post_opened` → `item_link_opened` to measure how many users click through to the source
- **[Story type distribution](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"story_type_changed","name":"story_type_changed","type":"events","order":0}],"breakdown":"to_type","breakdown_type":"event"})** — Breakdown of `story_type_changed` by `to_type` to see which feeds are most popular
- **[External link click rate](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"external_link_opened","name":"external_link_opened","type":"events","order":0}]})** — Daily count of `external_link_opened` events to measure outbound engagement
- **[Author profile exploration](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"author_profile_viewed","name":"author_profile_viewed","type":"events","order":0}]})** — How often users explore author profiles from item detail screens

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
