<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the NeuralFlow AI Astro hybrid marketing site. A `posthog.astro` snippet component was created and added to the shared `Layout.astro` so all pages load the PostHog web SDK automatically. A server-side singleton (`src/lib/posthog-server.ts`) was created using `posthog-node` to track events from the API layer. Client-side CTA clicks are captured on the home and pricing pages, the contact form tracks submission attempts and user identity on success, and the API route captures server-side form completion, validation failures, and server errors — with session and distinct ID correlation between client and server.

| Event name | Description | File |
|---|---|---|
| `free_trial_started` | User clicks the 'Start Free Trial' CTA on the hero section or pricing page. | `src/pages/index.astro`, `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks the 'Contact Sales' CTA on the hero section or Enterprise pricing card. | `src/pages/index.astro`, `src/pages/pricing.astro` |
| `pricing_plan_selected` | User clicks a 'Get Started' button on a specific pricing plan card. | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submits the contact form on the contact page (client-side submission attempt). | `src/pages/contact.astro` |
| `contact_form_completed` | Contact form submission was successfully processed by the server. | `src/pages/api/contact.ts` |
| `contact_form_failed` | Contact form submission failed due to validation errors or a server error. | `src/pages/api/contact.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1787320)
- [Free Trial Conversion](https://us.posthog.com/project/483112/insights/IERPVGZY)
- [Contact Sales Clicks](https://us.posthog.com/project/483112/insights/FQRKlkLs)
- [Pricing Plan Selection](https://us.posthog.com/project/483112/insights/4GXMfLb7)
- [Contact Form Funnel](https://us.posthog.com/project/483112/insights/wnDyjq8C)
- [Contact Form Failures](https://us.posthog.com/project/483112/insights/3Yt4xP8a)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the contact form identify call only fires on successful form submission, so returning visitors who don't resubmit the form will have anonymous sessions until they do.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
