<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for the Hacker Native Expo app. PostHog was wired up across the app's key user flows: browsing the Hacker News feed, reading stories and comments, opening external links, and exploring user profiles.

New files created:
- `src/config/posthog.ts` — PostHog client singleton, configured via `expo-constants` / `app.config.js` extras.
- `app.config.js` — Replaces static `app.json` to inject `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` env vars into the Expo build.
- `.env` — PostHog project token and host (gitignored).

Modified files:
- `app/_layout.tsx` — Added `PostHogProvider` (wraps the navigator stack) and manual screen tracking via `usePathname` + `useEffect`.
- `components/Select.tsx` — Captures `story_type_changed` when the user switches between Top/Best/Ask/Show story feeds.
- `components/posts/Post.tsx` — Captures `post_opened`, `external_link_opened`, `post_upvoted`, and `comments_opened`.
- `app/[itemId].tsx` — Captures `item_viewed` (on mount), `user_profile_viewed` (author tap), and `item_external_link_opened`.
- `components/posts/Posts.tsx` — Captures `more_stories_loaded` on infinite scroll.
- `components/comments/comments.tsx` — Captures `more_comments_loaded` on infinite scroll.

Packages added:
- `posthog-react-native` — Core analytics SDK.
- `expo-application`, `expo-device`, `expo-localization` — Required Expo peer dependencies for the SDK.

| Event | Description | File |
|---|---|---|
| `story_type_changed` | User switches the story feed between Top, Best, Ask, or Show stories | `components/Select.tsx` |
| `post_opened` | User taps a post title to view its comments and details | `components/posts/Post.tsx` |
| `external_link_opened` | User opens the external URL attached to a post from the feed | `components/posts/Post.tsx` |
| `post_upvoted` | User taps the upvote button on a post | `components/posts/Post.tsx` |
| `comments_opened` | User taps the comment count button to view comments | `components/posts/Post.tsx` |
| `item_viewed` | User opens an item detail screen | `app/[itemId].tsx` |
| `item_external_link_opened` | User opens the external link from the item detail screen | `app/[itemId].tsx` |
| `user_profile_viewed` | User taps a username to view their HN profile | `app/[itemId].tsx` |
| `more_stories_loaded` | User scrolls to load the next page of stories | `components/posts/Posts.tsx` |
| `more_comments_loaded` | User scrolls to load the next page of comments | `components/comments/comments.tsx` |

## Next steps

We've built some insights and added them to your PostHog dashboard for tracking user behavior:

- [Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- [Content engagement funnel](https://us.posthog.com/project/483112/insights/AH7oN1R1) — post_opened → item_viewed → comments_opened conversion
- [Story category preference](https://us.posthog.com/project/483112/insights/MWUD3pbP) — Which story types users prefer
- [External link clicks vs in-app reading](https://us.posthog.com/project/483112/insights/UsAeSqBE) — external_link_opened vs post_opened trend
- [Daily upvote activity](https://us.posthog.com/project/483112/insights/m7mnudOD) — post_upvoted over time
- [Deep reading engagement](https://us.posthog.com/project/483112/insights/IjrYkVbl) — more_stories_loaded and more_comments_loaded over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
