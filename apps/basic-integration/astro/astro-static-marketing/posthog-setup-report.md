<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this NeuralFlow AI static Astro marketing site.

## What was added

- **`src/components/posthog.astro`** — new reusable PostHog snippet component using `is:inline` and `define:vars` to inject environment variables at build time without TypeScript errors.
- **`src/layouts/Layout.astro`** — imports and renders `<PostHog />` in the `<head>`, so every page on the site initialises PostHog automatically.
- **`.env`** — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set from project credentials.

Custom events were added to four files to capture the most business-critical user actions across the marketing funnel:

| Event | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicks "Start Free Trial" or "Read the Docs" in the homepage hero | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a CTA on the pricing page (Starter / Pro / Enterprise) | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation category card | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" button in the top navigation bar | `src/components/Navigation.astro` |

## Next steps

With these events flowing into PostHog you can build insights directly in the [Insights view](/insights) to answer questions like:

- **Conversion funnel**: how many visitors who land on the pricing page go on to click a plan CTA?
- **Top CTA**: which hero button drives more clicks — "Start Free Trial" or "Read the Docs"?
- **Plan interest**: which pricing plan attracts the most clicks?
- **Docs engagement**: which documentation section is most explored?

Suggested dashboard: create an **"Analytics basics"** dashboard in [Dashboards](/dashboards) and add trend insights for each of the four events above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
