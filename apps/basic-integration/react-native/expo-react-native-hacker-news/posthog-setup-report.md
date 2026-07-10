# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app — a read-only Hacker News client. The integration covers all major user interactions: browsing story feeds, opening stories and external links, upvoting, exploring comments, and viewing HN user profiles. PostHog is initialised via a standalone config module (`src/config/posthog.ts`) and provided to the component tree through `PostHogProvider` in the root layout. Screen views are tracked manually using Expo Router's `usePathname` hook, which avoids double-counting from PostHog's built-in screen autocapture.

| Event name | Description | File |
|---|---|---|
| `story_type_changed` | User switches the story feed filter (top, best, ask, show). | `app/index.tsx` |
| `story_opened` | User taps a discussion-only story to open its detail view. | `components/posts/Post.tsx` |
| `story_link_opened` | User taps the external URL link on a story to open it in the browser. | `components/posts/Post.tsx` |
| `story_upvoted` | User taps the upvote button on a story in the feed. | `components/posts/Post.tsx` |
| `story_comments_opened` | User taps the comments button on a story to view its discussion. | `components/posts/Post.tsx` |
| `story_detail_link_opened` | User opens the external URL from the story detail screen. | `app/[itemId].tsx` |
| `story_detail_upvoted` | User taps the upvote button on a story from the detail screen. | `app/[itemId].tsx` |
| `user_profile_viewed` | User taps on an author's username to view their HN profile. | `app/[itemId].tsx` |
| `more_stories_loaded` | User scrolls to the end of the feed, triggering the next page of stories. | `components/posts/Posts.tsx` |
| `more_comments_loaded` | User scrolls to the end of comments, triggering the next page of comments. | `components/comments/comments.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1829283)
- [Story interactions over time](https://us.posthog.com/project/483112/insights/VkWpL9mh) — daily trend of story_opened, story_link_opened, story_comments_opened
- [Story engagement funnel](https://us.posthog.com/project/483112/insights/aTsNvUaE) — conversion from story_opened → comments_opened → more_comments_loaded
- [Story type popularity](https://us.posthog.com/project/483112/insights/VMfXmkGO) — which feed filter (top/best/ask/show) users switch to most
- [Upvotes vs external link opens](https://us.posthog.com/project/483112/insights/NUJWcaeG) — comparison of upvote taps vs outbound link clicks
- [User profile views](https://us.posthog.com/project/483112/insights/yoytaGUT) — daily total and unique viewer counts for HN profile visits

No dashboard subscription or alert was configured (user skipped). You can set these up at any time from the dashboard page in PostHog.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what values to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
