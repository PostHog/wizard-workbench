# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for this Expo React Native Hacker News client. The SDK was installed (`posthog-react-native`), a PostHog config module was created at `src/config/posthog.ts`, the app root layout was updated to wrap the app with `PostHogProvider` and add manual screen tracking via `usePathname`, and `app.json` was converted to `app.config.js` to expose the PostHog token and host via `expo-constants`. Eight events were instrumented across four files covering the core content-browsing interactions: feed filtering, story opens, external link clicks, upvotes, comments access, and user profile views.

| Event name | Description | File |
|---|---|---|
| `story_feed_filter_changed` | User switches the story feed type (top, best, ask, show) via the filter selector. | `components/Select.tsx` |
| `story_opened` | User taps a story title in the feed to open the item detail screen. | `components/posts/Post.tsx` |
| `story_link_opened` | User opens the external URL of a story from the feed list. | `components/posts/Post.tsx` |
| `story_upvoted` | User taps the upvote button on a story in the feed. | `components/posts/Post.tsx` |
| `story_comments_opened` | User taps the comments button on a story in the feed to open the detail screen. | `components/posts/Post.tsx` |
| `item_link_opened` | User opens the external URL of an item from the item detail screen. | `app/[itemId].tsx` |
| `item_upvoted` | User taps the upvote button on the item detail screen. | `app/[itemId].tsx` |
| `user_profile_viewed` | User navigates to view a Hacker News user profile. | `app/users/[userId].tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818242)
- [Story engagements over time](https://us.posthog.com/project/483112/insights/kMyXKJNB)
- [Story to comments funnel](https://us.posthog.com/project/483112/insights/jvp7DfyM)
- [Story feed filter distribution](https://us.posthog.com/project/483112/insights/V4D1oQku)
- [Upvotes vs link clicks](https://us.posthog.com/project/483112/insights/mTB3MEc9)
- [User profile views over time](https://us.posthog.com/project/483112/insights/FL9uwFYs)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any onboarding scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
