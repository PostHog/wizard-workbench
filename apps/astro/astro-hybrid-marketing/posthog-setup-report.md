# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Astro hybrid marketing site. This integration includes:

- **Client-side tracking** via the PostHog web snippet in `src/components/posthog.astro`
- **Server-side tracking** using `posthog-node` with a singleton pattern in `src/lib/posthog-server.ts`
- **Session correlation** between client and server using `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers
- **Error tracking** for contact form network errors via `posthog.captureException()`

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `cta_clicked` | User clicked a primary call-to-action button (Start Free Trial, Get Started) | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked Contact Sales button to initiate sales conversation | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked to select a pricing plan (Starter, Pro, Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | User successfully submitted the contact form (server-side event) | `src/pages/api/contact.ts` |
| `contact_form_error` | Contact form submission failed due to validation or server error | `src/pages/api/contact.ts` |
| `nav_cta_clicked` | User clicked the Get Started CTA in the navigation bar | `src/components/Navigation.astro` |

## Files Created

| File | Purpose |
|------|---------|
| `src/components/posthog.astro` | PostHog web snippet for client-side analytics |
| `src/lib/posthog-server.ts` | Server-side PostHog client singleton |
| `.env` | Environment variables for PostHog API key and host |

## Files Modified

| File | Changes |
|------|---------|
| `src/layouts/Layout.astro` | Added PostHog component import and usage in head |
| `src/pages/index.astro` | Added CTA click tracking |
| `src/pages/pricing.astro` | Added pricing plan selection tracking |
| `src/pages/contact.astro` | Added session ID passing to server |
| `src/pages/api/contact.ts` | Added server-side event tracking |
| `src/components/Navigation.astro` | Added nav CTA tracking |

## Environment Variables

The following environment variables are configured in `.env`:

- `PUBLIC_POSTHOG_KEY` - Your PostHog project API key
- `PUBLIC_POSTHOG_HOST` - PostHog API host (https://us.i.posthog.com)

## Next steps

We've instrumented your application with key conversion and engagement events. To get the most out of PostHog:

1. **Create a dashboard** in PostHog with the following suggested insights:
   - Funnel: Homepage Visit → CTA Clicked → Contact Form Submitted
   - Trend: `pricing_plan_selected` by plan_name
   - Trend: `contact_form_submitted` over time
   - Trend: `contact_form_error` by error_type
   - User paths from `nav_cta_clicked`

2. **Set up alerts** for critical events like conversion drops or error spikes

3. **Enable session recordings** to see how users interact with your site

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
