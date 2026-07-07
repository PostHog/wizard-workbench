# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. The following changes were made:

- **`app.config.js`** — Created to replace `app.json` as the Expo config entry point, exposing `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` via `expo-constants` extras.
- **`src/config/posthog.ts`** — New PostHog client singleton, reading credentials from `Constants.expoConfig.extra`, with lifecycle event capture, batching, and graceful disabling when unconfigured.
- **`app/_layout.tsx`** — Added `PostHogProvider` wrapping the app with autocapture (touches enabled, manual screen tracking), and a `ScreenTracker` component that calls `posthog.screen()` on each route change using `usePathname` + `useGlobalSearchParams`.
- **`app/index.tsx`** — Captures `story_type_changed` when the user switches between Top, Best, Ask, and Show story feeds.
- **`components/posts/Post.tsx`** — Captures `story_opened`, `story_link_opened`, `story_upvoted`, and `comments_opened` on the relevant press handlers.
- **`app/[itemId].tsx`** — Captures `item_upvoted`, `item_link_opened`, and `user_profile_opened` on the detail page interactions.

| Event name | Description | File |
|---|---|---|
| `story_type_changed` | User switches the story feed between Top, Best, Ask, or Show stories. | `app/index.tsx` |
| `story_opened` | User taps a story title to open the item details screen. | `components/posts/Post.tsx` |
| `story_link_opened` | User opens the external URL associated with a story from the feed. | `components/posts/Post.tsx` |
| `story_upvoted` | User presses the upvote button on a story in the feed. | `components/posts/Post.tsx` |
| `comments_opened` | User taps the comments count button on a story to view its comments. | `components/posts/Post.tsx` |
| `item_link_opened` | User opens the external URL from the item details page. | `app/[itemId].tsx` |
| `item_upvoted` | User presses the upvote button on the item details page. | `app/[itemId].tsx` |
| `user_profile_opened` | User taps an author name to open their Hacker News profile. | `app/[itemId].tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1813109)
- [Story engagement over time](https://us.posthog.com/project/483112/insights/2ugV4KSB) — Daily trend of story opens, comments opens, and link clicks
- [Story to comments funnel](https://us.posthog.com/project/483112/insights/U6YEclJ9) — Conversion rate from opening a story to opening its comments
- [Story type filter distribution](https://us.posthog.com/project/483112/insights/OObA7pe0) — Which story types users switch to, broken down by `to_type`
- [Upvotes trend](https://us.posthog.com/project/483112/insights/ERtGqgJF) — Daily upvote volume in the feed vs. detail pages
- [External link opens](https://us.posthog.com/project/483112/insights/nQte6gpA) — Stacked comparison of link opens from the feed vs. item detail pages

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
