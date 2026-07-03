<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. The integration covers the full content-discovery and reading flow: story feed browsing, upvoting, following links, reading comment threads, and viewing author profiles. PostHog is initialised once via a shared singleton (`src/config/posthog.ts`), loaded into the root layout via `PostHogProvider`, and accessed in child components with `usePostHog()`. Screen tracking fires automatically on every route change through a `useEffect` in the `LayoutInner` component.

| Event name | Description | File |
|---|---|---|
| `story_feed_type_changed` | User switches the story list between top, best, ask, or show stories. | `components/Select.tsx` |
| `story_tapped` | User taps a story title to open its detail view. | `components/posts/Post.tsx` |
| `story_external_link_opened` | User opens an external URL linked to a story (from the feed). | `components/posts/Post.tsx` |
| `story_upvoted` | User taps the upvote button on a story. | `components/posts/Post.tsx` |
| `story_comments_viewed` | User navigates to a story's comment thread via the comment button. | `components/posts/Post.tsx` |
| `story_feed_loaded_more` | User scrolls to the end of the story list and triggers loading more stories. | `components/posts/Posts.tsx` |
| `story_item_external_link_opened` | User opens the external URL from within the story detail screen. | `app/[itemId].tsx` |
| `story_comments_loaded_more` | User scrolls to the end of the comment list and triggers loading more comments. | `components/comments/comments.tsx` |
| `user_profile_viewed` | User taps on a username in a story detail to view that user's profile. | `app/[itemId].tsx` |
| `user_activities_loaded_more` | User scrolls to the end of a user's activity list and triggers loading more activities. | `components/posts/user-activities/UserActivities.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793522)
- [Story Engagement Over Time (wizard)](https://us.posthog.com/project/483112/insights/FKCKMlRi)
- [External Link Clicks (wizard)](https://us.posthog.com/project/483112/insights/635t526H)
- [Story Feed Type Switches (wizard)](https://us.posthog.com/project/483112/insights/cnGzBa13)
- [User Profile Views (wizard)](https://us.posthog.com/project/483112/insights/64oVcOxD)
- [Pagination Depth (wizard)](https://us.posthog.com/project/483112/insights/TT2Ppi6T)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
