<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Astro hybrid marketing site (NeuralFlow AI). The integration includes:

- **Client-side analytics** via the PostHog web snippet, loaded from `src/components/posthog.astro` and injected into every page through the shared `Layout.astro`.
- **Server-side analytics** via `posthog-node`, using a singleton client in `src/lib/posthog-server.ts`. Server events are captured in the `/api/contact` route.
- **Session correlation**: The contact form passes `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers to the API so client and server events can be tied to the same user session.
- **Error tracking**: `posthog.captureException()` is called on network errors in the contact form.
- **Environment variables**: PostHog token and host are stored in `.env` and referenced via `import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN` / `import.meta.env.PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" in the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a Starter or Pro pricing plan CTA | `src/pages/pricing.astro` |
| `pricing_enterprise_contact_clicked` | User clicked "Contact Sales" on the Enterprise card | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicked "Get Started" in the navigation bar | `src/components/Navigation.astro` |
| `contact_form_submitted` | Contact form submitted (client-side, before server response) | `src/pages/contact.astro` |
| `contact_form_success` | Contact form submission confirmed successful | `src/pages/contact.astro` |
| `contact_form_error` | Contact form submission failed (client-side) | `src/pages/contact.astro` |
| `contact_form_received` | Server successfully processed a contact form submission | `src/pages/api/contact.ts` |
| `contact_form_server_error` | Server encountered an error processing the contact form | `src/pages/api/contact.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog ([https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards)) with the following insights:

1. **CTA conversion funnel** — Funnel from `cta_clicked` or `contact_sales_clicked` → `contact_form_submitted` → `contact_form_success`
2. **Pricing plan interest** — Trend of `pricing_plan_clicked` broken down by `plan` property (starter vs pro)
3. **Enterprise intent** — Trend of `pricing_enterprise_contact_clicked` over time
4. **Contact form submission rate** — Trend of `contact_form_submitted` vs `contact_form_success` vs `contact_form_error`
5. **Navigation CTA clicks** — Trend of `nav_cta_clicked` over time

To build these, go to **Insights** → **New insight** in your PostHog project and filter by each event name listed above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
