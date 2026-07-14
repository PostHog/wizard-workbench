# PostHog post-wizard report

The wizard has completed a deep integration of this Astro SSR documentation site with PostHog. The integration now initializes the PostHog browser snippet from Astro environment variables in the shared layout, adds a server-side `posthog-node` singleton for API tracking, instruments high-intent documentation interactions across the site, and adds a server endpoint for feedback submission analytics with server-side event capture and exception tracking. The SDK packages were installed, the required Astro environment variables were written to `.env`, and the app build completed successfully after the changes.

| Event name | Description | File |
| --- | --- | --- |
| `homepage_cta_clicked` | Captures when a visitor clicks a primary call-to-action from the homepage. | `src/pages/index.astro` |
| `docs_nav_cta_clicked` | Captures when a visitor clicks the Get Started navigation call-to-action. | `src/components/Navigation.astro` |
| `docs_sidebar_navigation_clicked` | Captures when a visitor navigates between documentation sections from the sidebar. | `src/components/DocsSidebar.astro` |
| `quickstart_code_copied` | Captures when a visitor copies the quick start installation or code example. | `src/pages/docs/quickstart.astro` |
| `installation_command_copied` | Captures when a visitor copies an installation command from the installation guide. | `src/pages/docs/installation.astro` |
| `api_authentication_example_copied` | Captures when a visitor copies an authentication example from the API docs. | `src/pages/docs/api/authentication.astro` |
| `api_endpoints_reference_viewed` | Captures when a visitor views the API endpoints reference as a funnel entry point. | `src/pages/docs/api/endpoints.astro` |
| `workflow_example_copied` | Captures when a visitor copies a workflow automation example. | `src/pages/docs/workflows.astro` |
| `automation_example_copied` | Captures when a visitor copies an automation example. | `src/pages/docs/automation.astro` |
| `docs_feedback_submitted` | Captures when a visitor submits documentation feedback from the client. | `src/pages/docs/api/index.astro` |
| `docs_feedback_received` | Captures when the server receives documentation feedback submissions. | `src/pages/api/docs-feedback.ts` |
| `docs_feedback_failed` | Captures when documentation feedback submission fails on the server. | `src/pages/api/docs-feedback.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1846660)
- Insight: [Homepage CTA clicks (wizard)](https://us.posthog.com/project/483112/insights/dz4eOeM1)
- Insight: [Docs feedback funnel (wizard)](https://us.posthog.com/project/483112/insights/8XK72mdD)
- Insight: [Content copies by event (wizard)](https://us.posthog.com/project/483112/insights/Jvkpc9HJ)
- Insight: [Sidebar navigation by destination (wizard)](https://us.posthog.com/project/483112/insights/lZF04YzC)
- Insight: [Feedback failures (wizard)](https://us.posthog.com/project/483112/insights/tkbKP0wT)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
