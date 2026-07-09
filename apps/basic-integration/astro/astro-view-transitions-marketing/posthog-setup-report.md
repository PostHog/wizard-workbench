<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro (View Transitions) marketing site. The integration includes:

- **PostHog snippet component** (`src/components/posthog.astro`): Created a reusable PostHog initialization component using the web snippet with `is:inline` to prevent TypeScript errors. Includes the `window.__posthog_initialized` guard to prevent stack overflow during Astro's ClientRouter soft navigation, and `capture_pageview: 'history_change'` for automatic pageview tracking across view transitions.
- **Layout update** (`src/layouts/Layout.astro`): Imported and added the PostHog component to the `<head>` so it initializes on every page.
- **Environment variables** (`.env`): Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` using Astro's `PUBLIC_` prefix convention for client-side access.
- **Event tracking** across 4 files with 6 instrumented events, using `is:inline` scripts with `DOMContentLoaded` + `astro:page-load` dual-listener pattern for correct behavior under view transitions.

| Event Name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked a primary call-to-action button (Start Free Trial or Get Started) on any page. | `src/pages/index.astro` |
| `docs_link_clicked` | User clicked the 'Read the Docs' button on the hero section of the home page. | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA button on the pricing page. | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked the 'Contact Sales' button for the Enterprise plan on the pricing page. | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked a documentation section card on the docs page. | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicked the 'Get Started' call-to-action button in the navigation bar. | `src/components/Navigation.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824426)
- [CTA clicks over time (wizard)](https://us.posthog.com/project/483112/insights/vbFe5gEP)
- [Pricing page to CTA conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/bLut8pb7)
- [Pricing plan clicks by plan (wizard)](https://us.posthog.com/project/483112/insights/rDXDkxuA)
- [Docs section engagement (wizard)](https://us.posthog.com/project/483112/insights/mI40sgOb)
- [Contact sales vs plan trial clicks (wizard)](https://us.posthog.com/project/483112/insights/yAEd9hzi)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
