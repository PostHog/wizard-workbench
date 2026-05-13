<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **Hacker Native** Expo app. Here is a summary of what was done:

- **Installed** `posthog-react-native`, `expo-file-system`, `expo-application`, `expo-device`, and `expo-localization` as required peer dependencies.
- **Created** `app.config.js` to expose `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` via `Constants.expoConfig.extra`.
- **Created** `lib/posthog.ts` — the PostHog client singleton configured from `expo-constants`, with graceful no-op behaviour when no token is set.
- **Updated** `app/_layout.tsx` — wrapped the app in `PostHogProvider` (with autocapture enabled for touches) and added manual screen tracking via `posthog.screen()` on every route change using `usePathname` and `useGlobalSearchParams`.
- **Added event tracking** across four component files (see table below).
- **Fixed** two TypeScript errors introduced during integration: replaced `undefined` with `null` in a PostHog capture payload, and removed the unsupported `debug` option from `PostHogOptions`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `post_clicked` | User taps a post title to open its detail view (internal posts only) | `components/posts/Post.tsx` |
| `external_link_opened` | User taps a link to open an external URL in the browser (post title or link button) | `components/posts/Post.tsx` |
| `comments_opened` | User taps the comments button to open the item detail page | `components/posts/Post.tsx` |
| `story_type_changed` | User selects a different story category (top, best, ask, show) from the filter menu | `components/Select.tsx` |
| `item_external_link_opened` | User taps the external URL link on the item detail page | `app/[itemId].tsx` |
| `user_profile_viewed` | User taps a username to view that user's profile | `app/[itemId].tsx`, `components/comments/comment.tsx` |
| `comment_thread_navigated` | User navigates from a comment up to its parent item | `app/[itemId].tsx` |

## Next steps

We recommended building a **"Analytics basics"** dashboard in PostHog with the following five insights based on the events instrumented above. Create it at:

**https://us.posthog.com/project/2/dashboard**

Suggested insights to add:

1. **Content engagement funnel** — Funnel from `post_clicked` → `comments_opened` to measure how often users read comment threads after viewing a post.
2. **External link click rate** — Trend of `external_link_opened` + `item_external_link_opened` to track how frequently users leave the app to read source content.
3. **Story type preference** — Breakdown of `story_type_changed` by `to` property to see which story categories are most popular (top, best, ask, show).
4. **User profile engagement** — Trend of `user_profile_viewed` broken down by `source` (`comment` vs `item_detail`) to understand discovery paths.
5. **Comment thread depth** — Trend of `comment_thread_navigated` to measure how often users explore comment threads back to parent items.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
