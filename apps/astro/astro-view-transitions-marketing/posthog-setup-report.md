<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site (Astro with View Transitions / ClientRouter).

## What was done

- **Created** `src/components/posthog.astro` — PostHog web snippet with a `window.__posthog_initialized` guard to prevent stack overflow during ClientRouter soft navigation. Uses `capture_pageview: 'history_change'` for automatic pageview tracking across all soft navigations.
- **Updated** `src/layouts/Layout.astro` — Replaced `<ViewTransitions />` with `<ClientRouter />` and added the `<PostHog />` component in the `<head>`, so every page gets PostHog automatically.
- **Added event tracking** to `src/pages/index.astro`, `src/pages/pricing.astro`, `src/pages/docs.astro`, and `src/components/Navigation.astro`. All scripts use both `DOMContentLoaded` and `astro:page-load` listeners to handle soft navigations correctly, and remove/re-add listeners to prevent duplicates across transitions.
- **Configured environment variables** — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` written to `.env`.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `cta_clicked` | User clicks a hero CTA button (Start Free Trial or Read the Docs) | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a CTA on a Starter or Pro pricing plan | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks Contact Sales on the Enterprise plan | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicks the Get Started CTA in the navigation | `src/components/Navigation.astro` |

## Next steps

To explore these events, visit your PostHog project and create insights such as:

- **CTA conversion funnel**: `cta_clicked` → `pricing_plan_selected` → `contact_sales_clicked`
- **Pricing plan popularity**: Breakdown of `pricing_plan_selected` by `plan` property
- **Docs engagement**: Trend of `docs_section_clicked` broken down by `section` property
- **Navigation CTA clicks**: Trend of `nav_cta_clicked` over time

You can create these in your [PostHog project](https://us.posthog.com/project/2/insights).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
