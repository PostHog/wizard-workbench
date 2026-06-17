<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. The integration uses the PostHog web snippet (no npm package required) initialized via a reusable `src/components/posthog.astro` component. The component is included in `src/layouts/Layout.astro` so every page is automatically instrumented. Six client-side events are captured across four files, covering the key conversion and engagement actions on this static site.

| Event name | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicks the hero "Start Free Trial" CTA on the home page | `src/pages/index.astro` |
| `read_docs_clicked` | User clicks the hero "Read the Docs" CTA on the home page | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a plan CTA on the pricing page; includes `plan` property (`starter` or `pro`) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" for the Enterprise plan on the pricing page | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card; includes `section` property (e.g. `getting-started`) | `src/pages/docs.astro` |
| `get_started_clicked` | User clicks the "Get Started" CTA in the top navigation | `src/components/Navigation.astro` |

## Next steps

A PostHog dashboard could not be created automatically during this run because the configured API key is missing the `dashboard:write` and `query:read` scopes. To create a dashboard manually, go to [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) and build insights for the events listed above. Suggested insights:

- **Conversion funnel**: `start_free_trial_clicked` → `pricing_plan_clicked` → `contact_sales_clicked`
- **CTA click trend**: `start_free_trial_clicked` and `get_started_clicked` over time
- **Pricing plan breakdown**: `pricing_plan_clicked` broken down by `plan` property
- **Docs engagement**: `docs_section_clicked` broken down by `section` property
- **Read Docs intent**: `read_docs_clicked` trend over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
