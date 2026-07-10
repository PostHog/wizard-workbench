<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this React Router v7 framework-mode project. PostHog client initialization was added through a new `app/entry.client.tsx` entry with `@posthog/react` and `posthog-js`, server-side request context tracking was added through `app/lib/posthog-middleware.ts` and registered in `app/root.tsx`, Vite SSR configuration was updated to include PostHog browser packages, and the local `.env` file was updated with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`. Custom event capture was added across key conversion and engagement surfaces, and the root error boundary now captures exceptions and a dedicated error event. Verification completed with `pnpm typecheck` and `pnpm build`; the targeted lint run surfaced only pre-existing project warnings outside this integration plus two local warnings that were fixed.

| Event name | Description | File |
| --- | --- | --- |
| `cta_clicked` | Captures when a visitor clicks a primary homepage call to action. | `app/routes/home.tsx` |
| `post_liked` | Captures when a visitor likes a post in the feed. | `app/components/PostCard.tsx` |
| `followers_package_selected` | Captures when a visitor selects a fake follower package before purchase. | `app/routes/buy-followers.tsx` |
| `followers_purchase_completed` | Captures when a visitor completes a fake follower purchase flow. | `app/routes/buy-followers.tsx` |
| `follow_back_clicked` | Captures when a visitor follows back a suggested follower from the profile page. | `app/routes/profile.tsx` |
| `analytics_disclaimer_viewed` | Captures when a visitor views the analytics experience with purchased follower context. | `app/routes/analytics.tsx` |
| `about_message_viewed` | Captures when a visitor reaches the about page content. | `app/routes/about.tsx` |
| `app_error_captured` | Captures when the root error boundary catches an application error. | `app/root.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831089)
- [Homepage CTA clicks (wizard)](https://us.posthog.com/project/483112/insights/XUkVfzad)
- [Post likes (wizard)](https://us.posthog.com/project/483112/insights/yhoyl2AI)
- [Package selection to purchase funnel (wizard)](https://us.posthog.com/project/483112/insights/xWGgvRr4)
- [Follow backs (wizard)](https://us.posthog.com/project/483112/insights/G88kn0Yq)
- [Analytics and about views (wizard)](https://us.posthog.com/project/483112/insights/i0jWqWlg)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
