<wizard-report>
# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for CloutHub, a React Router v7 Framework mode application. PostHog is initialized in `app/entry.client.tsx` with `posthog-js` and wrapped via `PostHogProvider` from `@posthog/react`. Six business events are captured across five files, covering the core conversion funnel (package selection → purchase), feed engagement (likes/unlikes), social interactions (follow-back), and homepage CTA clicks. Error tracking is wired into the root `ErrorBoundary` via `usePostHog().captureException()`. Environment variables (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`) are stored in `.env` and referenced via `import.meta.env`. The `vite.config.ts` was updated to add `posthog-js` and `@posthog/react` to `ssr.noExternal` so both packages are bundled correctly during SSR.

| Event Name | Description | File |
|---|---|---|
| `package_selected` | User selects a fake follower package on the buy followers page. | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower purchase with a chosen package. | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed. | `app/components/PostCard.tsx` |
| `post_unliked` | User removes a like from a previously liked post. | `app/components/PostCard.tsx` |
| `follower_followed_back` | User clicks Follow back on one of their fake bot followers. | `app/routes/profile.tsx` |
| `cta_clicked` | User clicks a call-to-action button on the home page. | `app/routes/home.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793528)
- [Purchase Funnel: Package Selected → Purchased](https://us.posthog.com/project/483112/insights/hH1I0jKI)
- [Followers Purchased Over Time](https://us.posthog.com/project/483112/insights/KtAQdYL5)
- [Post Engagement: Likes & Unlikes](https://us.posthog.com/project/483112/insights/888dFnsY)
- [Follow Back Interactions](https://us.posthog.com/project/483112/insights/0VJcfCs3)
- [Home CTA Clicks by Button](https://us.posthog.com/project/483112/insights/4lBjt7z3)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
