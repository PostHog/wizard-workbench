<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro marketing site (View Transitions). The integration uses the PostHog web snippet with a `window.__posthog_initialized` guard to prevent stack overflow errors during client-side navigation, and sets `capture_pageview: 'history_change'` for automatic pageview tracking across all soft navigations powered by Astro's `<ViewTransitions />` (ClientRouter).

A reusable `posthog.astro` component was created and added to the shared `Layout.astro`, so every page is automatically instrumented. Event tracking scripts use both `DOMContentLoaded` and `astro:page-load` listeners to ensure event handlers are properly re-attached after view transitions, with `removeEventListener` guards to prevent duplicate handler registration.

Environment variables `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` are stored in `.env` and referenced via `import.meta.env` in the PostHog component — no keys are hardcoded in source files.

| Event Name | Description | File |
|---|---|---|
| `cta_clicked` | User clicks the primary "Start Free Trial" CTA on the hero section | `src/pages/index.astro` |
| `docs_link_clicked` | User clicks the "Read the Docs" secondary CTA on the hero section | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a pricing plan CTA (Starter or Pro), with `plan` and `price` properties | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks the "Contact Sales" button on the Enterprise pricing plan | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card, with `section` property | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |

## Next steps

To create an "Analytics basics" dashboard with insights for these events, visit your PostHog project and create insights for:

1. **CTA conversion trend** — Trend of `cta_clicked` over time, to measure homepage conversion interest
2. **Pricing plan funnel** — Funnel from `pricing_plan_selected` (Starter/Pro) → `contact_sales_clicked` (Enterprise), to track plan interest distribution
3. **Pricing plan breakdown** — Breakdown of `pricing_plan_selected` by `plan` property, to compare Starter vs Pro selection rates
4. **Docs engagement** — Breakdown of `docs_section_clicked` by `section` property, to see which docs are most popular
5. **Nav vs Hero CTA comparison** — Stacked trend of `cta_clicked`, `nav_cta_clicked`, and `docs_link_clicked`, to compare conversion paths

You can create a new dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
