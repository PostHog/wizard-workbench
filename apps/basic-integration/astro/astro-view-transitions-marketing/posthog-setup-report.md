<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site (Astro with View Transitions). The following changes were made:

- **`src/components/posthog.astro`** (new): PostHog initialization snippet with the `window.__posthog_initialized` guard to prevent stack overflow during soft navigation via Astro's `ClientRouter`. Uses `capture_pageview: 'history_change'` for automatic pageview tracking on every view transition.
- **`src/layouts/Layout.astro`**: Imported and added `<PostHog />` to the `<head>`, so PostHog loads on every page.
- **`src/pages/index.astro`**: Added `cta_clicked` capture for hero "Start Free Trial" and "Read the Docs" buttons.
- **`src/pages/pricing.astro`**: Added `pricing_plan_selected` capture for Starter and Pro plan CTAs, and `enterprise_contact_clicked` for the Enterprise "Contact Sales" button.
- **`src/pages/docs.astro`**: Added `docs_section_clicked` capture for all six documentation section cards.
- **`src/components/Navigation.astro`**: Added `nav_cta_clicked` capture for the persistent "Get Started" nav button.

All event listeners are registered on both `DOMContentLoaded` and `astro:page-load` to work correctly after view transitions, and duplicate listeners are removed before re-attaching. Environment variables (`PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`) are stored in `.env` and passed to the snippet via Astro's `define:vars`.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks a hero CTA button (Start Free Trial, Read the Docs) | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks the CTA on a Starter or Pro pricing plan | `src/pages/pricing.astro` |
| `enterprise_contact_clicked` | User clicks "Contact Sales" on the Enterprise plan | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicks "Get Started" in the navigation bar | `src/components/Navigation.astro` |

## Next steps

We attempted to create an "Analytics basics" dashboard automatically, but the PostHog API key is missing the required scopes (`dashboard:write`, `query:read`, `insight:write`). To add these scopes, go to [PostHog personal API keys settings](/settings/user-api-keys) and update your key.

Once scopes are added, we recommend building a dashboard at [/dashboard](/dashboard) with the following insights:

1. **CTA conversion funnel** — funnel from `$pageview` (pricing page) → `pricing_plan_selected`
2. **Plan selection breakdown** — trends for `pricing_plan_selected` broken down by `plan` property
3. **Enterprise pipeline** — trend of `enterprise_contact_clicked` over time
4. **Docs engagement** — trends for `docs_section_clicked` broken down by `section` property
5. **Nav CTA clicks** — trend of `nav_cta_clicked` over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
