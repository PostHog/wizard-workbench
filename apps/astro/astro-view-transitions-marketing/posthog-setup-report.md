<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro (View Transitions) marketing site. Here's a summary of every change made:

- **`src/components/posthog.astro`** *(new file)* — PostHog initialization snippet using `is:inline` to bypass Astro's TypeScript processing. Reads `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` from environment variables via `define:vars`. Wraps initialization in a `window.__posthog_initialized` guard to prevent stack overflow during ClientRouter soft navigation. Sets `capture_pageview: 'history_change'` for automatic pageview tracking on every view transition.

- **`src/layouts/Layout.astro`** *(edited)* — Imported the new `PostHog` component and rendered it inside `<head>`, directly after `<ViewTransitions />`. This ensures PostHog loads on every page that uses the shared layout.

- **`src/components/Navigation.astro`** *(edited)* — Added an `is:inline` script that attaches a click listener to the "Get Started" nav CTA, firing `nav_get_started_clicked`. Uses both `DOMContentLoaded` and `astro:page-load` event listeners with `removeEventListener` guards to avoid duplicate handlers across view transitions.

- **`src/components/Footer.astro`** *(edited)* — Added an `is:inline` script that attaches click listeners to all `.footer-link` elements, firing `footer_link_clicked` with `link_text` and `link_href` properties.

- **`src/pages/index.astro`** *(edited)* — Added `id` attributes to the hero CTAs and an `is:inline` script firing `cta_clicked` (Start Free Trial) and `docs_cta_clicked` (Read the Docs) with `cta_text` and `cta_location` properties.

- **`src/pages/pricing.astro`** *(edited)* — Added `data-plan` and `data-price` attributes to the three pricing plan CTAs and an `is:inline` script firing `pricing_plan_selected` with `plan_name`, `plan_price`, and `cta_text` properties.

- **`src/pages/features.astro`** *(edited)* — Added an `is:inline` script firing `features_viewed` on page load, marking the top of the conversion funnel.

- **`src/pages/docs.astro`** *(edited)* — Added an `is:inline` script that attaches click listeners to each documentation section card, firing `docs_section_clicked` with a `section_name` property.

- **`.env`** *(new file)* — Created with `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` set to the correct values. Covered by `.gitignore`.

- **`package.json`** *(updated automatically)* — `posthog-js` added as a dependency (version `^1.354.0`).

## Events instrumented

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the primary "Start Free Trial" CTA on the homepage hero | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicked the "Read the Docs" secondary CTA on the homepage hero | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked a pricing plan CTA (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `features_viewed` | User landed on the Features page — top of the conversion funnel | `src/pages/features.astro` |
| `docs_section_clicked` | User clicked a documentation section card (Getting Started, API Reference, etc.) | `src/pages/docs.astro` |
| `nav_get_started_clicked` | User clicked the "Get Started" CTA in the top navigation bar | `src/components/Navigation.astro` |
| `footer_link_clicked` | User clicked a footer link (Privacy, Terms, Features, etc.) | `src/components/Footer.astro` |

## Next steps

To monitor user behavior based on the events just instrumented, visit your PostHog project and create insights for:

- **Conversion funnel**: `features_viewed` → `pricing_plan_selected` → `cta_clicked` — see how users move from discovery to trial signup
- **CTA engagement trend**: `cta_clicked` + `nav_get_started_clicked` over time — track hero and nav CTA performance day by day
- **Pricing plan breakdown**: `pricing_plan_selected` filtered by `plan_name` — see which plans users click most
- **Docs engagement**: `docs_section_clicked` broken down by `section_name` — identify the most-visited docs topics
- **Footer link clicks**: `footer_link_clicked` broken down by `link_text` — understand what users look for in the footer

Suggested dashboard: [https://us.posthog.com/project/238460/dashboard](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
