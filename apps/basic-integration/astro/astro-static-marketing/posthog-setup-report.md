<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for the NeuralFlow AI Astro static marketing site. A reusable `posthog.astro` component was created that initialises PostHog via the browser snippet using the `is:inline` directive and reads credentials from environment variables. The component is imported and rendered inside `<head>` in `src/layouts/Layout.astro`, so every page on the site automatically loads PostHog. Event tracking was then added to the four highest-value pages and the shared navigation component.

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked a primary call-to-action button such as 'Start Free Trial' or 'Get Started'. | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked the get-started or contact-sales button on a specific pricing plan. | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked on a documentation section card such as 'Getting Started' or 'API Reference'. | `src/pages/docs.astro` |
| `nav_link_clicked` | User clicked a navigation link in the top navigation bar. | `src/components/Navigation.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behaviour, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824441)
- **CTA clicks over time**: [https://us.posthog.com/project/483112/insights/r5N57IOi](https://us.posthog.com/project/483112/insights/r5N57IOi)
- **Pricing plan selection breakdown**: [https://us.posthog.com/project/483112/insights/VtRmaRst](https://us.posthog.com/project/483112/insights/VtRmaRst)
- **Docs section clicks**: [https://us.posthog.com/project/483112/insights/EaM200td](https://us.posthog.com/project/483112/insights/EaM200td)
- **CTA to pricing funnel**: [https://us.posthog.com/project/483112/insights/0I9qTsoQ](https://us.posthog.com/project/483112/insights/0I9qTsoQ)
- **Top navigation links clicked**: [https://us.posthog.com/project/483112/insights/owdDl2nR](https://us.posthog.com/project/483112/insights/owdDl2nR)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
