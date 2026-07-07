# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Astro hybrid marketing site (NeuralFlow AI). Client-side analytics are initialized via a `posthog.astro` snippet component injected into the shared `Layout.astro`, ensuring every page is tracked. Server-side tracking uses a `posthog-node` singleton (`src/lib/posthog-server.ts`) wired into the contact form API route. The contact form submission flow is instrumented end-to-end: the client passes its PostHog session and distinct IDs as request headers so server events are correlated to the same session, and `posthog.identify()` is called both client-side and server-side on successful form submission to link the anonymous visitor to a known person. Error tracking is included via `posthog.captureException()` on network failures and server errors.

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the primary "Start Free Trial" CTA on the hero. | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked the "Contact Sales" link from the hero section. | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a plan button on the pricing page (starter / pro / enterprise). | `src/pages/pricing.astro` |
| `contact_form_submitted` | User successfully submitted the contact form (client-side, after server confirmed). | `src/pages/contact.astro` |
| `contact_form_submission_received` | Server received and validated a contact form submission. | `src/pages/api/contact.ts` |
| `contact_form_submission_failed` | Server returned a validation or internal error for a contact form submission. | `src/pages/api/contact.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1812932)
- [Contact form submissions over time](https://us.posthog.com/project/483112/insights/8F6Gwncd)
- [Pricing plan clicks by plan](https://us.posthog.com/project/483112/insights/vDbr4H30)
- [CTA to contact form conversion funnel](https://us.posthog.com/project/483112/insights/M8ziSirs)
- [Contact form interest breakdown](https://us.posthog.com/project/483112/insights/fm1zeE9c)
- [CTA and contact sales clicks](https://us.posthog.com/project/483112/insights/aHInwAv1)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current integration only identifies on contact form submission; users who return without submitting the form will remain on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
