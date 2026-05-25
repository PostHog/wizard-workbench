<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. The integration covers both client-side tracking via the PostHog JavaScript snippet and server-side tracking via `posthog-node` in the contact form API route.

**Changes made:**

- Created `src/components/posthog.astro` — the PostHog JavaScript snippet component, loaded in every page via `is:inline` to prevent TypeScript processing errors.
- Updated `src/layouts/Layout.astro` — imports and renders the PostHog component inside `<head>`, enabling analytics on all pages.
- Created `src/lib/posthog-server.ts` — a singleton `posthog-node` client used in server-side API routes.
- Updated `src/pages/index.astro` — tracks "Start Free Trial" and "Contact Sales" hero CTA clicks.
- Updated `src/pages/pricing.astro` — fires `viewed_pricing` on page load (top of funnel) and tracks which plan CTA the user clicks.
- Updated `src/pages/contact.astro` — passes the PostHog session ID and distinct ID to the API route, identifies the user via their email on successful submission, and captures form submit/failure events.
- Updated `src/pages/api/contact.ts` — uses `posthog-node` to capture server-side `contact_form_received` and `contact_form_error` events correlated to the client session via headers.

**Environment variables added to `.env`:**

```
PUBLIC_POSTHOG_PROJECT_TOKEN=…
PUBLIC_POSTHOG_HOST=…
```

## Events instrumented

| Event | Description | File |
|---|---|---|
| `started_free_trial` | User clicked "Start Free Trial" hero CTA | `src/pages/index.astro` |
| `clicked_contact_sales` | User clicked "Contact Sales" hero CTA | `src/pages/index.astro` |
| `viewed_pricing` | User viewed the pricing page (funnel entry point) | `src/pages/pricing.astro` |
| `clicked_pricing_plan` | User clicked a pricing plan CTA (includes `plan` property: starter/pro/enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | User successfully submitted the contact form (includes `interest`, `has_company`) | `src/pages/contact.astro` |
| `contact_form_failed` | Client-side form submission failed (includes `error`, `status`) | `src/pages/contact.astro` |
| `contact_form_received` | Server accepted a valid contact submission (includes `interest`, `has_company`, `source`) | `src/pages/api/contact.ts` |
| `contact_form_error` | Server encountered an error processing the submission | `src/pages/api/contact.ts` |

## Next steps

We've outlined the key insights to build in PostHog based on the events instrumented. Visit your PostHog project to create them:

- **[New insight — Pricing funnel](/insights/new)**: Funnel from `viewed_pricing` → `clicked_pricing_plan` → `contact_form_submitted`. Shows where visitors drop off in the conversion flow.
- **[New insight — CTA clicks trend](/insights/new)**: Trends chart of `started_free_trial` and `clicked_contact_sales` over time. Compare which hero CTA drives more engagement.
- **[New insight — Plan preference breakdown](/insights/new)**: Trends chart of `clicked_pricing_plan` broken down by the `plan` property (starter / pro / enterprise). Reveals which plan attracts the most interest.
- **[New insight — Contact form conversion rate](/insights/new)**: Funnel from `contact_form_submitted` (client) → `contact_form_received` (server). Validates end-to-end form reliability.
- **[New insight — Contact form errors](/insights/new)**: Trends chart of `contact_form_failed` and `contact_form_error`. Monitor submission reliability over time.

Combine all five into a new **"Analytics basics"** dashboard for a complete view of NeuralFlow's marketing funnel health.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
