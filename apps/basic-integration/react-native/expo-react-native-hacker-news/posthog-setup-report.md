<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Expo React Native Hacker News app. PostHog was installed and initialized with an Expo-compatible client in `lib/posthog.ts`, wired into the root layout with `PostHogProvider`, and configured to use `EXPO_PUBLIC_POSTHOG_KEY` and `EXPO_PUBLIC_POSTHOG_HOST` from `.env` via Expo `extra` config in `app.json`. Manual screen tracking was added in the root layout for Expo Router, and targeted event capture plus a small amount of exception capture were added across story feed, story detail, comments, and user profile flows.

| Event name | Description | File |
| --- | --- | --- |
| `story_feed_loaded` | Captured when a story feed successfully loads for a selected category. | `components/posts/Posts.tsx` |
| `story_type_selected` | Captured when a user switches between Hacker News story categories from the home screen. | `app/index.tsx` |
| `story_opened` | Captured when a user opens a story from the list or activity feed. | `components/posts/Post.tsx` |
| `story_external_link_opened` | Captured when a user opens an external story URL. | `components/posts/Post.tsx` and `app/[itemId].tsx` |
| `story_comments_opened` | Captured when a user opens a story or comment thread from a comment count action. | `components/posts/Post.tsx` |
| `item_detail_viewed` | Captured when an item detail screen is viewed with its metadata. | `app/[itemId].tsx` |
| `comment_thread_loaded` | Captured when comments for an item load successfully. | `components/comments/comments.tsx` |
| `comment_author_opened` | Captured when a user opens a comment author's profile. | `components/comments/comment.tsx` and `app/[itemId].tsx` |
| `comment_thread_opened` | Captured when a nested comment thread is opened from a comment card. | `components/comments/comment.tsx` |
| `parent_item_opened` | Captured when a user jumps from a comment detail view to the parent item. | `app/[itemId].tsx` |
| `user_profile_viewed` | Captured when a user profile screen is viewed. | `app/users/[userId].tsx` |
| `user_activities_loaded` | Captured when a user activity list loads successfully. | `components/posts/user-activities/UserActivities.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825410
- Insight: Story feed loads by type (wizard) — https://us.posthog.com/project/483112/insights/uk9oDP7e
- Insight: Story exploration funnel (wizard) — https://us.posthog.com/project/483112/insights/WhR36xex
- Insight: Comment engagement trend (wizard) — https://us.posthog.com/project/483112/insights/3pmdJjTA
- Insight: External link opens (wizard) — https://us.posthog.com/project/483112/insights/jsROz7DE
- Insight: Profile views and activity loads (wizard) — https://us.posthog.com/project/483112/insights/DIs1WY35

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here (`EXPO_PUBLIC_POSTHOG_KEY` and `EXPO_PUBLIC_POSTHOG_HOST`) to `.env.example` and any bootstrap scripts collaborators use.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
