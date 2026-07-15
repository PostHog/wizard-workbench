# PostHog post-wizard report

The wizard integrated PostHog browser analytics into this React Router v7 framework-mode app. It installed `posthog-js` and `@posthog/react`, initialized PostHog from Vite environment variables, configured SSR bundling compatibility, and added exception capture at the application error boundary. Autocapture and session recording remain enabled by their SDK defaults.

Custom events track the primary simulated conversion flow and social engagement actions. Event properties contain only non-PII operational context.

| Event name | Description | File |
| --- | --- | --- |
| `follower_package_selected` | Captures when a visitor selects a fake follower package to evaluate purchase intent. | `app/routes/buy-followers.tsx` |
| `follower_purchase_completed` | Captures when the simulated follower purchase completes with its selected package details. | `app/routes/buy-followers.tsx` |
| `post_like_toggled` | Captures when a visitor likes or unlikes a feed post. | `app/components/PostCard.tsx` |
| `profile_followed` | Captures when a visitor follows back a profile from their recent followers list. | `app/routes/profile.tsx` |

## Next steps

- PostHog environment variables were configured locally as `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- The PostHog MCP endpoint was unavailable during this run, so the requested dashboard, insights, and mirrored notebook could not be created. Create an **Analytics basics (wizard)** dashboard when MCP access is restored, using the four events above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
