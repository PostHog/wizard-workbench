<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Astro View Transitions marketing site by adding a reusable inline PostHog initialization component, wiring it into the shared layout, setting Astro-compatible public environment variables, and instrumenting key marketing interactions across homepage CTAs, pricing actions, feature exploration, docs engagement, navigation usage, footer usage, and about-page section visibility. The setup also preserves View Transitions behavior with the required `window.__posthog_initialized` guard and `capture_pageview: 'history_change'` so soft navigation does not re-initialize the SDK.

| Event name | Description | File |
| --- | --- | --- |
| `cta_clicked` | Captures when a visitor clicks a primary call-to-action on the home page. | `src/pages/index.astro` |
| `docs_cta_clicked` | Captures when a visitor clicks the docs call-to-action from the home page hero. | `src/pages/index.astro` |
| `pricing_plan_selected` | Captures when a visitor selects a pricing plan CTA on the pricing page. | `src/pages/pricing.astro` |
| `enterprise_contact_clicked` | Captures when a visitor clicks the enterprise contact CTA. | `src/pages/pricing.astro` |
| `feature_card_selected` | Captures when a visitor clicks a feature area that signals product interest. | `src/pages/features.astro` |
| `docs_topic_selected` | Captures when a visitor selects a documentation topic from the docs hub. | `src/pages/docs.astro` |
| `nav_cta_clicked` | Captures when a visitor clicks the main navigation get-started CTA. | `src/components/Navigation.astro` |
| `nav_link_clicked` | Captures when a visitor uses a primary navigation link. | `src/components/Navigation.astro` |
| `footer_link_clicked` | Captures when a visitor clicks a footer navigation link. | `src/components/Footer.astro` |
| `about_team_section_viewed` | Captures when a visitor views the team section on the about page as a deeper engagement signal. | `src/pages/about.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1831013)
- [Primary CTA clicks (wizard)](https://us.posthog.com/project/483112/insights/VgrdmVtT)
- [Pricing plan mix (wizard)](https://us.posthog.com/project/483112/insights/i5yMaqPL)
- [Homepage to pricing funnel (wizard)](https://us.posthog.com/project/483112/insights/VnAvUBb5)
- [Documentation engagement (wizard)](https://us.posthog.com/project/483112/insights/jiQhg9Dv)
- [Navigation and footer usage (wizard)](https://us.posthog.com/project/483112/insights/YivcrIVj)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
