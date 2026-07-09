<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Astro SSR documentation site with PostHog. The setup adds the browser snippet through the shared layout, introduces a singleton `posthog-node` server client for API-side tracking, wires environment-variable based configuration for both client and server runtimes, instruments high-value documentation engagement events across navigation and content interactions, adds a server-backed feedback endpoint for docs usefulness submissions, and verifies the integration with a production build.

| Event name | Description | File |
| --- | --- | --- |
| docs_cta_clicked | Captures when a visitor clicks a homepage hero call to action. | src/pages/index.astro |
| docs_section_selected | Captures when a visitor chooses a documentation section from the homepage feature grid. | src/pages/index.astro |
| docs_nav_clicked | Captures when a visitor uses the global navigation to move through the site. | src/components/Navigation.astro |
| docs_sidebar_link_clicked | Captures when a visitor selects a page from the documentation sidebar. | src/components/DocsSidebar.astro |
| docs_quickstart_code_copied | Captures when a visitor copies the quick start SDK example from the docs. | src/pages/docs/quickstart.astro |
| docs_installation_package_manager_selected | Captures when a visitor copies an installation command for a specific package manager. | src/pages/docs/installation.astro |
| docs_workflow_example_copied | Captures when a visitor copies the workflow creation example from the docs. | src/pages/docs/workflows.astro |
| docs_automation_example_copied | Captures when a visitor copies an automation example from the docs. | src/pages/docs/automation.astro |
| docs_api_auth_example_copied | Captures when a visitor copies an authentication example from the API docs. | src/pages/docs/api/authentication.astro |
| docs_api_endpoint_reference_selected | Captures when a visitor chooses a specific endpoint example from the endpoint reference. | src/pages/docs/api/endpoints.astro |
| docs_content_feedback_submitted | Captures when a visitor submits documentation usefulness feedback from the client and server. | src/layouts/DocsLayout.astro and src/pages/api/docs-feedback.ts |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825327
- Insight: Docs CTA clicks over time (wizard) — https://us.posthog.com/project/483112/insights/MG5JDBJu
- Insight: Docs navigation clicks by location (wizard) — https://us.posthog.com/project/483112/insights/B1zwlXbi
- Insight: Content interaction mix (wizard) — https://us.posthog.com/project/483112/insights/ZRD0Pnj8
- Insight: Documentation feedback funnel (wizard) — https://us.posthog.com/project/483112/insights/AeYUYKJW
- Insight: Endpoint reference interest (wizard) — https://us.posthog.com/project/483112/insights/yCzCyVLG

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here to `.env.example` and any bootstrap setup so collaborators know what to configure: `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST`.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or bundler upload) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
