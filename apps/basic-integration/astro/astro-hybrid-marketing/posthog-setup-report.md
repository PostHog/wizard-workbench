<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the NeuralFlow AI marketing site. PostHog's client-side snippet is loaded in the shared `Layout.astro` so all pages are automatically tracked. A reusable `src/components/posthog.astro` component handles initialization via environment variables. A server-side singleton at `src/lib/posthog-server.ts` provides `posthog-node` access in API routes. Key user actions — CTA clicks, pricing plan selections, and contact form submissions — are captured on both client and server, with the contact form also calling `posthog.identify()` so visitors are linked to a named person on submission.

| Event | Description | File |
|---|---|---|
| `free_trial_clicked` | User clicked the 'Start Free Trial' CTA button on the homepage hero | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked the 'Contact Sales' button on the homepage hero | `src/pages/index.astro` |
| `pricing_plan_cta_clicked` | User clicked a pricing plan CTA (Starter, Pro, or Enterprise) on the pricing page | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submitted the contact form (client-side, before server response) | `src/pages/contact.astro` |
| `contact_form_received` | Server successfully received and validated a contact form submission | `src/pages/api/contact.ts` |
| `contact_form_failed` | Contact form submission resulted in a validation or server error | `src/pages/api/contact.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1795889)
- [Lead Generation Funnel](https://us.posthog.com/project/483112/insights/eWJ66Fsb)
- [CTA Clicks Over Time](https://us.posthog.com/project/483112/insights/aPQ03znY)
- [Pricing Plan CTA Clicks by Plan](https://us.posthog.com/project/483112/insights/bJ7xctpH)
- [Contact Form Submissions](https://us.posthog.com/project/483112/insights/dOkkhgWu)
- [Contact Form Failure Rate](https://us.posthog.com/project/483112/insights/PjxVgRyS)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh contact form submit can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
