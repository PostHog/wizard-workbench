<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Astro hybrid marketing site with PostHog. Client-side PostHog initialization was added through a reusable Astro component injected in the shared layout, server-side tracking was added through a singleton `posthog-node` client for the contact API route, contact-form identify flows now connect browser and backend events, and marketing CTA interactions plus contact-form success and failure paths are now captured for analysis.

| Event name | Description | File |
| --- | --- | --- |
| `cta_clicked` | Tracks when a visitor clicks a primary marketing call to action. | `src/pages/index.astro` |
| `pricing_cta_clicked` | Tracks when a visitor clicks a pricing plan call to action. | `src/pages/pricing.astro` |
| `contact_sales_clicked` | Tracks when a visitor clicks a contact sales call to action from pricing. | `src/pages/pricing.astro` |
| `contact_form_submitted` | Tracks when a visitor successfully submits the contact form. | `src/pages/contact.astro` |
| `contact_form_submission_failed` | Tracks when a contact form submission fails in the browser. | `src/pages/contact.astro` |
| `contact_form_received` | Tracks when the server accepts a valid contact form submission. | `src/pages/api/contact.ts` |
| `contact_form_validation_failed` | Tracks when the contact API rejects invalid form input. | `src/pages/api/contact.ts` |
| `contact_form_server_error` | Tracks when the contact API encounters an unexpected error. | `src/pages/api/contact.ts` |
| `navigation_cta_clicked` | Tracks when a visitor clicks the primary navigation call to action. | `src/components/Navigation.astro` |
| `footer_link_clicked` | Tracks when a visitor clicks a footer navigation link. | `src/components/Footer.astro` |

## Next steps

We've built some insights and a dashboard for ongoing visibility into visitor intent and lead capture:

- [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1831017)
- [Top marketing CTAs (wizard)](https://us.posthog.com/project/483112/insights/YO5l6BpE)
- [Contact funnel (wizard)](https://us.posthog.com/project/483112/insights/ZrEXxgWe)
- [Contact outcomes (wizard)](https://us.posthog.com/project/483112/insights/MZ9J3U38)
- [Lead capture volume (wizard)](https://us.posthog.com/project/483112/insights/XDbLaa9A)
- [Footer engagement (wizard)](https://us.posthog.com/project/483112/insights/K4WaFBWE)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
