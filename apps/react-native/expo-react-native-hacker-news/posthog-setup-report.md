<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into **Hacker Native** — a React Native Expo app built on Expo Router. The integration uses `posthog-react-native` with the Expo variant peer dependencies (`expo-file-system`, `expo-application`, `expo-device`, `expo-localization`). Configuration is loaded securely via `expo-constants` from `app.config.js` extras, keeping API keys out of source code.

### Changes made

- **`.env`** — Created with `POSTHOG_API_KEY` and `POSTHOG_HOST` (`.gitignore` covered automatically)
- **`app.config.js`** — Created (replacing static `app.json`) to inject PostHog env vars as Expo config `extra` at build time
- **`src/config/posthog.ts`** — New PostHog singleton client with full configuration (batching, feature flags, lifecycle events, debug mode)
- **`app/_layout.tsx`** — Wrapped the app in `PostHogProvider` (with autocapture for touches); added a `ScreenTracker` component using `usePathname` + `useEffect` for manual screen tracking with Expo Router
- **`components/posts/Post.tsx`** — Added `story_opened`, `external_link_opened`, `story_upvoted` events
- **`app/[itemId].tsx`** — Added `story_detail_link_opened`, `user_profile_viewed`, `parent_story_navigated` events
- **`components/Select.tsx`** — Added `story_type_changed` event

### Events instrumented

| Event name | Description | File |
|---|---|---|
| `story_opened` | User taps on a story to open its discussion thread | `components/posts/Post.tsx` |
| `external_link_opened` | User taps an external URL on a post to open it in the browser | `components/posts/Post.tsx` |
| `story_upvoted` | User taps the upvote button on a story | `components/posts/Post.tsx` |
| `story_type_changed` | User changes the story feed type (top, best, ask, show) | `components/Select.tsx` |
| `story_detail_link_opened` | User taps the external URL on a story detail page | `app/[itemId].tsx` |
| `user_profile_viewed` | User navigates to another user's profile page | `app/[itemId].tsx` |
| `parent_story_navigated` | User taps the "Commented on" link to go to a parent story | `app/[itemId].tsx` |

### Autocapture also enabled

- **Touch events** — All touch interactions within the `PostHogProvider` are captured automatically (button presses, pressables, etc.)
- **Screen views** — Manual screen tracking via `posthog.screen()` on every route change in `app/_layout.tsx`
- **App lifecycle events** — Application Installed, Updated, Opened, Became Active, Backgrounded

## Next steps

To view your analytics, log in to PostHog and explore:

- **Trends** — Chart `story_opened` over time to see daily engagement
- **Funnel** — `story_opened` → `story_detail_link_opened` to measure how often users follow external links from stories
- **Breakdown** — `story_type_changed` broken down by `to_type` to see which feed types are most popular
- **Trends** — `story_upvoted` to track engagement/voting behavior
- **User paths** — Use PostHog's Path analysis to see the most common navigation flows

Once PostHog is receiving events, create a dashboard at:
👉 https://us.posthog.com/project/insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
