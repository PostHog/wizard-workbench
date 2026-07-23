<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker News React Native (Expo) app. The SDK is initialised via a dedicated `src/config/posthog.ts` module that reads credentials from Expo's `app.config.js` extras, so keys never appear in source code. The root layout now wraps the entire app in `PostHogProvider` with autocapture enabled for touch events, and manually tracks screen changes using `usePathname` and `useGlobalSearchParams` from expo-router. Ten custom events cover every major user interaction — story browsing, upvoting, link-opening, comment engagement, and user profile views.

| Event name | Description | File |
|---|---|---|
| `story_category_changed` | User switches story feed category (Top, Best, Ask, Show) | `components/Select.tsx` |
| `story_opened` | User taps a story title to open its detail page | `components/posts/Post.tsx` |
| `story_external_link_opened` | User opens an external URL from a story card in the feed | `components/posts/Post.tsx` |
| `story_upvoted` | User taps the upvote button on a story card | `components/posts/Post.tsx` |
| `story_comments_opened` | User taps the comments button on a story card | `components/posts/Post.tsx` |
| `comment_upvoted` | User upvotes a comment | `components/comments/comment.tsx` |
| `comment_thread_opened` | User opens a comment's reply thread | `components/comments/comment.tsx` |
| `story_detail_link_opened` | User opens the external URL from the story detail page | `app/[itemId].tsx` |
| `story_detail_upvoted` | User taps the upvote button on the story detail page | `app/[itemId].tsx` |
| `user_profile_viewed` | User opens a Hacker News user's profile page | `app/users/[userId].tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1897486)
- **Story engagement trends (wizard)**: [https://us.i.posthog.com/project/483112/insights/MnXoJn8e](https://us.i.posthog.com/project/483112/insights/MnXoJn8e)
- **Story to external link funnel (wizard)**: [https://us.i.posthog.com/project/483112/insights/DL1vLlnP](https://us.i.posthog.com/project/483112/insights/DL1vLlnP)
- **Content category breakdown (wizard)**: [https://us.i.posthog.com/project/483112/insights/kw9tK0oe](https://us.i.posthog.com/project/483112/insights/kw9tK0oe)
- **Comment engagement (wizard)**: [https://us.i.posthog.com/project/483112/insights/O6xdtmDW](https://us.i.posthog.com/project/483112/insights/O6xdtmDW)
- **User profile views (wizard)**: [https://us.i.posthog.com/project/483112/insights/bYjnCYaD](https://us.i.posthog.com/project/483112/insights/bYjnCYaD)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
