<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for the Hacker Native Expo app. A PostHog client singleton (`src/config/posthog.ts`) was created using `expo-constants` to load credentials from `app.config.js` extras. The root layout (`app/_layout.tsx`) was updated to wrap the app in `PostHogProvider` with autocapture enabled for touch events and manual screen tracking via `usePathname`/`useGlobalSearchParams`. Ten events covering key user journeys — story browsing, external link engagement, story type filtering, user profile views, and infinite scroll pagination — were instrumented across six files.

| Event name | Description | File |
|---|---|---|
| `story_opened` | User taps a story title to view its details inside the app | `components/posts/Post.tsx` |
| `story_external_link_opened` | User opens an external URL for a story from the story list | `components/posts/Post.tsx` |
| `story_comments_viewed` | User taps the comments button on a story card in the list | `components/posts/Post.tsx` |
| `story_type_changed` | User changes the active story category filter (top, best, ask, show) | `app/index.tsx` |
| `story_details_viewed` | User views the details screen for a story | `app/[itemId].tsx` |
| `story_upvoted` | User taps the upvote button on a story in the details view | `app/[itemId].tsx` |
| `story_detail_external_link_opened` | User opens the external URL for a story from the story details screen | `app/[itemId].tsx` |
| `user_profile_viewed` | User taps on an author name to view their profile | `app/users/[userId].tsx` |
| `more_stories_loaded` | Infinite scroll triggers loading the next page of stories | `components/posts/Posts.tsx` |
| `more_user_activities_loaded` | Infinite scroll triggers loading more of a user's submitted activities | `components/posts/user-activities/UserActivities.tsx` |

## Next steps

Create a dashboard in PostHog named **"Analytics basics (wizard)"** with these suggested insights:

- **Story engagement funnel** — funnel from `story_details_viewed` → `story_upvoted`
- **Story type popularity** — breakdown of `story_type_changed` by `to_type` property
- **External link click-through** — trend of `story_external_link_opened` + `story_detail_external_link_opened`
- **User profile views** — trend of `user_profile_viewed` over time
- **Story discovery** — trend of `story_opened` + `story_comments_viewed` over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
