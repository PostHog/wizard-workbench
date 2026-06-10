<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. PostHog is initialized via an inline snippet component added to the shared layout, so every page automatically loads the SDK. Six custom events were instrumented across four files to track the key conversion funnel — from a visitor landing on the features page, through pricing plan selection, to clicking the free-trial CTA.

| Event name | Description | File |
|---|---|---|
| `free_trial_cta_clicked` | Hero "Start Free Trial" button clicked | `src/pages/index.astro` |
| `docs_cta_clicked` | Hero "Read the Docs" link clicked | `src/pages/index.astro` |
| `pricing_plan_selected` | Pricing plan CTA clicked (property: `plan_name`: starter \| pro \| enterprise) | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | "Get Started" CTA in top navigation clicked | `src/components/Navigation.astro` |
| `docs_section_clicked` | Documentation section card clicked (property: `section_name`) | `src/pages/docs.astro` |
| `features_page_viewed` | Features page loaded (top-of-funnel entry point) | `src/pages/features.astro` |

## Next steps

The PostHog MCP key used during setup did not have the `dashboard:write` / `insight:write` / `query:read` scopes, so the dashboard could not be created automatically. You can build it manually in a few minutes:

1. **Open your dashboards** — [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)
2. **Create a new dashboard** named `Analytics basics (wizard)`.
3. **Add these insights** from [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new):
   - **Conversion funnel** — steps: `features_page_viewed` → `pricing_plan_selected` → `free_trial_cta_clicked`
   - **Pricing plan breakdown** — trends of `pricing_plan_selected`, broken down by `plan_name`
   - **CTA clicks over time** — trends of `free_trial_cta_clicked` and `nav_get_started_clicked`
   - **Docs engagement** — trends of `docs_section_clicked`, broken down by `section_name`
   - **Docs CTA clicks** — trends of `docs_cta_clicked`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
