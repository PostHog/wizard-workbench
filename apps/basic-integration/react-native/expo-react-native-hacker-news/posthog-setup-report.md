<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. The PostHog React Native SDK (`posthog-react-native`) was installed and configured, `app.config.js` was created to expose the PostHog project token and host via Expo's `expo-constants` extras, and a dedicated `src/config/posthog.ts` module was added. `PostHogProvider` was wrapped around the app in `app/_layout.tsx` with autocapture and manual screen tracking via Expo Router. Ten distinct action events were instrumented across six files to track the key user interactions in this Hacker News reader.

| Event | Description | File |
|---|---|---|
| `story_type_changed` | User switches the story feed category (top, best, ask, or show) | `app/index.tsx` |
| `story_opened` | User taps a story title to navigate to its detail and comments view | `components/posts/Post.tsx` |
| `story_link_opened` | User opens the external URL for a story from the story list | `components/posts/Post.tsx` |
| `story_upvote_tapped` | User taps the upvote button on a story in the feed | `components/posts/Post.tsx` |
| `story_comments_opened` | User taps the comments count button to navigate to a story's detail | `components/posts/Post.tsx` |
| `story_link_opened` | User opens the external URL from the story detail view (`source: "detail"`) | `app/[itemId].tsx` |
| `story_upvote_tapped` | User taps the upvote button while viewing story details (`source: "detail"`) | `app/[itemId].tsx` |
| `user_profile_viewed` | User navigates to a Hacker News user profile page | `app/users/[userId].tsx` |
| `more_stories_loaded` | User scrolls to the bottom and triggers loading the next page of stories | `components/posts/Posts.tsx` |
| `more_comments_loaded` | User scrolls to load more comments on a story | `components/comments/comments.tsx` |

## Next steps

The PostHog MCP API key used during setup lacked `dashboard:write` and `insight:write` scopes, so the dashboard could not be created automatically. Create the **"Analytics basics (wizard)"** dashboard manually using these suggested insights:

1. **Story type distribution** — Trends breakdown of `story_type_changed` by `to_type` property — shows which feed categories users prefer.
2. **Story engagement funnel** — Funnel from `story_opened` → `story_link_opened` → measures how many users who open a story also click through to the external link.
3. **Upvote engagement over time** — Trends of `story_upvote_tapped` split by `source` (`list` vs `detail`) — shows where users engage most.
4. **Pagination depth** — Trends of `more_stories_loaded` with breakdown by `story_type` — identifies which feed types drive deeper scrolling.
5. **User profile discovery** — Trends of `user_profile_viewed` — tracks community engagement beyond content consumption.

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard)
- [Create new insights](https://us.posthog.com/project/2/insights/new)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
