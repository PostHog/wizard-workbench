<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. A `posthog.astro` component was created with an initialization guard (`window.__posthog_initialized`) to prevent stack overflow errors during Astro View Transitions soft navigation. The component uses `capture_pageview: 'history_change'` for automatic pageview tracking on navigation. The component is imported in `src/layouts/Layout.astro` so it applies to every page. Six custom events were instrumented across four pages and one shared component, targeting the key conversion and engagement touchpoints on the site.

| Event | Description | File |
|---|---|---|
| `free_trial_started` | User clicked the 'Start Free Trial' CTA in the hero section of the homepage. | `src/pages/index.astro` |
| `docs_link_clicked` | User clicked the 'Read the Docs' link in the hero section of the homepage. | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked a CTA button on a pricing plan (Starter or Pro). | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked the 'Contact Sales' CTA for the Enterprise pricing plan. | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked a documentation section card on the Docs page. | `src/pages/docs.astro` |
| `get_started_clicked` | User clicked the 'Get Started' CTA button in the top navigation bar. | `src/components/Navigation.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1812923)
- [Free Trial Conversions (wizard)](https://us.posthog.com/project/483112/insights/WHMmKe6m)
- [Pricing Plan Selections (wizard)](https://us.posthog.com/project/483112/insights/NKy5n0Pi)
- [CTA Engagement (wizard)](https://us.posthog.com/project/483112/insights/trr0NeOh)
- [Docs Section Engagement (wizard)](https://us.posthog.com/project/483112/insights/GSpyxJSL)
- [Marketing CTA Funnel (wizard)](https://us.posthog.com/project/483112/insights/OFao1gQ4)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
