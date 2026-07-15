# PostHog post-wizard report

The wizard has integrated PostHog analytics into this Astro SSR documentation site. It added environment-based browser initialization to the shared layout, installed the PostHog browser and Node SDKs, and added focused click tracking for homepage calls to action, header navigation, and documentation sidebar navigation. A reusable server-side `posthog-node` singleton is also ready for future API routes, configured to flush immediately for short-lived SSR handlers.

| Event name | Description | Added in |
| --- | --- | --- |
| `documentation_cta_clicked` | Captures a primary documentation call-to-action selection from the homepage. | `src/pages/index.astro` |
| `documentation_navigation_clicked` | Captures a documentation navigation selection and its destination category. | `src/components/Navigation.astro` |
| `documentation_sidebar_link_clicked` | Captures a documentation sidebar selection and its destination category. | `src/components/DocsSidebar.astro` |

## Next steps

The PostHog MCP dashboard service was unavailable during this run, so a dashboard, insights, and shareable notebook could not be created. Once the service is available, create **Analytics basics (wizard)** and add trends for the three events above.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
