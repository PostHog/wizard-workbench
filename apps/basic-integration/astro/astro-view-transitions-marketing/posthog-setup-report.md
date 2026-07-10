# PostHog post-wizard report

The wizard has completed a PostHog analytics integration for this Astro marketing site (NeuralFlow AI). The integration uses the PostHog web snippet with a view-transitions initialization guard to prevent stack overflow during soft navigation. Automatic pageview tracking is enabled via `capture_pageview: 'history_change'`. Four business-critical click events were instrumented across the site's key conversion pages and components.

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicks "Start Free Trial" or "Read the Docs" in the homepage hero section | `src/pages/index.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" button in the top navigation | `src/components/Navigation.astro` |
| `pricing_plan_selected` | User clicks a pricing plan button (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `docs_section_opened` | User clicks a documentation section card | `src/pages/docs.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard** — [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1829149)
- [CTA clicks over time (wizard)](https://us.posthog.com/project/483112/insights/vtAGn9K6) — daily trend of homepage and nav CTA clicks
- [CTA clicks by type (wizard)](https://us.posthog.com/project/483112/insights/6oXhcZTe) — breakdown showing "Start Free Trial" vs "Read the Docs" vs "Get Started"
- [Pricing plan interest (wizard)](https://us.posthog.com/project/483112/insights/05U3lSt4) — breakdown showing Starter, Pro, and Enterprise plan click volume
- [CTA to pricing conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/U7bqg3lN) — funnel from any CTA click to a pricing plan selection
- [Docs section engagement (wizard)](https://us.posthog.com/project/483112/insights/Iu9dv8MN) — breakdown of which documentation sections users open

Dashboard subscription and alerts were not created — the wizard was unable to prompt for consent in this environment. To set these up manually, visit the dashboard and use the "Subscribe" and "Alerts" options in the dashboard menu.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
