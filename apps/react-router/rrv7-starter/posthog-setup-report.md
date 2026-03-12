<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloutHub React Router v7 app. The integration covers client-side initialization, error tracking, and event capture across the key user conversion and engagement flows.

**Changes made:**

- **`app/entry.client.tsx`** *(new file)*: Initializes PostHog with your project token and wraps `HydratedRouter` in `PostHogProvider`. This enables the `usePostHog()` hook throughout the app and starts session replay and autocapture.
- **`app/root.tsx`**: Added `usePostHog()` and `captureException()` in the `ErrorBoundary` to automatically track unhandled React Router errors.
- **`vite.config.ts`**: Added `posthog-js` and `@posthog/react` to SSR `noExternal` for dev builds, and added an `/ingest` proxy to route PostHog events through your server (helps avoid ad blockers).
- **`app/routes/buy-followers.tsx`**: Tracks package selection and purchase completion — the core conversion funnel.
- **`app/components/PostCard.tsx`**: Tracks post likes and unlikes — key engagement signals.
- **`app/routes/profile.tsx`**: Tracks when users follow back fake followers — social engagement metric.
- **`app/routes/home.tsx`**: Tracks CTA clicks on the home page hero buttons — top-of-funnel acquisition.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `package_selected` | User selects a follower package on the buy-followers page | `app/routes/buy-followers.tsx` |
| `purchase_completed` | User completes a fake follower purchase, including package details and follower count | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a previously liked post in the feed | `app/components/PostCard.tsx` |
| `user_followed` | User follows a fake follower back from the profile page | `app/routes/profile.tsx` |
| `cta_clicked` | User clicks a call-to-action button on the home page (view_feed or buy_followers) | `app/routes/home.tsx` |

## Next steps

We've set up tracking for the key events. To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

- **[Conversion funnel: Home → Buy → Purchase](https://us.posthog.com/project/2/insights/new#funnel)** — Steps: `cta_clicked` (cta=buy_followers) → `package_selected` → `purchase_completed`
- **[Purchase completions over time](https://us.posthog.com/project/2/insights/new#trends)** — Trend of `purchase_completed` events, broken down by `price` or `total_followers`
- **[CTA click breakdown](https://us.posthog.com/project/2/insights/new#trends)** — Trend of `cta_clicked`, filtered by `cta` property to compare feed vs buy-followers traffic
- **[Feed engagement: likes over time](https://us.posthog.com/project/2/insights/new#trends)** — Trend of `post_liked` events
- **[Social engagement: follows over time](https://us.posthog.com/project/2/insights/new#trends)** — Trend of `user_followed` events

Visit your [PostHog project](https://us.posthog.com/project/2) to create and configure these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
