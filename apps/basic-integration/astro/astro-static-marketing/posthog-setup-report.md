# PostHog post-wizard report

The wizard has completed a PostHog integration for this Astro static marketing site using an inline Astro snippet loaded from a reusable component in the main layout, wired client-side environment variables through `.env`, installed `posthog-js`, and added targeted capture calls for key marketing interactions across navigation, homepage CTAs, pricing, docs, features, and team engagement.

| Event name | Description | File |
| --- | --- | --- |
| hero_cta_clicked | Captures clicks on the primary hero calls to action on the home page. | `src/pages/index.astro` |
| feature_card_selected | Captures clicks on feature cards from the home page feature grid. | `src/pages/index.astro` |
| nav_cta_clicked | Captures clicks on the navigation call to action. | `src/components/Navigation.astro` |
| footer_link_clicked | Captures clicks on informational links in the footer. | `src/components/Footer.astro` |
| pricing_plan_selected | Captures clicks on pricing plan actions from the pricing page. | `src/pages/pricing.astro` |
| featured_plan_viewed | Captures when the featured pricing plan becomes visible on the page. | `src/pages/pricing.astro` |
| feature_interest_clicked | Captures clicks on detailed feature cards on the features page. | `src/pages/features.astro` |
| docs_topic_selected | Captures clicks on documentation topic cards. | `src/pages/docs.astro` |
| team_member_selected | Captures clicks on team member cards on the about page. | `src/pages/about.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846673)
- [Hero CTA clicks (wizard)](https://us.posthog.com/project/483112/insights/9PsF7z76)
- [Hero to pricing funnel (wizard)](https://us.posthog.com/project/483112/insights/1KGQNh2w)
- [Feature interest clicks (wizard)](https://us.posthog.com/project/483112/insights/YTuZZXXF)
- [Docs topic engagement (wizard)](https://us.posthog.com/project/483112/insights/nvwQALIu)
- [Pricing plan selections (wizard)](https://us.posthog.com/project/483112/insights/GCymKJZ8)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
