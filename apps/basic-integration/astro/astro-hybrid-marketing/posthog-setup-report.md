<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. The integration covers both client-side tracking via the PostHog web snippet and server-side tracking via `posthog-node` in the contact form API route.

**Changes made:**

- **`src/components/posthog.astro`** — New component that injects the PostHog JS snippet using `is:inline` to prevent Astro from processing it. Initialized from environment variables.
- **`src/lib/posthog-server.ts`** — New singleton for the `posthog-node` client used in API routes.
- **`src/layouts/Layout.astro`** — Imports and renders `<PostHog />` inside `<head>` so every page gets client-side tracking.
- **`src/pages/index.astro`** — Hero CTA buttons now fire `cta_clicked` and `contact_sales_clicked` events.
- **`src/pages/pricing.astro`** — All plan CTA buttons fire `pricing_plan_selected` with plan name and price properties.
- **`src/pages/contact.astro`** — On successful form submit: identifies the user by email and fires `contact_form_submitted`. On failure: calls `captureException`. The PostHog session ID is forwarded to the API via `X-PostHog-Session-Id` header.
- **`src/pages/api/contact.ts`** — Fires `contact_form_received` server-side (with session correlation) and calls `posthog.identify` to record user properties.
- **`.env`** — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` written with correct values.

| Event | Description | File |
|-------|-------------|------|
| `cta_clicked` | User clicks "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" in the hero section | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a pricing plan CTA (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | Contact form submitted successfully (client-side confirmation) | `src/pages/contact.astro` |
| `contact_form_received` | Contact form processed by the server API route | `src/pages/api/contact.ts` |

## Next steps

Dashboard creation requires `dashboard:write` and `query:read` API scopes that were not available for this session. To create an "Analytics basics" dashboard manually, navigate to [Dashboards](/dashboards) in PostHog and add insights for these events:

1. **Trend** — `cta_clicked` over time (top-of-funnel CTA engagement)
2. **Trend** — `pricing_plan_selected` broken down by `plan` property (plan interest distribution)
3. **Funnel** — `cta_clicked` → `contact_form_submitted` (hero-to-contact conversion)
4. **Trend** — `contact_form_received` over time (lead volume)
5. **Trend** — `contact_sales_clicked` over time (enterprise interest signal)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
