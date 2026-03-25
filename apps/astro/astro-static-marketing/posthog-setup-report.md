<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro static marketing site. A reusable `posthog.astro` component was created using the web snippet with `is:inline` to prevent Astro from processing it. The component is imported into the root `Layout.astro` so PostHog loads on every page. Five custom client-side events were instrumented across pages and shared components, covering key conversion and engagement touchpoints.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks a hero section CTA button ("Start Free Trial" or "Read the Docs") | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a pricing plan CTA (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicks a documentation section card | `src/pages/docs.astro` |
| `footer_link_clicked` | User clicks a footer link (Privacy, Terms, etc.) | `src/components/Footer.astro` |

## Next steps

Use the events above to build insights in PostHog. Here are five recommended insights for an **Analytics basics** dashboard:

1. **Hero CTA conversion** — Trend of `cta_clicked` events broken down by `label` property. Helps track which hero button drives the most clicks.
   → [Create in PostHog](https://us.posthog.com/project/238460/insights/new)

2. **Pricing plan selection funnel** — Funnel from `$pageview` (pricing page) → `pricing_plan_selected`. Shows how many visitors engage with a plan CTA.
   → [Create in PostHog](https://us.posthog.com/project/238460/insights/new)

3. **Pricing plan breakdown** — Trend of `pricing_plan_selected` broken down by `plan` property (Starter / Pro / Enterprise). Identifies which tier gets the most interest.
   → [Create in PostHog](https://us.posthog.com/project/238460/insights/new)

4. **Docs engagement** — Trend of `docs_section_clicked` broken down by `section`. Shows which documentation areas attract the most interest.
   → [Create in PostHog](https://us.posthog.com/project/238460/insights/new)

5. **Nav vs hero CTA comparison** — Trend combining `nav_cta_clicked` and `cta_clicked` to compare which entry point drives more "Get Started" intent.
   → [Create in PostHog](https://us.posthog.com/project/238460/insights/new)

To create the dashboard: [https://us.posthog.com/project/238460/dashboard](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
