<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro static marketing site (NeuralFlow AI). Here is a summary of the changes made:

- **`src/components/posthog.astro`** — Created a new PostHog snippet component using the `is:inline` directive to prevent Astro from processing it. Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables via `define:vars`.
- **`src/layouts/Layout.astro`** — Imported and rendered `<PostHog />` inside `<head>` so every page in the site initializes PostHog automatically.
- **`.env`** — Created with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` values (gitignore coverage ensured).
- **`src/pages/index.astro`** — Added click event tracking for the hero "Start Free Trial" and "Read the Docs" CTA buttons.
- **`src/pages/pricing.astro`** — Added `data-plan` attributes to all three plan CTA buttons and a delegated click handler that captures the plan name and action type.
- **`src/pages/docs.astro`** — Added `data-docs-section` attributes to each documentation section card and a delegated click handler.
- **`src/components/Navigation.astro`** — Added `nav_get_started_clicked` capture to the "Get Started" nav CTA.
- **`src/components/Footer.astro`** — Added `footer_link_clicked` capture with `link_label` property for all footer links.

| Event | Description | File |
|---|---|---|
| `free_trial_clicked` | User clicks "Start Free Trial" in the homepage hero | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicks "Read the Docs" from the homepage hero | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a plan CTA on pricing page (includes `plan_name` and `action` properties) | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a docs section card (includes `section_name` property) | `src/pages/docs.astro` |
| `nav_get_started_clicked` | User clicks "Get Started" in the top navigation | `src/components/Navigation.astro` |
| `footer_link_clicked` | User clicks a footer link (includes `link_label` property) | `src/components/Footer.astro` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with insights based on these events:

1. **CTA conversion trend** — Trends chart for `free_trial_clicked` and `pricing_plan_selected` over time to measure top-of-funnel conversion.
2. **Pricing funnel** — Funnel from `pricing_plan_selected` broken down by `plan_name` to see which plans attract the most intent.
3. **Docs engagement** — Trends chart for `docs_section_clicked` broken down by `section_name` to track which docs topics drive the most interest.
4. **Navigation CTA clicks** — Trends chart for `nav_get_started_clicked` vs `free_trial_clicked` to compare CTA placement effectiveness.
5. **Footer engagement** — Trends for `footer_link_clicked` broken down by `link_label`.

Create the dashboard here: [/dashboard](/dashboard)

Browse and explore events as they come in: [/data-management/events](/data-management/events)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
