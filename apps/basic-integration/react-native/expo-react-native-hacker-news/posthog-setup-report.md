<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. The integration adds a PostHog client singleton (`src/config/posthog.ts`), wraps the root layout with `PostHogProvider` and manual Expo Router screen tracking, and captures 10 user action events across five files covering story browsing, engagement, and navigation.

| Event name | Description | File |
|---|---|---|
| `story_type_changed` | User switches the story category filter (top, best, ask, show) | `components/Select.tsx` |
| `story_opened` | User taps a story title to navigate to the story detail view | `components/posts/Post.tsx` |
| `external_link_opened` | User opens an external URL directly from the story list | `components/posts/Post.tsx` |
| `story_upvoted` | User taps the upvote button on a story in the list view | `components/posts/Post.tsx` |
| `comments_tapped` | User taps the comment count button to navigate to story comments | `components/posts/Post.tsx` |
| `story_list_loaded_more` | User scrolls to the end of the list and triggers loading more stories | `components/posts/Posts.tsx` |
| `user_profile_viewed` | User navigates to a HN user's profile page from the story detail view | `app/[itemId].tsx` |
| `item_link_opened` | User opens the story's external URL from the story detail view | `app/[itemId].tsx` |
| `item_upvoted` | User taps the upvote button on the story detail view | `app/[itemId].tsx` |
| `user_activities_loaded_more` | User scrolls to load more activity items on a HN user's profile page | `components/posts/user-activities/UserActivities.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1760658)
  - [Story Engagement Funnel](https://us.posthog.com/project/483112/insights/9586306) — Conversion from `story_opened` to `comments_tapped`
  - [Story Upvotes Trend](https://us.posthog.com/project/483112/insights/9586320) — `story_upvoted` + `item_upvoted` over 30 days
  - [Story Type Popularity](https://us.posthog.com/project/483112/insights/9586322) — `story_type_changed` broken down by `story_type`
  - [External Link Clicks](https://us.posthog.com/project/483112/insights/9586324) — `external_link_opened` + `item_link_opened` combined
  - [User Engagement Depth](https://us.posthog.com/project/483112/insights/9586332) — `user_profile_viewed` + `user_activities_loaded_more` over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
