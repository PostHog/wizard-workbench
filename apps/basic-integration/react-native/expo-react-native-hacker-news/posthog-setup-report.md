# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. PostHog was initialized with a shared client instance in `lib/posthog.ts` using Expo Constants to safely read the API key from `app.config.js` extras (populated via environment variables). The root layout (`app/_layout.tsx`) was restructured to wrap the app in `PostHogProvider` with autocapture enabled for touch events and manual screen tracking via `useEffect`. Eleven custom events were added across four files covering the key user interactions: post browsing, voting, external link opening, comment viewing, user profile navigation, and story feed switching.

| Event Name | Description | File |
|---|---|---|
| `story_type_changed` | User switches the story feed between top, best, ask, and show stories. | `app/index.tsx` |
| `post_opened` | User taps a post title to navigate to its detail page. | `components/posts/Post.tsx` |
| `post_external_link_opened` | User taps the external URL link on a post in the feed. | `components/posts/Post.tsx` |
| `post_upvoted` | User taps the upvote button on a post in the feed. | `components/posts/Post.tsx` |
| `post_comments_opened` | User taps the comments button on a post to navigate to its discussion. | `components/posts/Post.tsx` |
| `item_upvoted` | User taps the upvote button on the item detail page. | `app/[itemId].tsx` |
| `item_external_link_opened` | User opens the external URL from an item's detail page. | `app/[itemId].tsx` |
| `item_author_profile_viewed` | User taps the author name on an item detail page to view their profile. | `app/[itemId].tsx` |
| `parent_item_navigated` | User taps the 'Commented on' link to navigate to the parent item. | `app/[itemId].tsx` |
| `comment_upvoted` | User taps the upvote button on a comment. | `components/comments/comment.tsx` |
| `comment_author_profile_viewed` | User taps a comment author's name to view their profile. | `components/comments/comment.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.i.posthog.com/project/483112/dashboard/1761263)
  - Unique users opening posts (over time)
  - Story feed type popularity (story_type_changed by to_type)
  - External link clicks vs posts opened
  - Voting engagement (post_upvoted and comment_upvoted)
  - Comment engagement funnel (post_opened → post_comments_opened → comment_upvoted)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
