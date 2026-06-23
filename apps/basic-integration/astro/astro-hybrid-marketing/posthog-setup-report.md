<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the NeuralFlow AI marketing site. Client-side tracking is initialized via a `posthog.astro` snippet component included in the shared `Layout.astro`, so every page automatically loads the PostHog SDK. A server-side singleton (`src/lib/posthog-server.ts`) using `posthog-node` is wired into the `/api/contact` route for dual-tracking of form submissions — client and server events are correlated via `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers. Error tracking is enabled for network failures using `captureException`.

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicks the primary 'Start Free Trial' call-to-action on the homepage hero section. | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks the 'Contact Sales' button on the homepage hero section. | `src/pages/index.astro` |
| `pricing_page_viewed` | User views the pricing page, marking the top of the conversion funnel. | `src/pages/pricing.astro` |
| `pricing_plan_selected` | User clicks 'Get Started' or 'Start Free Trial' on a specific pricing plan. | `src/pages/pricing.astro` |
| `enterprise_contact_clicked` | User clicks 'Contact Sales' from the Enterprise pricing card. | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submits the contact form successfully on the client side. | `src/pages/contact.astro` |
| `contact_form_failed` | Contact form submission fails due to a network or client-side error. | `src/pages/contact.astro` |
| `get_started_clicked` | User clicks the 'Get Started' CTA button in the navigation bar. | `src/components/Navigation.astro` |
| `contact_form_received` | Contact form submission is successfully processed by the server-side API route. | `src/pages/api/contact.ts` |
| `contact_form_validation_failed` | Contact form API returns a validation error for missing or invalid fields. | `src/pages/api/contact.ts` |
| `contact_form_server_error` | Contact form API encounters an unexpected server error during processing. | `src/pages/api/contact.ts` |

## Next steps

We've set up tracking for the key marketing and conversion events. Head to your PostHog dashboards to create insights based on these events:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard)

Suggested insights to build:
- **Conversion funnel**: `pricing_page_viewed` → `pricing_plan_selected` or `enterprise_contact_clicked` → `contact_form_submitted`
- **CTA engagement**: Trend of `cta_clicked` + `get_started_clicked` over time
- **Contact form success rate**: `contact_form_submitted` vs `contact_form_failed` breakdown
- **Plan selection breakdown**: `pricing_plan_selected` filtered by the `plan` property
- **Server-side form health**: `contact_form_received` vs `contact_form_validation_failed` vs `contact_form_server_error`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
